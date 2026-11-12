/**
 * Customer-journey glue (server only).
 *
 * Keeps the sales pipeline connected to what customers do on the site:
 *  - a booked consultation becomes (or updates) a Lead and is linked to it
 *  - completing a consultation moves the lead forward
 *  - clients are emailed when a consultation is cancelled or a payment lands
 *
 * Every function here is best-effort: failures are logged and never break the
 * booking / admin action that triggered them.
 */

import { prisma } from "@/lib/prisma";
import { sendEmail, wrapEmailTemplate } from "@/lib/email/resend-client";
import { escapeHtml } from "@/lib/security/html";

const SITE = (process.env.NEXT_PUBLIC_APP_URL || "https://veyratech.co.ke").replace(/\/$/, "");

// Lead statuses that a new booking is allowed to move forward to CONSULTATION.
const EARLY_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "NURTURE"];

/** Find-or-create a Lead for someone who booked, and link the consultation to it. */
export async function linkLeadToConsultation(input: {
  consultationId: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  businessChallenge?: string | null;
}): Promise<string | null> {
  try {
    const email = input.email.trim().toLowerCase();
    let lead = await prisma.lead.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name: input.name,
          email,
          phone: input.phone || null,
          company: input.company || null,
          businessChallenge: input.businessChallenge?.slice(0, 5000) || null,
          leadSource: "WEBSITE",
          status: "CONSULTATION",
          priority: "MEDIUM",
          notes: "Created automatically from a consultation booking",
        },
      });
    } else if (EARLY_STATUSES.includes(lead.status)) {
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: { status: "CONSULTATION", lastContactAt: new Date() },
      });
    }

    await prisma.consultation.update({ where: { id: input.consultationId }, data: { leadId: lead.id } });
    return lead.id;
  } catch (error) {
    console.error("[JOURNEY] linkLeadToConsultation failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** After a consultation is completed, move its lead to the matching pipeline stage. */
export async function advanceLeadAfterConsultation(leadId: string | null | undefined, outcome: string) {
  if (!leadId) return;
  const next: Record<string, string> = {
    PROPOSAL_REQUIRED: "PROPOSAL",
    SEND_QUOTATION: "PROPOSAL",
    IMPLEMENTATION_OPPORTUNITY: "NEGOTIATION",
    FOLLOW_UP_MEETING: "QUALIFIED",
    ASSESSMENT_REQUIRED: "QUALIFIED",
    CLIENT_NOT_READY: "NURTURE",
    NOT_QUALIFIED: "LOST",
  };
  const status = next[outcome];
  if (!status) return;
  try {
    await prisma.lead.update({ where: { id: leadId }, data: { status: status as any, lastContactAt: new Date() } });
  } catch (error) {
    console.error("[JOURNEY] advanceLeadAfterConsultation failed:", error instanceof Error ? error.message : error);
  }
}

/** Tell the client their consultation was cancelled and how to rebook. */
export async function sendCancellationEmail(c: { name: string; email: string; scheduledAt?: Date | null; reason?: string | null }) {
  try {
    const when = c.scheduledAt
      ? c.scheduledAt.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" }) + " (EAT)"
      : null;
    const html = `
      <h2>Your consultation has been cancelled</h2>
      <p>Hi ${escapeHtml(c.name)},</p>
      <p>Your VeyraTech consultation${when ? ` scheduled for <strong>${escapeHtml(when)}</strong>` : ""} has been cancelled.</p>
      ${c.reason ? `<div class="info-box"><p><strong>Reason:</strong> ${escapeHtml(c.reason)}</p></div>` : ""}
      <p>We'd still love to talk. You can pick a new time whenever it suits you:</p>
      <p><a href="${SITE}/book-consultation" class="button">Book a new time</a></p>
      <p>If this was a mistake, just reply to this email and we'll sort it out.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>The VeyraTech Team</strong></p>`;
    return await sendEmail({
      to: c.email,
      subject: "Your VeyraTech consultation has been cancelled",
      html: wrapEmailTemplate(html, "Consultation cancelled"),
    });
  } catch (error) {
    console.error("[JOURNEY] sendCancellationEmail failed:", error instanceof Error ? error.message : error);
    return { success: false as const };
  }
}

/** Receipt email after an M-Pesa payment is confirmed. */
export async function sendPaymentReceivedEmail(p: {
  name: string;
  email: string;
  amount: number;
  receipt: string;
  invoiceNumber: string;
  scheduledAt?: Date | null;
}) {
  try {
    const when = p.scheduledAt
      ? p.scheduledAt.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" }) + " (EAT)"
      : null;
    const html = `
      <h2>Payment received — thank you!</h2>
      <p>Hi ${escapeHtml(p.name)},</p>
      <p>We've received your M-Pesa payment and your consultation is confirmed.</p>
      <div class="info-box">
        <p><strong>Amount:</strong> KSH ${escapeHtml(Number(p.amount).toLocaleString("en-KE"))}</p>
        <p><strong>M-Pesa receipt:</strong> ${escapeHtml(p.receipt)}</p>
        <p><strong>Invoice:</strong> ${escapeHtml(p.invoiceNumber)}</p>
        ${when ? `<p><strong>Meeting:</strong> ${escapeHtml(when)}</p>` : ""}
      </div>
      <p>Keep this email as your receipt. We'll send a reminder before the meeting.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>The VeyraTech Team</strong></p>`;
    return await sendEmail({
      to: p.email,
      subject: `Payment received - ${p.invoiceNumber}`,
      html: wrapEmailTemplate(html, "Payment received"),
    });
  } catch (error) {
    console.error("[JOURNEY] sendPaymentReceivedEmail failed:", error instanceof Error ? error.message : error);
    return { success: false as const };
  }
}
