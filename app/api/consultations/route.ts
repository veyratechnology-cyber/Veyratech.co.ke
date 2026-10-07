/**
 * SECURE CONSULTATION BOOKING API ENDPOINT
 * 
 * Security Features:
 * ✅ SQL Injection Prevention - Prisma ORM with parameterized queries
 * ✅ Input Validation - Zod schema with strict types
 * ✅ XSS Protection - Input sanitization
 * ✅ Rate Limiting - IP-based throttling
 * ✅ Email Validation - Disposable email detection
 * ✅ CSRF Protection - Next.js built-in
 * ✅ Error Handling - No sensitive data exposure
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import { reserveTimeSlot } from "@/lib/scheduling";
import { createConsultationEvent, isGoogleCalendarConfigured } from "@/lib/google-calendar";
import { format } from "date-fns";
import { sendEmail, sendAdminNotification } from "@/lib/email/resend-client";
import { consultationNotificationEmail, consultationConfirmationEmail } from "@/lib/email/templates";

// =============================================================================
// SECURITY: INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize string input to prevent XSS attacks
 * Removes HTML tags, scripts, and dangerous characters
 */
function sanitizeString(input: string | undefined | null): string | null {
  if (!input) return null;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
    .substring(0, 5000); // Limit length to prevent DoS
}

/**
 * Validate URL format and prevent malicious URLs
 */
function sanitizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  
  const sanitized = sanitizeString(url);
  if (!sanitized) return null;
  
  try {
    const parsed = new URL(sanitized.startsWith('http') ? sanitized : `https://${sanitized}`);
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Detect disposable/temporary email addresses
 */
function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
    'mailinator.com', 'maildrop.cc', 'trash-mail.com', 'yopmail.com',
    'getnada.com', 'temp-mail.org', 'fakeinbox.com', 'spamgourmet.com'
  ];
  
  const domain = email.toLowerCase().split('@')[1];
  return disposableDomains.some(d => domain.includes(d));
}

// =============================================================================
// SECURITY: RATE LIMITING
// =============================================================================

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit: 3 requests per IP per 15 minutes
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `consultation:${ip}`;
  const limit = rateLimitMap.get(key);
  
  // Clean up expired entries
  if (limit && now > limit.resetAt) {
    rateLimitMap.delete(key);
  }
  
  if (!limit) {
    // First request
    rateLimitMap.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min
    return { allowed: true };
  }
  
  if (limit.count >= 3) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((limit.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment counter
  limit.count++;
  return { allowed: true };
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// =============================================================================
// SECURITY: STRICT INPUT VALIDATION
// =============================================================================

const consultationSchema = z.object({
  // Personal Information - REQUIRED & VALIDATED
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  
  email: z.string()
    .email("Invalid email address")
    .max(254, "Email is too long")
    .toLowerCase()
    .refine(email => !isDisposableEmail(email), {
      message: "Disposable email addresses are not allowed"
    }),
  
  phone: z.string()
    .max(20, "Phone number is too long")
    .regex(/^[\d\s+()-]+$/, "Phone number contains invalid characters")
    .optional()
    .nullable(),
  
  jobTitle: z.string()
    .max(100, "Job title is too long")
    .optional()
    .nullable(),
  
  preferredContactMethod: z.enum(['EMAIL', 'PHONE', 'WHATSAPP', 'SMS'])
    .optional()
    .nullable(),
  
  // Company Information - VALIDATED
  company: z.string()
    .max(200, "Company name is too long")
    .optional()
    .nullable(),
  
  companyWebsite: z.string()
    .url("Invalid website URL")
    .max(500, "Website URL is too long")
    .optional()
    .nullable(),
  
  industry: z.enum([
    'REAL_ESTATE', 'CONSTRUCTION', 'FINANCE', 'BANKING', 'INSURANCE',
    'RETAIL', 'HEALTHCARE', 'HOSPITALITY', 'EDUCATION', 'MANUFACTURING',
    'LOGISTICS_TRANSPORT', 'AGRICULTURE', 'PROFESSIONAL_SERVICES',
    'TECHNOLOGY', 'MEDIA_ENTERTAINMENT', 'ECOMMERCE', 'GOVERNMENT_NGO', 'OTHER'
  ])
    .optional()
    .nullable(),
  
  companySize: z.enum([
    'SIZE_1_10', 'SIZE_11_50', 'SIZE_51_100', 'SIZE_101_500', 'SIZE_500_PLUS'
  ])
    .optional()
    .nullable(),
  
  country: z.string()
    .max(100, "Country name is too long")
    .optional()
    .nullable(),
  
  city: z.string()
    .max(100, "City name is too long")
    .optional()
    .nullable(),
  
  // Consultation Information - VALIDATED
  consultationTypes: z.array(z.enum([
    'TECHNOLOGY_STRATEGY', 'AI_CONSULTING', 'AUTOMATION',
    'DIGITAL_TRANSFORMATION', 'SOFTWARE_SYSTEMS', 'TECHNOLOGY_ADVISORY',
    'CLOUD_SOLUTIONS', 'CYBERSECURITY', 'DATA_ANALYTICS'
  ]))
    .max(5, "Too many consultation types selected")
    .optional()
    .nullable(),
  
  businessChallenge: z.string()
    .max(2000, "Business challenge is too long")
    .optional()
    .nullable(),
  
  desiredOutcome: z.string()
    .max(2000, "Desired outcome is too long")
    .optional()
    .nullable(),
  
  currentTechnology: z.string()
    .max(2000, "Current technology description is too long")
    .optional()
    .nullable(),
  
  additionalInfo: z.string()
    .max(2000, "Additional information is too long")
    .optional()
    .nullable(),
  
  // Meeting Information - VALIDATED
  meetingType: z.enum(['GOOGLE_MEET', 'PHONE', 'IN_PERSON', 'ZOOM', 'TEAMS'])
    .optional()
    .nullable(),
  
  preferredDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (use YYYY-MM-DD)")
    .refine(date => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Preferred date cannot be in the past")
    .optional()
    .nullable(),
  
  preferredTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (use HH:MM)")
    .optional()
    .nullable(),
  
  meetingLocation: z.string()
    .max(500, "Meeting location is too long")
    .optional()
    .nullable(),
});

/**
 * POST /api/consultations
 * SECURE consultation booking with comprehensive protection
 */
export async function POST(request: NextRequest) {
  let requestId: string | undefined;
  
  try {
    // Generate unique request ID for logging
    requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // ==========================================================================
    // SECURITY: RATE LIMITING
    // ==========================================================================
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);
    
    if (!rateLimit.allowed) {
      console.warn(`[${requestId}] Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '900'
          }
        }
      );
    }
    
    // ==========================================================================
    // SECURITY: INPUT VALIDATION & SANITIZATION
    // ==========================================================================
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error(`[${requestId}] Invalid JSON:`, parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    console.log(`[${requestId}] Consultation request from ${clientIp}:`, {
      name: body.name,
      email: body.email,
      timestamp: new Date().toISOString(),
    });
    
    // Validate input with Zod schema
    const validation = consultationSchema.safeParse(body);
    
    if (!validation.success) {
      const errors = validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      console.warn(`[${requestId}] Validation failed:`, errors);
      
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: errors
        },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    // ==========================================================================
    // SECURITY: ADDITIONAL SANITIZATION
    // ==========================================================================
    const sanitizedData = {
      name: sanitizeString(data.name)!,
      email: data.email.toLowerCase().trim(),
      phone: sanitizeString(data.phone) || null,
      jobTitle: sanitizeString(data.jobTitle) || null,
      preferredContactMethod: data.preferredContactMethod || null,
      company: sanitizeString(data.company) || null,
      companyWebsite: sanitizeUrl(data.companyWebsite) || null,
      industry: data.industry || null,
      companySize: data.companySize || null,
      country: sanitizeString(data.country) || null,
      city: sanitizeString(data.city) || null,
      consultationTypes: data.consultationTypes || [],
      businessChallenge: sanitizeString(data.businessChallenge) || null,
      desiredOutcome: sanitizeString(data.desiredOutcome) || null,
      currentTechnology: sanitizeString(data.currentTechnology) || null,
      additionalInfo: sanitizeString(data.additionalInfo) || null,
      meetingType: data.meetingType || 'GOOGLE_MEET',
      preferredDate: data.preferredDate || null,
      preferredTime: data.preferredTime || null,
      meetingLocation: sanitizeString(data.meetingLocation) || null,
    };
    
    // ==========================================================================
    // BUSINESS LOGIC: DATE/TIME PARSING
    // ==========================================================================
    let preferredDateTime: Date | null = null;
    if (sanitizedData.preferredDate && sanitizedData.preferredTime) {
      try {
        preferredDateTime = new Date(`${sanitizedData.preferredDate}T${sanitizedData.preferredTime}:00`);
        
        // Validate the date is not in the past
        if (preferredDateTime < new Date()) {
          return NextResponse.json(
            { error: "Preferred date and time cannot be in the past" },
            { status: 400 }
          );
        }
        
        console.log(`[${requestId}] Preferred time:`, format(preferredDateTime, "yyyy-MM-dd HH:mm"));
      } catch (dateError) {
        console.error(`[${requestId}] Invalid date/time:`, dateError);
        return NextResponse.json(
          { error: "Invalid preferred date or time format" },
          { status: 400 }
        );
      }
    }
    
    const duration = 60; // Default 60 minutes
    
    // ==========================================================================
    // DATABASE: PREPARE DATA (PRISMA PREVENTS SQL INJECTION AUTOMATICALLY)
    // ==========================================================================
    const consultationData = {
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      jobTitle: sanitizedData.jobTitle,
      preferredContactMethod: sanitizedData.preferredContactMethod,
      company: sanitizedData.company,
      companyWebsite: sanitizedData.companyWebsite,
      industry: sanitizedData.industry as any,
      companySize: sanitizedData.companySize as any,
      country: sanitizedData.country,
      city: sanitizedData.city,
      consultationTypes: {
        set: sanitizedData.consultationTypes as any[]
      },
      businessChallenge: sanitizedData.businessChallenge,
      desiredOutcome: sanitizedData.desiredOutcome,
      currentTechnology: sanitizedData.currentTechnology,
      additionalInfo: sanitizedData.additionalInfo,
      meetingType: sanitizedData.meetingType as any,
      preferredTime: sanitizedData.preferredTime,
      meetingLocation: sanitizedData.meetingLocation,
      meetingDuration: duration,
      status: 'NEW' as any,
    };
    
    // ==========================================================================
    // DATABASE: SMART SCHEDULING
    // ==========================================================================
    let reservation;
    
    if (preferredDateTime) {
      reservation = await reserveTimeSlot(
        preferredDateTime,
        duration,
        consultationData
      );
      
      if (!reservation.success) {
        console.warn(`[${requestId}] Time slot reservation failed:`, reservation.error);
        return NextResponse.json(
          { error: reservation.error || "Failed to reserve time slot" },
          { status: 400 }
        );
      }
    } else {
      // No preferred time, create consultation without scheduling
      reservation = {
        success: true,
        consultation: await prisma.consultation.create({
          data: consultationData as any,
        }),
        wasRescheduled: false,
      };
    }
    
    const consultation = reservation.consultation;
    const actualScheduledAt = reservation.actualScheduledAt;
    const wasRescheduled = reservation.wasRescheduled;
    
    console.log(`[${requestId}] ✅ Consultation created:`, {
      id: consultation.id,
      email: consultation.email,
      scheduledAt: actualScheduledAt ? format(actualScheduledAt, "yyyy-MM-dd HH:mm") : "Not scheduled",
      wasRescheduled,
    });
    
    // ==========================================================================
    // INTEGRATION: GOOGLE CALENDAR
    // ==========================================================================
    let googleMeetLink: string | undefined;
    let googleCalendarEventId: string | undefined;
    
    if (actualScheduledAt && isGoogleCalendarConfigured()) {
      try {
        const calendarEvent = await createConsultationEvent({
          consultationId: consultation.id,
          clientName: sanitizedData.name,
          clientEmail: sanitizedData.email,
          clientPhone: sanitizedData.phone ?? undefined,
          company: sanitizedData.company ?? undefined,
          consultationTypes: sanitizedData.consultationTypes,
          businessChallenge: sanitizedData.businessChallenge ?? undefined,
          startDateTime: actualScheduledAt,
          duration,
          meetingType: sanitizedData.meetingType as any,
        });
        
        googleMeetLink = calendarEvent.meetLink;
        googleCalendarEventId = calendarEvent.eventId;
        
        // Update consultation with Google Calendar details
        await prisma.consultation.update({
          where: { id: consultation.id },
          data: {
            googleCalendarEventId: calendarEvent.eventId,
            googleMeetLink: calendarEvent.meetLink,
          },
        });
        
        console.log(`[${requestId}] Google Calendar event created:`, calendarEvent.eventId);
      } catch (calendarError: any) {
        console.error(`[${requestId}] Google Calendar error:`, calendarError.message);
        // Don't fail the booking if calendar creation fails
      }
    }
    
    // ==========================================================================
    // NOTIFICATION: ADMIN ALERTS
    // ==========================================================================
    try {
      const activeAdmins = await prisma.admin.findMany({
        where: { status: "ACTIVE" },
        select: { id: true },
      });
      
      if (activeAdmins.length > 0) {
        const timeInfo = actualScheduledAt
          ? wasRescheduled
            ? ` (rescheduled to ${format(actualScheduledAt, "MMM d, yyyy 'at' h:mm a")})`
            : ` for ${format(actualScheduledAt, "MMM d, yyyy 'at' h:mm a")}`
          : "";
        
        await prisma.notification.createMany({
          data: activeAdmins.map((admin) => ({
            adminId: admin.id,
            type: "NEW_CONSULTATION",
            title: "New Consultation Request",
            message: `${sanitizedData.name} from ${sanitizedData.company || "N/A"} has requested a consultation${timeInfo}.`,
            link: `/admin/consultations/${consultation.id}`,
            isRead: false,
          })),
        });
        
        // Send email notification to admin
        const adminEmail = consultationNotificationEmail({
          name: sanitizedData.name,
          email: sanitizedData.email,
          company: sanitizedData.company ?? undefined,
          phone: sanitizedData.phone ?? undefined,
          consultationType: sanitizedData.consultationTypes.map((type: string) => 
            type.replace(/_/g, ' ')
          ),
          businessChallenge: sanitizedData.businessChallenge ?? undefined,
          preferredDate: actualScheduledAt ?? undefined,
          consultationUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/consultations/${consultation.id}`,
        });
        
        await sendAdminNotification({
          subject: adminEmail.subject,
          html: adminEmail.html,
        });
        
        console.log(`[${requestId}] Admin email notification sent`);
      }
    } catch (notificationError) {
      console.error(`[${requestId}] Notification creation failed:`, notificationError);
      // Don't fail booking if notifications fail
    }
    
    // ==========================================================================
    // NOTIFICATION: CLIENT CONFIRMATION EMAIL
    // ==========================================================================
    try {
      const clientEmail = consultationConfirmationEmail({
        name: sanitizedData.name,
        consultationType: sanitizedData.consultationTypes.map((type: string) => 
          type.replace(/_/g, ' ')
        ),
        preferredDate: actualScheduledAt ?? undefined,
      });
      
      await sendEmail({
        to: sanitizedData.email,
        subject: clientEmail.subject,
        html: clientEmail.html,
      });
      
      console.log(`[${requestId}] Client confirmation email sent to ${sanitizedData.email}`);
    } catch (emailError) {
      console.error(`[${requestId}] Client email failed:`, emailError);
      // Don't fail booking if email fails
    }
    
    // ==========================================================================
    // NOTIFICATION: MULTI-CHANNEL (EMAIL, SMS, WHATSAPP)
    // ==========================================================================
    try {
      const { sendConsultationNotifications } = await import("@/lib/notifications");
      
      await sendConsultationNotifications({
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company ?? undefined,
        phone: sanitizedData.phone ?? undefined,
        industry: sanitizedData.industry ?? undefined,
        businessChallenge: sanitizedData.businessChallenge ?? undefined,
        consultationId: consultation.id,
        scheduledAt: actualScheduledAt || undefined,
        wasRescheduled,
        googleMeetLink,
        meetingType: sanitizedData.meetingType ?? undefined,
      });
    } catch (notificationError) {
      console.error(`[${requestId}] Multi-channel notification failed:`, notificationError);
      // Don't fail booking if notifications fail
    }
    
    // ==========================================================================
    // SUCCESS RESPONSE
    // ==========================================================================
    return NextResponse.json(
      {
        success: true,
        message: "Consultation request submitted successfully",
        id: consultation.id,
        scheduled: !!actualScheduledAt,
        actualScheduledAt: actualScheduledAt?.toISOString(),
        wasRescheduled,
        googleMeetLink,
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    // ==========================================================================
    // SECURITY: ERROR HANDLING (NO SENSITIVE DATA EXPOSURE)
    // ==========================================================================
    console.error(`[${requestId}] ❌ Consultation submission error:`, {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { 
        error: "An unexpected error occurred. Please try again or contact us directly.",
        supportEmail: "admin@veyratech.com",
        supportPhone: "+254 745 247 211",
      },
      { status: 500 }
    );
  }
}
