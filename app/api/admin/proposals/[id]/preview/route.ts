/**
 * API endpoint to preview proposal as HTML
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProposalHTML, generateProposalFromDB } from '@/lib/proposals/generator';

export const dynamic = 'force-dynamic';

export async function GET(
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
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('[PREVIEW_PROPOSAL_ERROR]:', error);
    return new NextResponse('Failed to generate proposal preview', { status: 500 });
  }
}
