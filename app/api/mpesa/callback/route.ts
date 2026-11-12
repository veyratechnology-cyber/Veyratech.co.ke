/**
 * M-PESA CALLBACK HANDLER
 * 
 * Receives payment notifications from Safaricom Daraja API
 * Updates invoice and consultation status based on payment result
 */

import { sendPaymentReceivedEmail } from "@/lib/journey";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { timingSafeEqual } from "crypto";
import { querySTKPushStatus } from "@/lib/mpesa";

/**
 * Authenticity checks:
 * 1. If MPESA_CALLBACK_SECRET is set, the callback URL carries ?token=<secret>
 *    (added in lib/mpesa) and requests without it are rejected.
 * 2. If no secret is configured, a "success" callback is confirmed by asking
 *    Safaricom directly (STK Push Query) before anything is marked as paid.
 * 3. The paid amount must cover the invoice total.
 */
function tokenMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function confirmedBySafaricom(checkoutRequestId: string): Promise<boolean> {
  try {
    const result = await querySTKPushStatus({ checkoutRequestId });
    return String(result?.ResultCode) === "0";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.MPESA_CALLBACK_SECRET;
    if (secret && !tokenMatches(request.nextUrl.searchParams.get("token"), secret)) {
      console.warn("[MPESA-CALLBACK] Rejected callback with missing/invalid token");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

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
    
    if (!stkCallback || typeof stkCallback.CheckoutRequestID !== "string" || !stkCallback.CheckoutRequestID) {
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
        PhoneNumber,
      } = metadata;

      if (!secret && !(await confirmedBySafaricom(CheckoutRequestID))) {
        console.warn("[MPESA-CALLBACK] Success callback could not be confirmed with Safaricom");
        return NextResponse.json({ ResultCode: 1, ResultDesc: "Unverified" }, { status: 400 });
      }

      const expected = Math.round(Number(invoice.totalAmount ?? 0));
      if (!Number.isFinite(Number(Amount)) || Number(Amount) < expected) {
        console.warn("[MPESA-CALLBACK] Amount mismatch", { paid: Amount, expected, invoiceId: invoice.id });
        await prisma.invoiceHistory.create({
          data: {
            invoiceId: invoice.id,
            action: "PAYMENT_FAILED",
            newValue: `Amount mismatch: paid ${Amount}, expected ${expected}`,
            performedAt: new Date(),
            notes: "M-Pesa callback rejected - amount lower than invoice total",
          },
        });
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Amount mismatch recorded" });
      }

      console.log("[MPESA-CALLBACK] Payment successful:", { MpesaReceiptNumber, invoiceId: invoice.id });

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
      await sendPaymentReceivedEmail({
        name: consultation.name,
        email: consultation.email,
        amount: Number(Amount),
        receipt: String(MpesaReceiptNumber),
        invoiceNumber: invoice.invoiceNumber,
        scheduledAt: consultation.actualScheduledAt,
      });

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
