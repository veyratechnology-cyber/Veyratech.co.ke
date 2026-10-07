/**
 * Proposal Generation API
 * POST /api/admin/proposals/generate - Generate branded proposal with VeyraTech logo
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';
import { generateProposalHTML, generateProposalFromDB } from '@/lib/proposals/generator';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { proposalId } = body;

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Proposal ID is required' },
        { status: 400 }
      );
    }

    // Fetch proposal with lead information
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        lead: {
          select: {
            name: true,
            email: true,
            company: true,
            phone: true,
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

    // Generate proposal data
    const proposalData = generateProposalFromDB(proposal);
    
    // Generate HTML
    const html = generateProposalHTML(proposalData);

    // Optionally: Save PDF or send email here
    // For now, just return the HTML

    return NextResponse.json({
      success: true,
      proposalNumber: proposalData.proposalNumber,
      html,
    });
  } catch (error: any) {
    console.error('[PROPOSAL GENERATE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
