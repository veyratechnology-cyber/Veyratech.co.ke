import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Check Newsletter Subscription Payment Status
 * GET /api/newsletter/status?subscriptionId=xxx
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { id: subscriptionId },
      select: {
        id: true,
        email: true,
        status: true,
        paymentStatus: true,
        paidAt: true,
        createdAt: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error: any) {
    console.error('[NEWSLETTER STATUS] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
