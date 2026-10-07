/**
 * Health Check Endpoint
 * Monitor system health and dependencies
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    memory: {
      usage: number;
      limit: number;
      percentage: number;
    };
    environment: {
      nodeEnv: string;
      nextVersion: string;
    };
  };
}

export async function GET() {
  const startTime = Date.now();
  
  const healthCheck: HealthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: { status: 'down' },
      memory: {
        usage: 0,
        limit: 0,
        percentage: 0,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        nextVersion: process.env.npm_package_version || 'unknown',
      },
    },
  };

  // Check database connection
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - dbStart;
    
    healthCheck.checks.database = {
      status: 'up',
      responseTime: dbTime,
    };
  } catch (error: any) {
    healthCheck.status = 'unhealthy';
    healthCheck.checks.database = {
      status: 'down',
      error: error.message,
    };
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  const totalMemory = memUsage.heapTotal;
  const usedMemory = memUsage.heapUsed;
  const memoryPercentage = (usedMemory / totalMemory) * 100;

  healthCheck.checks.memory = {
    usage: Math.round(usedMemory / 1024 / 1024), // MB
    limit: Math.round(totalMemory / 1024 / 1024), // MB
    percentage: Math.round(memoryPercentage),
  };

  // Determine overall status
  if (healthCheck.checks.database.status === 'down') {
    healthCheck.status = 'unhealthy';
  } else if (memoryPercentage > 90) {
    healthCheck.status = 'degraded';
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      ...healthCheck,
      responseTime: `${responseTime}ms`,
    },
    {
      status: healthCheck.status === 'healthy' ? 200 : healthCheck.status === 'degraded' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
