/**
 * WhatsApp Notifications via Twilio
 * Send WhatsApp confirmations and reminders
 */

import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP_NUMBER || '';

/**
 * Format phone number for WhatsApp (E.164 format with whatsapp: prefix)
 */
function formatWhatsAppNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle Kenyan numbers
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return 'whatsapp:+' + cleaned;
}

/**
 * Send WhatsApp Message
 */
export async function sendWhatsApp(params: {
  to: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!twilioClient) {
      console.warn('[WHATSAPP] Twilio not configured - WhatsApp not sent');
      return { success: false, error: 'WhatsApp service not configured' };
    }

    if (!TWILIO_WHATSAPP) {
      console.warn('[WHATSAPP] Twilio WhatsApp number not configured');
      return { success: false, error: 'WhatsApp number not configured' };
    }

    const formattedPhone = formatWhatsAppNumber(params.to);

    const message = await twilioClient.messages.create({
      body: params.message,
      from: TWILIO_WHATSAPP,
      to: formattedPhone,
    });

    console.log('[WHATSAPP] Sent successfully:', message.sid);
    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error: any) {
    console.error('[WHATSAPP] Error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send Consultation Confirmation WhatsApp
 */
export async function sendConsultationConfirmationWhatsApp(params: {
  name: string;
  phone: string;
  preferredDate?: Date;
  googleMeetLink?: string;
  consultationTypes?: string[];
}): Promise<{ success: boolean }> {
  const dateStr = params.preferredDate
    ? new Date(params.preferredDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'a convenient time';

  let message = `✅ *Consultation Confirmed*\n\n`;
  message += `Hi ${params.name}!\n\n`;
  message += `Your VeyraTech consultation has been confirmed for *${dateStr}*.\n\n`;

  if (params.consultationTypes && params.consultationTypes.length > 0) {
    message += `📋 *Topics:* ${params.consultationTypes.map(t => t.replace(/_/g, ' ')).join(', ')}\n\n`;
  }

  if (params.googleMeetLink) {
    message += `🔗 *Meeting Link:*\n${params.googleMeetLink}\n\n`;
  }

  message += `*What happens next:*\n`;
  message += `✓ Our team will review your request\n`;
  message += `✓ We'll contact you within 24 hours\n`;
  message += `✓ We'll finalize the meeting time\n\n`;

  message += `Questions? Reply to this message or call:\n`;
  message += `📞 +254 745 247 211\n\n`;
  message += `*VeyraTech* - Technology Consulting`;

  return sendWhatsApp({
    to: params.phone,
    message,
  });
}

/**
 * Send Meeting Reminder WhatsApp
 */
export async function sendMeetingReminderWhatsApp(params: {
  name: string;
  phone: string;
  meetingDate: Date;
  googleMeetLink: string;
  hoursBeforeMeeting: number;
}): Promise<{ success: boolean }> {
  const dateStr = new Date(params.meetingDate).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  let message = `⏰ *Meeting Reminder*\n\n`;
  message += `Hi ${params.name}!\n\n`;
  message += `Your VeyraTech consultation is in *${params.hoursBeforeMeeting} hour(s)* at ${dateStr}.\n\n`;
  message += `🔗 *Join the meeting:*\n${params.googleMeetLink}\n\n`;
  message += `*Preparation tips:*\n`;
  message += `✓ Test your audio/video\n`;
  message += `✓ Prepare your questions\n`;
  message += `✓ Have relevant documents ready\n\n`;
  message += `See you soon! 🎯\n\n`;
  message += `*VeyraTech* - Technology Consulting`;

  return sendWhatsApp({
    to: params.phone,
    message,
  });
}

/**
 * Send 10-Minute Meeting Reminder WhatsApp
 */
export async function sendMeetingStartingSoonWhatsApp(params: {
  name: string;
  phone: string;
  googleMeetLink: string;
}): Promise<{ success: boolean }> {
  let message = `🚀 *Meeting Starting Soon*\n\n`;
  message += `Hi ${params.name}!\n\n`;
  message += `Your VeyraTech consultation starts in *10 minutes*!\n\n`;
  message += `🔗 *Join now:*\n${params.googleMeetLink}\n\n`;
  message += `See you in a few minutes! 👋`;

  return sendWhatsApp({
    to: params.phone,
    message,
  });
}

/**
 * Check if WhatsApp is configured
 */
export function isWhatsAppConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
  );
}
