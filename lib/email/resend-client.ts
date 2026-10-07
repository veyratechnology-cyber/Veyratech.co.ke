/**
 * Resend Email Client
 * Professional email sending with beautiful templates
 */

import { Resend } from 'resend';

// Lazy-initialize Resend client
let resend: Resend | null = null;

function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'VeyraTech <noreply@veyratech.co.ke>',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@veyratech.co.ke',
  replyTo: process.env.ADMIN_EMAIL || 'admin@veyratech.co.ke',
};

/**
 * Send Email
 */
export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

export async function sendEmail(params: SendEmailParams) {
  try {
    const client = getResendClient();
    
    if (!client || !process.env.RESEND_API_KEY) {
      console.warn('[EMAIL] Resend API key not configured - email not sent');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await client.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo || EMAIL_CONFIG.replyTo,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
    });

    if (error) {
      console.error('[EMAIL] Send error:', error);
      return { success: false, error: error.message };
    }

    console.log('[EMAIL] Sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Email to Admin
 */
export async function sendAdminNotification(params: {
  subject: string;
  html: string;
  text?: string;
}) {
  return sendEmail({
    to: EMAIL_CONFIG.adminEmail,
    subject: `[VeyraTech Admin] ${params.subject}`,
    html: params.html,
    text: params.text,
  });
}

/**
 * Email Template Wrapper
 */
export function wrapEmailTemplate(content: string, title?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'VeyraTech'}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0D2340;
      color: #E5E5E5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid rgba(252, 132, 54, 0.3);
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #FFFFFF;
      margin-bottom: 10px;
    }
    .tagline {
      color: #FC8436;
      font-size: 14px;
    }
    .content {
      background-color: #081A30;
      border-radius: 12px;
      padding: 40px 30px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #FC8436;
      color: #FFFFFF !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #E5702A;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #CCCCCC;
      font-size: 12px;
    }
    h1, h2, h3 {
      color: #FFFFFF;
      margin-top: 0;
    }
    p {
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .info-box {
      background-color: rgba(252, 132, 54, 0.1);
      border-left: 4px solid #FC8436;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">VeyraTech</div>
      <div class="tagline">Technology Consulting & Strategy</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        <strong>VeyraTech</strong><br>
        Technology Consulting & Strategy<br>
        Nairobi, Kenya<br>
        +254 745 247 211 | admin@veyratech.co.ke
      </p>
      <p style="margin-top: 20px;">
        <a href="https://veyratech.co.ke" style="color: #FC8436; text-decoration: none;">Visit Our Website</a> | 
        <a href="https://veyratech.co.ke/book-consultation" style="color: #FC8436; text-decoration: none;">Book Consultation</a>
      </p>
      <p style="margin-top: 20px; color: #999;">
        © ${new Date().getFullYear()} VeyraTech. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export { EMAIL_CONFIG };
