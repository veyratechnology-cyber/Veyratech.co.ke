import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMeetingReminders } from '@/lib/notifications/index';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Automated Meeting Reminders Cron Job
 * GET /api/cron/send-reminders
 * 
 * This endpoint should be called by a cron service (Vercel Cron, etc.)
 * to send automated reminders at:
 * - 24 hours before meeting
 * - 1 hour before meeting  
 * - 10 minutes before meeting
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[CRON] Unauthorized reminder request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting reminder job...');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
    const in10Minutes = new Date(now.getTime() + 10 * 60 * 1000);

    // Find consultations that need reminders
    const consultations = await prisma.consultation.findMany({
      where: {
        actualScheduledAt: {
          gte: now,
          lte: in24Hours,
        },
        status: {
          in: ['SCHEDULED'],
        },
        googleMeetLink: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        actualScheduledAt: true,
        googleMeetLink: true,
      },
    });

    const remindersSent: any[] = [];
    const errors: any[] = [];

    for (const consultation of consultations) {
      if (!consultation.actualScheduledAt || !consultation.googleMeetLink) {
        continue;
      }

      const meetingTime = new Date(consultation.actualScheduledAt);
      const hoursUntilMeeting = (meetingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      let reminderType: string | null = null;

      // Determine which reminder to send
      if (hoursUntilMeeting <= 0.17 && hoursUntilMeeting > 0) {
        // 10 minutes before
        reminderType = '10-minute';
      } else if (hoursUntilMeeting <= 1 && hoursUntilMeeting > 0.5) {
        // 1 hour before
        reminderType = '1-hour';
      } else if (hoursUntilMeeting <= 24 && hoursUntilMeeting > 23) {
        // 24 hours before
        reminderType = '24-hour';
      }

      if (!reminderType) {
        continue;
      }

      try {
        // Check if reminder already sent
        const existingReminder = await prisma.consultationReminder.findFirst({
          where: {
            consultationId: consultation.id,
            reminderType: reminderType === '10-minute'
              ? 'REMINDER_10M'
              : reminderType === '1-hour'
              ? 'REMINDER_1H'
              : 'REMINDER_24H',
            sentAt: { not: null },
          },
        });

        if (existingReminder) {
          console.log(`[CRON] Reminder already sent for ${consultation.id} (${reminderType})`);
          continue;
        }

        // Send reminders
        const result = await sendMeetingReminders({
          consultationId: consultation.id,
          name: consultation.name,
          email: consultation.email,
          phone: consultation.phone ?? undefined,
          meetingDate: meetingTime,
          googleMeetLink: consultation.googleMeetLink,
          hoursBeforeMeeting: hoursUntilMeeting,
        });

        // Record reminder sent
        await prisma.consultationReminder.create({
          data: {
            consultationId: consultation.id,
            reminderType: reminderType === '10-minute'
              ? 'REMINDER_10M'
              : reminderType === '1-hour'
              ? 'REMINDER_1H'
              : 'REMINDER_24H',
            scheduledFor: now,
            sentAt: now,
            recipientType: 'client',
            status: 'sent',
          },
        });

        remindersSent.push({
          consultationId: consultation.id,
          type: reminderType,
          channels: result,
        });

        console.log(`[CRON] ✅ Reminder sent for ${consultation.id} (${reminderType})`);
      } catch (error: any) {
        console.error(`[CRON] Error sending reminder for ${consultation.id}:`, error.message);
        errors.push({
          consultationId: consultation.id,
          error: error.message,
        });
      }
    }

    console.log(`[CRON] Reminder job complete: ${remindersSent.length} sent, ${errors.length} errors`);

    return NextResponse.json({
      success: true,
      remindersSent: remindersSent.length,
      errors: errors.length,
      details: {
        sent: remindersSent,
        errors,
      },
    });
  } catch (error: any) {
    console.error('[CRON] Reminder job failed:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
