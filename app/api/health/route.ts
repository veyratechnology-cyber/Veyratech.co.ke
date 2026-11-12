/**
 * Health Check Endpoint
 * Public, so it only reports up/down. Error details are logged server-side.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let database: 'up' | 'down' = 'down';

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'up';
  } catch (error) {
    console.error('[HEALTH] Database check failed:', error instanceof Error ? error.message : error);
  }

  const status = database === 'up' ? 'healthy' : 'unhealthy';

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks: { database },
      responseTime: `${Date.now() - startTime}ms`,
    },
    {
      status: status === 'healthy' ? 200 : 503,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    }
  );
}
