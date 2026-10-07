import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email/resend-client';
import { customBusinessEmail, proposalEmail, followUpEmail } from '@/lib/email/templates';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Send Email from Admin Panel
 * POST /api/admin/emails/send
 */

const sendEmailSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  type: z.enum(['custom', 'proposal', 'followup']),
  
  // Custom email fields
  recipientName: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  includeCallToAction: z.boolean().optional(),
  callToActionText: z.string().optional(),
  callToActionUrl: z.string().url().optional(),
  
  // Proposal email fields
  clientCompany: z.string().optional(),
  proposalTitle: z.string().optional(),
  proposalSummary: z.string().optional(),
  proposalUrl: z.string().url().optional(),
  expirationDate: z.string().optional(),
  
  // Follow-up email fields
  lastInteraction: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validation = sendEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate email based on type
    let emailData: { subject: string; html: string };

    switch (data.type) {
      case 'custom':
        if (!data.recipientName || !data.subject || !data.message) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields for custom email' },
            { status: 400 }
          );
        }
        emailData = customBusinessEmail({
          recipientName: data.recipientName,
          subject: data.subject,
          message: data.message,
          senderName: session.user.name || undefined,
          includeCallToAction: data.includeCallToAction,
          callToActionText: data.callToActionText,
          callToActionUrl: data.callToActionUrl,
        });
        break;

      case 'proposal':
        if (!data.recipientName || !data.clientCompany || !data.proposalTitle || !data.proposalSummary || !data.proposalUrl) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields for proposal email' },
            { status: 400 }
          );
        }
        emailData = proposalEmail({
          clientName: data.recipientName,
          clientCompany: data.clientCompany,
          proposalTitle: data.proposalTitle,
          summary: data.proposalSummary,
          proposalUrl: data.proposalUrl,
          expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
        });
        break;

      case 'followup':
        if (!data.recipientName || !data.lastInteraction || !data.message) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields for follow-up email' },
            { status: 400 }
          );
        }
        emailData = followUpEmail({
          clientName: data.recipientName,
          lastInteraction: data.lastInteraction,
          message: data.message,
          callToActionText: data.callToActionText,
          callToActionUrl: data.callToActionUrl,
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type' },
          { status: 400 }
        );
    }

    // Send email
    const result = await sendEmail({
      to: data.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          message: result.error,
        },
        { status: 500 }
      );
    }

    console.log('[ADMIN EMAIL] Sent successfully:', result.id);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.id,
    });
  } catch (error: any) {
    console.error('[ADMIN EMAIL] Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
        message: 'An error occurred while sending the email',
      },
      { status: 500 }
    );
  }
}
