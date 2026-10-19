/**
 * M-PESA CALLBACK HANDLER
 * 
 * Receives payment notifications from Safaricom Daraja API
 * Updates invoice and consultation status based on payment result
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[MPESA-CALLBACK] Received callback:", JSON.stringify(body, null, 2));

    // M-Pesa callback structure:
    // {
    //   Body: {
    //     stkCallback: {
    //       MerchantRequestID: "...",
    //       CheckoutRequestID: "...",
    //       ResultCode: 0, // 0 = success, others = failure
    //       ResultDesc: "...",
    //       CallbackMetadata: {
    //         Item: [
    //           { Name: "Amount", Value: 100 },
    //           { Name: "MpesaReceiptNumber", Value: "..." },
    //           { Name: "TransactionDate", Value: 20230101120000 },
    //           { Name: "PhoneNumber", Value: 254712345678 }
    //         ]
    //       }
    //     }
    //   }
    // }

    const stkCallback = body?.Body?.stkCallback;
    
    if (!stkCallback) {
      console.error("[MPESA-CALLBACK] Invalid callback structure");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback" });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    console.log("[MPESA-CALLBACK] Processing:", {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    });

    // Find consultation by checkout ID (stored in notes)
    const consultation = await prisma.consultation.findFirst({
      where: {
        notes: {
          contains: CheckoutRequestID,
        },
      },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get the most recent invoice
        },
      },
    });

    if (!consultation) {
      console.error("[MPESA-CALLBACK] Consultation not found for checkout:", CheckoutRequestID);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Consultation not found" });
    }

    const invoice = consultation.invoices[0];
    if (!invoice) {
      console.error("[MPESA-CALLBACK] Invoice not found for consultation:", consultation.id);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invoice not found" });
    }

    // Check if payment already processed (idempotency)
    const existingPayment = await prisma.invoicePayment.findFirst({
      where: {
        invoiceId: invoice.id,
        transactionId: CheckoutRequestID,
      },
    });

    if (existingPayment) {
      console.log("[MPESA-CALLBACK] Payment already processed");
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Already processed" });
    }

    // ResultCode 0 = Success
    if (ResultCode === 0 && CallbackMetadata?.Item) {
      // Extract payment details
      const metadata = CallbackMetadata.Item.reduce((acc: any, item: any) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      const {
        Amount,
        MpesaReceiptNumber,
        TransactionDate,
        PhoneNumber,
      } = metadata;

      console.log("[MPESA-CALLBACK] Payment successful:", {
        Amount,
        MpesaReceiptNumber,
        TransactionDate,
        PhoneNumber,
      });

      // Create payment record
      await prisma.invoicePayment.create({
        data: {
          invoiceId: invoice.id,
          amount: Amount,
          paymentMethod: "MPESA",
          paymentReference: MpesaReceiptNumber,
          paymentDate: new Date(),
          transactionId: CheckoutRequestID,
          mpesaReceiptNumber: MpesaReceiptNumber,
          notes: `M-Pesa payment from ${PhoneNumber}`,
        },
      });

      // Update invoice status
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          paymentStatus: "COMPLETED",
          status: "PAID",
          paymentReference: MpesaReceiptNumber,
          paidAt: new Date(),
          paidAmount: Amount,
        },
      });

      // Update consultation status
      await prisma.consultation.update({
        where: { id: consultation.id },
        data: {
          paymentStatus: "PAID",
          status: "SCHEDULED", // Move to scheduled since payment is confirmed
        },
      });

      // Create invoice history record
      await prisma.invoiceHistory.create({
        data: {
          invoiceId: invoice.id,
          action: "PAYMENT_RECEIVED",
          newValue: `M-Pesa payment: KSH ${Amount} - ${MpesaReceiptNumber}`,
          performedAt: new Date(),
          notes: `Automatic M-Pesa callback processing`,
        },
      });

      console.log("[MPESA-CALLBACK] Payment processed successfully");

      // Send payment confirmation email (async, non-blocking)
      (async () => {
        try {
          // TODO: Import and send payment confirmation email
          console.log("[MPESA-CALLBACK] TODO: Send payment confirmation email");
        } catch (error) {
          console.error("[MPESA-CALLBACK] Email error:", error);
        }
      })();

      return NextResponse.json({ ResultCode: 0, ResultDesc: "Payment processed successfully" });
    } else {
      // Payment failed
      console.log("[MPESA-CALLBACK] Payment failed:", ResultDesc);

      await prisma.consultation.update({
        where: { id: consultation.id },
        data: {
          paymentStatus: "FAILED",
          notes: `${consultation.notes}\nPayment failed: ${ResultDesc}`,
        },
      });

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          paymentStatus: "FAILED",
        },
      });

      // Create invoice history record
      await prisma.invoiceHistory.create({
        data: {
          invoiceId: invoice.id,
          action: "PAYMENT_FAILED",
          newValue: ResultDesc,
          performedAt: new Date(),
          notes: `M-Pesa payment failed`,
        },
      });

      return NextResponse.json({ ResultCode: 0, ResultDesc: "Payment failure recorded" });
    }
  } catch (error: any) {
    console.error("[MPESA-CALLBACK] Error processing callback:", error);
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Internal server error" },
      { status: 500 }
    );
  }
}
