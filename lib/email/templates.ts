/**
 * Email Templates
 * Beautiful, branded email templates for all scenarios
 */

import { wrapEmailTemplate } from './resend-client';

/**
 * New Consultation Notification (Admin)
 */
export function consultationNotificationEmail(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  consultationType: string[];
  businessChallenge?: string;
  preferredDate?: Date;
  consultationUrl: string;
}) {
  const content = `
    <h1>🎉 New Consultation Request!</h1>
    <p>A potential client has just booked a consultation. Here are the details:</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Client Information</h3>
      <p style="margin-bottom: 8px;"><strong>Name:</strong> ${data.name}</p>
      <p style="margin-bottom: 8px;"><strong>Email:</strong> ${data.email}</p>
      ${data.company ? `<p style="margin-bottom: 8px;"><strong>Company:</strong> ${data.company}</p>` : ''}
      ${data.phone ? `<p style="margin-bottom: 8px;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
    </div>

    <div class="divider"></div>

    <h3>Consultation Details</h3>
    <p><strong>Type:</strong> ${data.consultationType.join(', ')}</p>
    ${data.preferredDate ? `<p><strong>Preferred Date:</strong> ${new Date(data.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
    
    ${data.businessChallenge ? `
      <div class="divider"></div>
      <h3>Business Challenge</h3>
      <p>${data.businessChallenge}</p>
    ` : ''}

    <div class="divider"></div>

    <p><strong>Next Steps:</strong></p>
    <ul>
      <li>Review the consultation request</li>
      <li>Schedule a meeting time</li>
      <li>Send calendar invite to client</li>
    </ul>

    <a href="${data.consultationUrl}" class="button">View in Admin Panel →</a>

    <p style="margin-top: 30px; font-size: 14px; color: #CCCCCC;">
      This is an automated notification from your VeyraTech admin system.
    </p>
  `;

  return {
    subject: `New Consultation Request from ${data.name}${data.company ? ` (${data.company})` : ''}`,
    html: wrapEmailTemplate(content, 'New Consultation Request'),
  };
}

/**
 * Consultation Confirmation (Client)
 */
export function consultationConfirmationEmail(data: {
  name: string;
  consultationType: string[];
  preferredDate?: Date;
}) {
  const content = `
    <h1>Thank You for Your Interest! 🎉</h1>
    <p>Hi ${data.name},</p>
    
    <p>We've received your consultation request and are excited to help you achieve your technology goals.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">What Happens Next?</h3>
      <p style="margin-bottom: 8px;">✅ Our team will review your request</p>
      <p style="margin-bottom: 8px;">📞 We'll contact you within 24 hours</p>
      <p style="margin-bottom: 8px;">📅 We'll schedule your consultation</p>
      <p style="margin-bottom: 0;">🎯 We'll prepare a customized agenda</p>
    </div>

    <div class="divider"></div>

    <h3>Your Consultation Request</h3>
    <p><strong>Type:</strong> ${data.consultationType.join(', ')}</p>
    ${data.preferredDate ? `<p><strong>Preferred Date:</strong> ${new Date(data.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}

    <div class="divider"></div>

    <h3>In the Meantime</h3>
    <p>Explore our insights and case studies to see how we've helped businesses like yours:</p>
    
    <a href="https://veyratech.co.ke/insights" class="button">Read Our Insights →</a>

    <p style="margin-top: 30px;">
      <strong>Questions?</strong> Reply to this email or call us at <a href="tel:+254745247211" style="color: #FC8436;">+254 745 247 211</a>
    </p>

    <p style="margin-top: 20px;">
      Best regards,<br>
      <strong>The VeyraTech Team</strong>
    </p>
  `;

  return {
    subject: 'Consultation Request Received - VeyraTech',
    html: wrapEmailTemplate(content, 'Consultation Confirmed'),
  };
}

/**
 * Custom Business Email Template
 */
export function customBusinessEmail(data: {
  recipientName: string;
  subject: string;
  message: string;
  senderName?: string;
  includeCallToAction?: boolean;
  callToActionText?: string;
  callToActionUrl?: string;
}) {
  const content = `
    <p>Hi ${data.recipientName},</p>
    
    <div style="white-space: pre-wrap;">${data.message}</div>

    ${data.includeCallToAction && data.callToActionText && data.callToActionUrl ? `
      <div style="margin: 30px 0;">
        <a href="${data.callToActionUrl}" class="button">${data.callToActionText}</a>
      </div>
    ` : ''}

    <p style="margin-top: 30px;">
      Best regards,<br>
      <strong>${data.senderName || 'The VeyraTech Team'}</strong>
    </p>
  `;

  return {
    subject: data.subject,
    html: wrapEmailTemplate(content, data.subject),
  };
}

/**
 * Proposal Email Template
 */
export function proposalEmail(data: {
  clientName: string;
  clientCompany: string;
  proposalTitle: string;
  summary: string;
  proposalUrl: string;
  expirationDate?: Date;
}) {
  const content = `
    <h1>📄 Proposal for ${data.clientCompany}</h1>
    <p>Dear ${data.clientName},</p>
    
    <p>Thank you for the opportunity to work with ${data.clientCompany}. We're excited to present our proposal for your consideration.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">${data.proposalTitle}</h3>
      <p>${data.summary}</p>
    </div>

    <a href="${data.proposalUrl}" class="button">View Full Proposal →</a>

    ${data.expirationDate ? `
      <p style="margin-top: 20px; color: #FC8436; font-weight: 600;">
        ⏰ This proposal is valid until ${new Date(data.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    ` : ''}

    <div class="divider"></div>

    <h3>Next Steps</h3>
    <ol>
      <li>Review the detailed proposal</li>
      <li>Schedule a discussion call if needed</li>
      <li>Accept the proposal to begin</li>
    </ol>

    <p style="margin-top: 30px;">
      We're here to answer any questions you may have. Feel free to reply to this email or call us at <a href="tel:+254745247211" style="color: #FC8436;">+254 745 247 211</a>.
    </p>

    <p style="margin-top: 20px;">
      Looking forward to working together!<br>
      <strong>The VeyraTech Team</strong>
    </p>
  `;

  return {
    subject: `Proposal: ${data.proposalTitle} - VeyraTech`,
    html: wrapEmailTemplate(content, 'Proposal'),
  };
}

/**
 * Follow-up Email Template
 */
export function followUpEmail(data: {
  clientName: string;
  lastInteraction: string;
  message: string;
  callToActionText?: string;
  callToActionUrl?: string;
}) {
  const content = `
    <h1>Following Up</h1>
    <p>Hi ${data.clientName},</p>
    
    <p>I wanted to follow up on ${data.lastInteraction}.</p>
    
    <p>${data.message}</p>

    ${data.callToActionText && data.callToActionUrl ? `
      <a href="${data.callToActionUrl}" class="button">${data.callToActionText}</a>
    ` : ''}

    <p style="margin-top: 30px;">
      Please let me know if you have any questions or if there's anything else I can help with.
    </p>

    <p style="margin-top: 20px;">
      Best regards,<br>
      <strong>The VeyraTech Team</strong>
    </p>
  `;

  return {
    subject: `Following up: ${data.lastInteraction}`,
    html: wrapEmailTemplate(content, 'Follow Up'),
  };
}

/**
 * Meeting Scheduled Email
 */
export function meetingScheduledEmail(data: {
  clientName: string;
  meetingDate: Date;
  meetingTime: string;
  meetingType: string;
  meetingLink?: string;
  meetingLocation?: string;
  agenda?: string;
}) {
  const content = `
    <h1>✅ Meeting Confirmed!</h1>
    <p>Hi ${data.clientName},</p>
    
    <p>Your consultation meeting has been scheduled. We're looking forward to speaking with you!</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Meeting Details</h3>
      <p style="margin-bottom: 8px;"><strong>Date:</strong> ${new Date(data.meetingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p style="margin-bottom: 8px;"><strong>Time:</strong> ${data.meetingTime}</p>
      <p style="margin-bottom: 8px;"><strong>Type:</strong> ${data.meetingType}</p>
      ${data.meetingLocation ? `<p style="margin-bottom: 8px;"><strong>Location:</strong> ${data.meetingLocation}</p>` : ''}
    </div>

    ${data.meetingLink ? `
      <a href="${data.meetingLink}" class="button">Join Meeting →</a>
    ` : ''}

    ${data.agenda ? `
      <div class="divider"></div>
      <h3>Agenda</h3>
      <p>${data.agenda}</p>
    ` : ''}

    <div class="divider"></div>

    <h3>Before the Meeting</h3>
    <ul>
      <li>Add this to your calendar</li>
      <li>Prepare any questions you'd like to discuss</li>
      <li>Gather relevant information about your business needs</li>
    </ul>

    <p style="margin-top: 30px;">
      Need to reschedule? Reply to this email or call us at <a href="tel:+254745247211" style="color: #FC8436;">+254 745 247 211</a>
    </p>

    <p style="margin-top: 20px;">
      See you soon!<br>
      <strong>The VeyraTech Team</strong>
    </p>
  `;

  return {
    subject: `Meeting Confirmed: ${new Date(data.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - VeyraTech`,
    html: wrapEmailTemplate(content, 'Meeting Confirmed'),
  };
}
