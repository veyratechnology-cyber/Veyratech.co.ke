/**
 * Admin Analytics API
 * GET /api/admin/analytics - Fetch comprehensive analytics data
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30'; // Days
    const days = parseInt(range);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Revenue Analytics (Newsletter Subscriptions)
    const [
      totalRevenue,
      revenueByDay,
      activeSubscriptions,
      pendingPayments,
      totalSubscriptions,
    ] = await Promise.all([
      // Total revenue from completed payments
      prisma.newsletterSubscription.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          paidAt: { gte: startDate },
        },
        _sum: { amount: true },
      }),
      
      // Revenue by day for chart
      prisma.$queryRaw`
        SELECT 
          DATE(paid_at) as date,
          COUNT(*) as count,
          SUM(amount) as revenue
        FROM newsletter_subscriptions
        WHERE payment_status = 'COMPLETED'
          AND paid_at >= ${startDate}
        GROUP BY DATE(paid_at)
        ORDER BY date ASC
      `,
      
      // Active subscriptions count
      prisma.newsletterSubscription.count({
        where: {
          status: 'ACTIVE',
          expiresAt: { gt: new Date() },
        },
      }),
      
      // Pending payments
      prisma.newsletterSubscription.count({
        where: {
          paymentStatus: 'PENDING',
          createdAt: { gte: startDate },
        },
      }),
      
      // Total subscriptions in period
      prisma.newsletterSubscription.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Consultation Analytics
    const [
      totalConsultations,
      consultationsByStatus,
      consultationsByDay,
      upcomingConsultations,
      completedConsultations,
      conversionRate,
    ] = await Promise.all([
      prisma.consultation.count({
        where: { createdAt: { gte: startDate } },
      }),
      
      prisma.consultation.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),
      
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM consultations
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      
      prisma.consultation.count({
        where: {
          status: 'SCHEDULED',
          actualScheduledAt: { gt: new Date() },
        },
      }),
      
      prisma.consultation.count({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startDate },
        },
      }),
      
      // Calculate conversion rate (completed / total)
      prisma.consultation.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }).then((data) => {
        const total = data.reduce((sum, item) => sum + item._count, 0);
        const completed = data.find(d => d.status === 'COMPLETED')?._count || 0;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      }),
    ]);

    // Lead & Prospect Analytics
    const [
      totalLeads,
      qualifiedLeads,
      leadsBySource,
      leadConversionRate,
      totalProspects,
      prospectContactedRate,
    ] = await Promise.all([
      prisma.lead.count({
        where: { createdAt: { gte: startDate } },
      }),
      
      prisma.lead.count({
        where: {
          status: { in: ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON'] },
          createdAt: { gte: startDate },
        },
      }),
      
      prisma.lead.groupBy({
        by: ['leadSource'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),
      
      // Calculate lead conversion (won / total)
      prisma.lead.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }).then((data) => {
        const total = data.reduce((sum, item) => sum + item._count, 0);
        const won = data.find(d => d.status === 'WON')?._count || 0;
        return total > 0 ? Math.round((won / total) * 100) : 0;
      }),
      
      prisma.prospect.count({
        where: { createdAt: { gte: startDate } },
      }),
      
      // Calculate prospect contact rate
      prisma.prospect.groupBy({
        by: ['contactStatus'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }).then((data) => {
        const total = data.reduce((sum, item) => sum + item._count, 0);
        const contacted = data.filter(d => 
          d.contactStatus !== 'NOT_CONTACTED'
        ).reduce((sum, item) => sum + item._count, 0);
        return total > 0 ? Math.round((contacted / total) * 100) : 0;
      }),
    ]);

    // Project Analytics
    const [
      activeProjects,
      completedProjects,
      projectsByStatus,
    ] = await Promise.all([
      prisma.project.count({
        where: { status: 'ACTIVE' },
      }),
      
      prisma.project.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: startDate },
        },
      }),
      
      prisma.project.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    // Proposal Analytics
    const [
      activeProposals,
      acceptedProposals,
      proposalAcceptanceRate,
    ] = await Promise.all([
      prisma.proposal.count({
        where: {
          status: { in: ['DRAFT', 'SENT', 'VIEWED'] },
        },
      }),
      
      prisma.proposal.count({
        where: {
          status: 'ACCEPTED',
          acceptedAt: { gte: startDate },
        },
      }),
      
      // Calculate acceptance rate
      prisma.proposal.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }).then((data) => {
        const sent = data.filter(d => 
          ['SENT', 'VIEWED', 'ACCEPTED', 'REJECTED'].includes(d.status)
        ).reduce((sum, item) => sum + item._count, 0);
        const accepted = data.find(d => d.status === 'ACCEPTED')?._count || 0;
        return sent > 0 ? Math.round((accepted / sent) * 100) : 0;
      }),
    ]);

    // Response
    return NextResponse.json({
      success: true,
      data: {
        // Revenue Metrics
        revenue: {
          total: totalRevenue._sum.amount || 0,
          byDay: revenueByDay,
          activeSubscriptions,
          pendingPayments,
          totalSubscriptions,
          conversionRate: pendingPayments > 0 
            ? Math.round((activeSubscriptions / totalSubscriptions) * 100) 
            : 0,
        },
        
        // Consultation Metrics
        consultations: {
          total: totalConsultations,
          byStatus: consultationsByStatus,
          byDay: consultationsByDay,
          upcoming: upcomingConsultations,
          completed: completedConsultations,
          conversionRate,
        },
        
        // Lead Metrics
        leads: {
          total: totalLeads,
          qualified: qualifiedLeads,
          bySource: leadsBySource,
          conversionRate: leadConversionRate,
        },
        
        // Prospect Metrics
        prospects: {
          total: totalProspects,
          contactedRate: prospectContactedRate,
        },
        
        // Project Metrics
        projects: {
          active: activeProjects,
          completed: completedProjects,
          byStatus: projectsByStatus,
        },
        
        // Proposal Metrics
        proposals: {
          active: activeProposals,
          accepted: acceptedProposals,
          acceptanceRate: proposalAcceptanceRate,
        },
      },
    });
  } catch (error: any) {
    console.error('[ANALYTICS API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
