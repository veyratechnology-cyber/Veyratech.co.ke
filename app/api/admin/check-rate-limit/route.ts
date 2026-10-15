/**
 * Rate Limit Check API
 * Check if IP is rate limited before login attempt
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/auth/security';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request.headers);
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json({
        allowed: false,
        message: `Too many login attempts. Please try again later.`,
        blockUntil: rateLimit.blockUntil,
      }, { status: 429 });
    }

    return NextResponse.json({
      allowed: true,
      attemptsLeft: rateLimit.attemptsLeft,
    });
  } catch (error) {
    console.error('[RATE_LIMIT_CHECK_ERROR]:', error);
    return NextResponse.json({ error: 'Failed to check rate limit' }, { status: 500 });
  }
}
