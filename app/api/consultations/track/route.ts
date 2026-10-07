import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/consultations/track?email=user@example.com
 * Track consultation progress by email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email address required' },
        { status: 400 }
      );
    }

    // Find all consultations for this email
    const consultations = await prisma.consultation.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        actualScheduledAt: true,
        googleMeetLink: true,
        meetingType: true,
        consultationTypes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (consultations.length === 0) {
      return NextResponse.json(
        { error: 'No consultations found for this email' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      consultations,
      count: consultations.length,
    });
  } catch (error: any) {
    console.error('[API] Track consultation error:', error);
    return NextResponse.json(
      { error: 'Failed to track consultations', details: error.message },
      { status: 500 }
    );
  }
}
