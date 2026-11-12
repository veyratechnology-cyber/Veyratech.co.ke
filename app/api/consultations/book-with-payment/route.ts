/**
 * CONSULTATION BOOKING WITH PAYMENT INTEGRATION
 * 
 * Handles:
 * - Consultation booking creation
 * - Automatic invoice generation
 * - M-Pesa payment initiation (if selected)
 * - Email notifications
 * - Google Calendar event creation
 */

import { linkLeadToConsultation } from "@/lib/journey";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import { generateInvoiceNumber } from "@/lib/invoices/generator";
import { initiateSTKPush } from "@/lib/mpesa";
import { sendConsultationConfirmation, sendConsultationNotification } from "@/lib/email";
import { reserveTimeSlot } from "@/lib/scheduling";
import { createConsultationEvent, isGoogleCalendarConfigured } from "@/lib/google-calendar";
import { packages } from "@/lib/pricing/packages";
import { enforceRateLimit } from "@/lib/security";

// Validation schema
const bookingSchema = z.object({
  // Package & Payment
  packageId: z.string().min(1, "Package selection is required"),
  packageCategory: z.enum(['consultation', 'ai', 'support']),
  // Client-sent amount is ignored for billing; the server price list is the source of truth.
  quotedAmount: z.number().optional(),
  paymentMethod: z.enum(['MPESA', 'BANK_TRANSFER', 'INVOICE_LATER']),
  mpesaPhone: z.string().optional(),
  
  // Personal Information
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(7, "Phone number is required").max(30),
  company: z.string().max(150).optional(),
  jobTitle: z.string().max(150).optional(),
  
  // Business Information
  industry: z.string().max(100).optional(),
  businessChallenge: z.string().min(20, "Please describe your challenge in more detail").max(5000),
  consultationTypes: z.array(z.string().max(100)).max(20).optional(),
  
  // Meeting Details
  meetingType: z.enum(['GOOGLE_MEET', 'PHONE', 'IN_PERSON']),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  meetingLocation: z.string().max(300).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 5 bookings per IP per hour (each one can trigger an M-Pesa prompt and emails)
    const limited = enforceRateLimit(request, "book-with-payment", 5, 60 * 60 * 1000);
    if (limited) return limited;

    const body = await request.json();
    console.log("[BOOKING] Received booking request:", {
      package: body?.packageId,
      paymentMethod: body?.paymentMethod,
    });

    // Validate input
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      console.error("[BOOKING] Validation failed:", validation.error.errors);
      return NextResponse.json(
        { error: "Invalid booking data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // SECURITY: look up the price on the server. Never trust the amount sent by the browser.
    const pkg = packages[data.packageCategory].find((p) => p.id === data.packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Unknown package" }, { status: 400 });
    }
    const serverPrice = pkg.price;

    // Parse preferred date/time
    let preferredDateTime: Date | null = null;
    try {
      preferredDateTime = new Date(`${data.preferredDate}T${data.preferredTime}:00`);
      if (preferredDateTime < new Date()) {
        return NextResponse.json(
          { error: "Meeting date and time cannot be in the past" },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid date or time format" },
        { status: 400 }
      );
    }

    // Step 1: Create Invoice First
    console.log("[BOOKING] Creating invoice...");
    const invoiceNumber = generateInvoiceNumber();
    const subtotal = serverPrice;
    const vatAmount = subtotal * 0.16; // 16% VAT
    const totalAmount = subtotal + vatAmount;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientName: data.name,
        clientEmail: data.email,
        clientCompany: data.company || null,
        clientPhone: data.phone,
        
        issueDate: new Date(),
        dueDate: data.paymentMethod === 'INVOICE_LATER'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 days
        
        subtotal,
        vatRate: 16.00,
        vatAmount,
        totalAmount,
        currency: "KSH",
        
        status: "DRAFT",
        paymentStatus: data.paymentMethod === 'INVOICE_LATER' ? 'PENDING' : 'PENDING',
        paymentMethod: data.paymentMethod as any,
        
        notes: `Consultation booking: ${data.packageId}`,
        terms: "Payment due within 30 days of invoice date. All prices include 16% VAT.",
        
        items: {
          create: [
            {
              description: `${data.packageCategory.charAt(0).toUpperCase() + data.packageCategory.slice(1)} Package: ${data.packageId}`,
              quantity: 1,
              unitPrice: subtotal,
              total: subtotal,
              displayOrder: 1,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    console.log("[BOOKING] Invoice created:", invoice.invoiceNumber);

    // Step 2: Reserve Time Slot and Create Consultation
    console.log("[BOOKING] Reserving time slot...");
    const duration = 60; // minutes
    
    const reservation = await reserveTimeSlot(
      preferredDateTime,
      duration,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        industry: data.industry as any,
        consultationTypes: { set: data.consultationTypes as any[] || [] },
        businessChallenge: data.businessChallenge,
        meetingType: data.meetingType as any,
        meetingLocation: data.meetingLocation,
        meetingDuration: duration,
        preferredTime: data.preferredTime,
        status: 'NEW' as any,
        
        // Add payment tracking
        packageId: data.packageId,
        packageName: `${data.packageCategory} - ${data.packageId}`,
        quotedAmount: serverPrice,
        paymentStatus: data.paymentMethod === 'MPESA' ? 'PROCESSING' : 'PENDING',
        paymentMethod: data.paymentMethod,
        invoiceId: invoice.id,
      }
    );

    if (!reservation.success) {
      // Cleanup: Delete invoice if consultation creation failed
      await prisma.invoice.delete({ where: { id: invoice.id } });
      return NextResponse.json(
        { error: reservation.error || "Failed to reserve time slot" },
        { status: 400 }
      );
    }

    const consultation = reservation.consultation;
    const actualScheduledAt = reservation.actualScheduledAt;

    // Pipeline: every booking becomes (or updates) a Lead in the admin
    await linkLeadToConsultation({
      consultationId: consultation.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      businessChallenge: data.businessChallenge,
    });

    // Update invoice with consultation link
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        consultationId: consultation.id,
        status: "SENT",
      },
    });

    console.log("[BOOKING] Consultation created:", consultation.id);

    // Step 3: Create Google Calendar Event (if applicable and scheduled)
    let googleMeetLink: string | undefined;
    if (actualScheduledAt && data.meetingType === 'GOOGLE_MEET' && isGoogleCalendarConfigured()) {
      try {
        const calendarEvent = await createConsultationEvent({
          consultationId: consultation.id,
          clientName: data.name,
          clientEmail: data.email,
          clientPhone: data.phone,
          company: data.company,
          consultationTypes: data.consultationTypes || [],
          businessChallenge: data.businessChallenge,
          startDateTime: actualScheduledAt,
          duration,
          meetingType: data.meetingType as any,
        });
        
        googleMeetLink = calendarEvent.meetLink;
        
        await prisma.consultation.update({
          where: { id: consultation.id },
          data: {
            googleCalendarEventId: calendarEvent.eventId,
            googleMeetLink: calendarEvent.meetLink,
          },
        });
        
        console.log("[BOOKING] Google Calendar event created");
      } catch (error: any) {
        console.error("[BOOKING] Google Calendar error:", error.message);
        // Non-blocking error
      }
    }

    // Step 4: Initiate Payment (if M-Pesa)
    let paymentInitiated = false;
    let mpesaCheckoutId: string | undefined;

    if (data.paymentMethod === 'MPESA' && data.mpesaPhone) {
      console.log("[BOOKING] Initiating M-Pesa payment...");
      
      try {
        const mpesaResult = await initiateSTKPush({
          phoneNumber: data.mpesaPhone,
          amount: Math.round(totalAmount), // M-Pesa requires integer
          accountReference: invoice.invoiceNumber,
          transactionDesc: `VeyraTech Consultation - ${invoice.invoiceNumber}`,
        });

        if (mpesaResult.success && mpesaResult.checkoutRequestId) {
          paymentInitiated = true;
          mpesaCheckoutId = mpesaResult.checkoutRequestId;
          
          // Update consultation with M-Pesa checkout ID
          await prisma.consultation.update({
            where: { id: consultation.id },
            data: {
              notes: `M-Pesa Checkout ID: ${mpesaCheckoutId}`,
            },
          });
          
          console.log("[BOOKING] M-Pesa STK Push initiated:", mpesaCheckoutId);
        } else {
          console.error("[BOOKING] M-Pesa initiation failed:", mpesaResult.errorMessage);
          // Update status but don't fail the booking
          await prisma.consultation.update({
            where: { id: consultation.id },
            data: { paymentStatus: 'FAILED' },
          });
        }
      } catch (error: any) {
        console.error("[BOOKING] M-Pesa error:", error.message);
        // Non-blocking error - booking still succeeds
      }
    }

    // Step 5: Send Email Notifications
    console.log("[BOOKING] Sending email notifications...");
    
    try {
      // Import email functions dynamically to avoid circular dependencies
      const { sendConsultationNotifications } = await import("@/lib/notifications");
      
      await sendConsultationNotifications({
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        industry: data.industry,
        businessChallenge: data.businessChallenge,
        consultationId: consultation.id,
        scheduledAt: actualScheduledAt || undefined,
        wasRescheduled: reservation.wasRescheduled,
        googleMeetLink,
        meetingType: data.meetingType,
      });
      
      console.log("[BOOKING] Email notifications sent");
    } catch (error: any) {
      console.error("[BOOKING] Email notification error:", error.message);
      // Non-blocking error
    }

    // Step 6: Create Admin Notifications
    try {
      const activeAdmins = await prisma.admin.findMany({
        where: { status: "ACTIVE" },
        select: { id: true },
      });

      if (activeAdmins.length > 0) {
        await prisma.notification.createMany({
          data: activeAdmins.map((admin) => ({
            adminId: admin.id,
            type: "NEW_CONSULTATION",
            title: "New Paid Consultation Booking",
            message: `${data.name} booked a ${data.packageCategory} consultation (${data.packageId}) for KSH ${serverPrice.toLocaleString()}. Payment: ${data.paymentMethod}`,
            link: `/admin/consultations/${consultation.id}`,
            isRead: false,
          })),
        });
      }
    } catch (error: any) {
      console.error("[BOOKING] Admin notification error:", error.message);
      // Non-blocking error
    }

    console.log("[BOOKING] Booking completed successfully!");

    return NextResponse.json(
      {
        success: true,
        consultationId: consultation.id,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        paymentInitiated,
        mpesaCheckoutId,
        message: paymentInitiated
          ? "Booking confirmed! Please check your phone for the M-Pesa payment prompt."
          : data.paymentMethod === 'INVOICE_LATER'
          ? "Booking confirmed! Invoice sent to your email."
          : "Booking confirmed! Payment instructions sent to your email.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[BOOKING] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: "Please try again or contact us at consulting@veyratech.co.ke",
      },
      { status: 500 }
    );
  }
}
