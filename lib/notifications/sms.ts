/**
 * SMS Notifications via Twilio
 * Send SMS confirmations and reminders
 */

import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || '';

/**
 * Format phone number for Twilio (E.164 format)
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle Kenyan numbers
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return '+' + cleaned;
}

/**
 * Send SMS
 */
export async function sendSMS(params: {
  to: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!twilioClient) {
      console.warn('[SMS] Twilio not configured - SMS not sent');
      return { success: false, error: 'SMS service not configured' };
    }

    if (!TWILIO_PHONE) {
      console.warn('[SMS] Twilio phone number not configured');
      return { success: false, error: 'Twilio phone number not configured' };
    }

    const formattedPhone = formatPhoneNumber(params.to);

    const message = await twilioClient.messages.create({
      body: params.message,
      from: TWILIO_PHONE,
      to: formattedPhone,
    });

    console.log('[SMS] Sent successfully:', message.sid);
    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error: any) {
    console.error('[SMS] Error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send Consultation Confirmation SMS
 */
export async function sendConsultationConfirmationSMS(params: {
  name: string;
  phone: string;
  preferredDate?: Date;
  googleMeetLink?: string;
}): Promise<{ success: boolean }> {
  const dateStr = params.preferredDate
    ? new Date(params.preferredDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'soon';

  let message = `Hi ${params.name}! Your VeyraTech consultation has been confirmed for ${dateStr}.`;

  if (params.googleMeetLink) {
    message += `\n\nMeeting Link: ${params.googleMeetLink}`;
  }

  message += `\n\nWe'll contact you within 24 hours to finalize details.\n\nVeyraTech\n+254 745 247 211`;

  return sendSMS({
    to: params.phone,
    message,
  });
}

/**
 * Send Meeting Reminder SMS
 */
export async function sendMeetingReminderSMS(params: {
  name: string;
  phone: string;
  meetingDate: Date;
  googleMeetLink: string;
  hoursBeforeMeeting: number;
}): Promise<{ success: boolean }> {
  const timeStr = new Date(params.meetingDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const message = `REMINDER: Your VeyraTech consultation is in ${params.hoursBeforeMeeting} hour(s) at ${timeStr}.\n\nJoin here: ${params.googleMeetLink}\n\nSee you soon!\nVeyraTech`;

  return sendSMS({
    to: params.phone,
    message,
  });
}

/**
 * Check if Twilio is configured
 */
export function isTwilioConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}
