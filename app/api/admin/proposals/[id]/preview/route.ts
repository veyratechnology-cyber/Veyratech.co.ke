/**
 * API endpoint to preview proposal as HTML
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProposalHTML, generateProposalFromDB } from '@/lib/proposals/generator';
import { requireAdmin } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = params;

    // Fetch proposal with lead details
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        lead: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!proposal) {
      return new NextResponse('Proposal not found', { status: 404 });
    }

    // Generate proposal HTML
    const proposalData = generateProposalFromDB(proposal);
    const proposalHTML = generateProposalHTML(proposalData);

    // Return HTML response
    return new NextResponse(proposalHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data: https:; font-src https: data:",
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('[PREVIEW_PROPOSAL_ERROR]:', error);
    return new NextResponse('Failed to generate proposal preview', { status: 500 });
  }
}
