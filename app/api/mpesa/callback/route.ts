import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * M-Pesa STK Push Callback Handler
 * POST /api/mpesa/callback
 * 
 * This endpoint receives payment notifications from Safaricom
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[MPESA CALLBACK] Received:', JSON.stringify(body, null, 2));

    const { Body } = body;
    
    if (!Body || !Body.stkCallback) {
      console.error('[MPESA CALLBACK] Invalid payload structure');
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    const { stkCallback } = Body;
    const { 
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata 
    } = stkCallback;

    console.log('[MPESA CALLBACK] Processing:', {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    });

    // Find subscription by checkout ID
    const subscription = await prisma.newsletterSubscription.findFirst({
      where: {
        mpesaCheckoutId: CheckoutRequestID,
      },
    });

    if (!subscription) {
      console.error('[MPESA CALLBACK] Subscription not found:', CheckoutRequestID);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Subscription not found' });
    }

    // ResultCode: 0 = Success, 1032 = Cancelled, others = Failed
    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      
      // Extract payment details
      const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value || 100;
      const mpesaReceiptNumber = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = metadata.find((item: any) => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;

      console.log('[MPESA CALLBACK] Payment successful:', {
        receipt: mpesaReceiptNumber,
        amount,
        phone: phoneNumber,
      });

      // Update subscription to ACTIVE
      await prisma.newsletterSubscription.update({
        where: { id: subscription.id },
        data: {
          status: 'ACTIVE',
          paymentStatus: 'COMPLETED',
          mpesaReceiptNumber,
          paidAt: new Date(),
          subscribedAt: new Date(),
          // Set expiry to 1 year from now
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      console.log('[MPESA CALLBACK] Subscription activated:', subscription.email);

      // TODO: Send welcome email to subscriber
      // await sendWelcomeEmail(subscription.email);

    } else {
      // Payment failed or cancelled
      console.log('[MPESA CALLBACK] Payment failed:', ResultDesc);

      await prisma.newsletterSubscription.update({
        where: { id: subscription.id },
        data: {
          paymentStatus: ResultCode === 1032 ? 'FAILED' : 'FAILED',
          status: 'PENDING_PAYMENT',
        },
      });
    }

    // Acknowledge receipt to Safaricom
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });

  } catch (error: any) {
    console.error('[MPESA CALLBACK] Error:', error.message);
    
    // Still return success to Safaricom to avoid retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Accepted',
    });
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'M-Pesa Callback endpoint',
    status: 'Active',
  });
}
