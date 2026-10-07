/**
 * Multi-Channel Notification Orchestrator
 * Sends notifications via Email, SMS, and WhatsApp
 */

import { sendEmail } from '../email/resend-client';
import { meetingScheduledEmail } from '../email/templates';
import { sendConsultationConfirmationSMS, sendMeetingReminderSMS, isTwilioConfigured } from './sms';
import {
  sendConsultationConfirmationWhatsApp,
  sendMeetingReminderWhatsApp,
  sendMeetingStartingSoonWhatsApp,
  isWhatsAppConfigured,
} from './whatsapp';

/**
 * Send Consultation Confirmations (All Channels)
 */
export async function sendConsultationNotifications(params: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  businessChallenge?: string;
  consultationId: string;
  scheduledAt?: Date;
  wasRescheduled?: boolean;
  googleMeetLink?: string;
  meetingType?: string;
  consultationType?: string[];
}) {
  console.log('[NOTIFICATIONS] Sending multi-channel notifications...');

  const results = {
    email: { sent: false, error: null as string | null },
    sms: { sent: false, error: null as string | null },
    whatsapp: { sent: false, error: null as string | null },
  };

  // 1. Send Email (Always)
  try {
    if (params.scheduledAt && params.googleMeetLink) {
      const emailTemplate = meetingScheduledEmail({
        clientName: params.name,
        meetingDate: params.scheduledAt,
        meetingTime: new Date(params.scheduledAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        }),
        meetingType: params.meetingType || 'Google Meet',
        meetingLink: params.googleMeetLink,
        agenda: params.businessChallenge,
      });

      const emailResult = await sendEmail({
        to: params.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      if (emailResult.success) {
        results.email.sent = true;
        console.log('[NOTIFICATIONS] ✅ Email sent');
      } else {
        results.email.error = emailResult.error || 'Unknown error';
        console.error('[NOTIFICATIONS] ❌ Email failed:', emailResult.error);
      }
    }
  } catch (error: any) {
    results.email.error = error.message;
    console.error('[NOTIFICATIONS] Email error:', error.message);
  }

  // 2. Send SMS (If phone provided and Twilio configured)
  if (params.phone && isTwilioConfigured()) {
    try {
      const smsResult = await sendConsultationConfirmationSMS({
        name: params.name,
        phone: params.phone,
        preferredDate: params.scheduledAt,
        googleMeetLink: params.googleMeetLink,
      });

      if (smsResult.success) {
        results.sms.sent = true;
        console.log('[NOTIFICATIONS] ✅ SMS sent');
      } else {
        results.sms.error = 'SMS service not available';
        console.warn('[NOTIFICATIONS] ⚠️ SMS not sent');
      }
    } catch (error: any) {
      results.sms.error = error.message;
      console.error('[NOTIFICATIONS] SMS error:', error.message);
    }
  }

  // 3. Send WhatsApp (If phone provided and WhatsApp configured)
  if (params.phone && isWhatsAppConfigured()) {
    try {
      const whatsappResult = await sendConsultationConfirmationWhatsApp({
        name: params.name,
        phone: params.phone,
        preferredDate: params.scheduledAt,
        googleMeetLink: params.googleMeetLink,
        consultationTypes: params.consultationType,
      });

      if (whatsappResult.success) {
        results.whatsapp.sent = true;
        console.log('[NOTIFICATIONS] ✅ WhatsApp sent');
      } else {
        results.whatsapp.error = 'WhatsApp service not available';
        console.warn('[NOTIFICATIONS] ⚠️ WhatsApp not sent');
      }
    } catch (error: any) {
      results.whatsapp.error = error.message;
      console.error('[NOTIFICATIONS] WhatsApp error:', error.message);
    }
  }

  console.log('[NOTIFICATIONS] Summary:', results);
  return results;
}

/**
 * Send Meeting Reminders (All Channels)
 */
export async function sendMeetingReminders(params: {
  consultationId: string;
  name: string;
  email: string;
  phone?: string;
  meetingDate: Date;
  googleMeetLink: string;
  hoursBeforeMeeting: number;
}) {
  console.log(`[REMINDERS] Sending ${params.hoursBeforeMeeting}h reminders...`);

  const results = {
    email: { sent: false, error: null as string | null },
    sms: { sent: false, error: null as string | null },
    whatsapp: { sent: false, error: null as string | null },
  };

  // 1. Send Email Reminder
  try {
    const timeStr = new Date(params.meetingDate).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const emailResult = await sendEmail({
      to: params.email,
      subject: `Reminder: Your meeting in ${params.hoursBeforeMeeting} hour(s) - VeyraTech`,
      html: `
        <h2>Meeting Reminder</h2>
        <p>Hi ${params.name},</p>
        <p>Your VeyraTech consultation is in <strong>${params.hoursBeforeMeeting} hour(s)</strong> at ${timeStr}.</p>
        <p><a href="${params.googleMeetLink}" style="background: #FC8436; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Join Meeting</a></p>
        <p>See you soon!<br><strong>The VeyraTech Team</strong></p>
      `,
    });

    if (emailResult.success) {
      results.email.sent = true;
    }
  } catch (error: any) {
    results.email.error = error.message;
  }

  // 2. Send SMS Reminder
  if (params.phone && isTwilioConfigured()) {
    try {
      const smsResult = await sendMeetingReminderSMS({
        name: params.name,
        phone: params.phone,
        meetingDate: params.meetingDate,
        googleMeetLink: params.googleMeetLink,
        hoursBeforeMeeting: params.hoursBeforeMeeting,
      });

      if (smsResult.success) {
        results.sms.sent = true;
      }
    } catch (error: any) {
      results.sms.error = error.message;
    }
  }

  // 3. Send WhatsApp Reminder
  if (params.phone && isWhatsAppConfigured()) {
    try {
      // Send different message for 10-minute reminder
      const whatsappResult = params.hoursBeforeMeeting < 1
        ? await sendMeetingStartingSoonWhatsApp({
            name: params.name,
            phone: params.phone,
            googleMeetLink: params.googleMeetLink,
          })
        : await sendMeetingReminderWhatsApp({
            name: params.name,
            phone: params.phone,
            meetingDate: params.meetingDate,
            googleMeetLink: params.googleMeetLink,
            hoursBeforeMeeting: params.hoursBeforeMeeting,
          });

      if (whatsappResult.success) {
        results.whatsapp.sent = true;
      }
    } catch (error: any) {
      results.whatsapp.error = error.message;
    }
  }

  console.log('[REMINDERS] Summary:', results);
  return results;
}

/**
 * Check notification services status
 */
export function getNotificationServicesStatus() {
  return {
    email: !!process.env.RESEND_API_KEY,
    sms: isTwilioConfigured(),
    whatsapp: isWhatsAppConfigured(),
  };
}
