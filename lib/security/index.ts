/**
 * Shared security helpers.
 *
 * - requireAdmin(): API-route guard that verifies the session AND that the admin
 *   still exists and is ACTIVE in the database.
 * - rateLimit(): small fixed-window limiter keyed by any string (IP, email, ...).
 *   NOTE: state is per server instance. On Vercel each warm lambda keeps its own
 *   counters, so this slows abuse down but is not a hard global limit. For a hard
 *   limit, back it with Upstash Redis / Vercel KV.
 * - escapeHtml(): escape untrusted text before interpolating it into HTML
 *   (emails, generated invoices/proposals).
 * - safeUrl(): only allow http(s)/mailto links in generated HTML.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export { escapeHtml, safeUrl, escapeData } from "./html";

// -----------------------------------------------------------------------------
// Client IP
// -----------------------------------------------------------------------------

/**
 * Best-effort client IP. On Vercel `x-real-ip` / `x-forwarded-for` are set by
 * the platform edge and cannot be spoofed by the client.
 */
export function getClientIp(req: NextRequest | Request | { headers: Headers }): string {
  const h = req.headers;
  return (
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

// -----------------------------------------------------------------------------
// Rate limiting
// -----------------------------------------------------------------------------

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Fixed-window rate limit. Counts this call.
 * @param key     unique key, e.g. `contact:${ip}`
 * @param limit   max calls per window
 * @param windowMs window length in ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count++;
  const allowed = bucket.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/** Convenience: returns a 429 response if the limit is exceeded, otherwise null. */
export function enforceRateLimit(
  req: NextRequest | Request,
  scope: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const result = rateLimit(`${scope}:${getClientIp(req)}`, limit, windowMs);
  if (result.allowed) return null;
  return NextResponse.json(
    { success: false, error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } }
  );
}

// -----------------------------------------------------------------------------
// Admin guard for API routes
// -----------------------------------------------------------------------------

export interface AdminContext {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Use at the top of every admin-only route handler:
 *
 *   const auth = await requireAdmin();
 *   if (auth instanceof NextResponse) return auth;
 *
 * The session's JWT callback (lib/auth/config.ts) already re-validates the admin
 * against the database, so a valid session here means an ACTIVE admin.
 */
export async function requireAdmin(): Promise<AdminContext | NextResponse> {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; email?: string | null; name?: string | null } | undefined;

  if (!user?.id || !user.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  return { id: user.id, email: user.email, name: user.name };
}

// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------

/** Log the real error server-side and return a generic message to the client. */
export function serverError(tag: string, error: unknown, message = "Something went wrong. Please try again.") {
  console.error(`[${tag}]`, error instanceof Error ? error.message : error);
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
