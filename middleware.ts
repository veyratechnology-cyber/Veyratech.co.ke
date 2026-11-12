/**
 * Edge middleware
 * - Admin pages (/admin/*): redirect to login without a valid session token.
 * - Admin APIs: 401 without a valid session token.
 *
 * This is the first line of defence only. Every admin route handler also calls
 * requireAdmin() (lib/security), which re-validates the admin against the DB.
 * Security headers are set globally in next.config.js.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// API endpoints that must only be reachable by a logged-in admin.
const ADMIN_API_PATTERNS: RegExp[] = [
  /^\/api\/admin(\/|$)/,
  /^\/api\/notifications(\/|$)/,
  /^\/api\/consultations\/[^/]+\/(cancel|complete|reschedule)\/?$/,
];

// Exceptions inside the patterns above that must stay public.
const PUBLIC_API_EXCEPTIONS = ["/api/admin/check-rate-limit"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi =
    ADMIN_API_PATTERNS.some((re) => re.test(pathname)) &&
    !PUBLIC_API_EXCEPTIONS.includes(pathname);

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/:path*"],
};
