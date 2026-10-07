import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { initiateSTKPush, formatPhoneNumber } from '@/lib/mpesa';
import { z } from 'zod';

/**
 * Newsletter Subscription with M-Pesa Payment
 * POST /api/newsletter/subscribe
 */

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, phoneNumber } = validation.data;

    // Check if email already subscribed and active
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing && existing.status === 'ACTIVE') {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already subscribed',
          message: 'This email is already subscribed to our newsletter.',
        },
        { status: 400 }
      );
    }

    // Format phone number
    let formattedPhone: string;
    try {
      formattedPhone = formatPhoneNumber(phoneNumber);
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number',
          message: 'Please provide a valid Kenyan phone number (e.g., 0712345678)',
        },
        { status: 400 }
      );
    }

    // Create or update subscription record
    const subscription = existing
      ? await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            phoneNumber: formattedPhone,
            status: 'PENDING_PAYMENT',
            paymentStatus: 'PENDING',
          },
        })
      : await prisma.newsletterSubscription.create({
          data: {
            email,
            phoneNumber: formattedPhone,
            status: 'PENDING_PAYMENT',
            paymentStatus: 'PENDING',
            amount: 100,
          },
        });

    console.log('[NEWSLETTER] Subscription created:', subscription.id);

    // Initiate M-Pesa STK Push
    const mpesaResponse = await initiateSTKPush({
      phoneNumber: formattedPhone,
      amount: 100,
      accountReference: subscription.id,
      transactionDesc: 'VeyraTech Newsletter',
    });

    if (!mpesaResponse.success) {
      // Update subscription with failed status
      await prisma.newsletterSubscription.update({
        where: { id: subscription.id },
        data: {
          paymentStatus: 'FAILED',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Payment initiation failed',
          message: mpesaResponse.errorMessage || 'Failed to initiate M-Pesa payment',
        },
        { status: 500 }
      );
    }

    // Update subscription with M-Pesa checkout ID
    await prisma.newsletterSubscription.update({
      where: { id: subscription.id },
      data: {
        mpesaCheckoutId: mpesaResponse.checkoutRequestId,
        paymentStatus: 'PROCESSING',
      },
    });

    console.log('[NEWSLETTER] M-Pesa STK Push sent:', mpesaResponse.checkoutRequestId);

    return NextResponse.json({
      success: true,
      message: 'Payment request sent! Check your phone to complete payment.',
      checkoutRequestId: mpesaResponse.checkoutRequestId,
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error('[NEWSLETTER] Subscribe error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
        message: 'An error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
