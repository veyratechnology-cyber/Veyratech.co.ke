/**
 * API endpoint to generate and send proposal via email
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProposalHTML, generateProposalFromDB } from '@/lib/proposals/generator';
import { sendEmail, wrapEmailTemplate } from '@/lib/email/resend-client';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch proposal with lead details
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    if (!proposal.lead?.email) {
      return NextResponse.json(
        { error: 'Proposal has no associated client email' },
        { status: 400 }
      );
    }

    // Generate proposal HTML
    const proposalData = generateProposalFromDB(proposal);
    const proposalHTML = generateProposalHTML(proposalData);

    // Create email content
    const emailContent = `
      <h2>Your Proposal from VeyraTech</h2>
      <p>Dear ${proposal.lead.name},</p>
      <p>Thank you for considering VeyraTech for your technology consulting needs. We're excited to present our proposal for <strong>${proposal.title}</strong>.</p>
      <p>Please find the detailed proposal attached to this email. We've carefully tailored our solution to address your specific requirements and business objectives.</p>
      <div class="info-box">
        <p><strong>Proposal Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Project:</strong> ${proposal.title}</li>
          <li><strong>Company:</strong> ${proposal.clientCompany}</li>
          <li><strong>Investment:</strong> ${proposal.investment}</li>
          <li><strong>Timeline:</strong> ${proposal.timeline}</li>
        </ul>
      </div>
      <p>You can also <a href="${process.env.NEXTAUTH_URL}/admin/proposals/${proposal.id}/preview" class="button" style="display: inline-block; padding: 12px 24px; background-color: #FC8436; color: #FFFFFF; text-decoration: none; border-radius: 6px; margin: 10px 0;">View Online</a></p>
      <div class="divider"></div>
      <h3>Next Steps</h3>
      <p>We would love to discuss this proposal with you in detail. Please feel free to:</p>
      <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
        <li>Reply to this email with any questions</li>
        <li>Schedule a call to discuss the proposal</li>
        <li>Request any modifications or clarifications</li>
      </ul>
      <p>We look forward to the opportunity to work with ${proposal.clientCompany} and help drive your technology initiatives forward.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>The VeyraTech Team</strong></p>
    `;

    // Send email with proposal as attachment
    const emailResult = await sendEmail({
      to: proposal.lead.email,
      subject: `Proposal: ${proposal.title} - VeyraTech`,
      html: wrapEmailTemplate(emailContent, `Proposal: ${proposal.title}`),
      attachments: [
        {
          filename: `VeyraTech_Proposal_${proposal.clientCompany.replace(/\s+/g, '_')}.html`,
          content: proposalHTML,
        },
      ],
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: `Failed to send email: ${emailResult.error}` },
        { status: 500 }
      );
    }

    // Update proposal status to SENT
    await prisma.proposal.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Proposal sent successfully',
      emailId: emailResult.id,
    });
  } catch (error: any) {
    console.error('[SEND_PROPOSAL_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send proposal' },
      { status: 500 }
    );
  }
}
