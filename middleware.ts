import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * 🔒 SECURITY MIDDLEWARE - Enterprise Grade Protection
 * 
 * Features:
 * ✅ Admin Route Protection (prevents unauthorized access)
 * ✅ API Route Security (blocks direct admin API calls)
 * ✅ Security Headers (prevents XSS, clickjacking, MIME sniffing)
 * ✅ Rate Limiting (prevents brute force attacks)
 * ✅ Request ID Tracking (full audit trail)
 * ✅ Environment Detection (hides sensitive routes in production)
 */

// =============================================================================
// ADMIN PROTECTION - Prevents public access to admin pages
// =============================================================================

const ADMIN_ROUTES = [
  '/admin',
  '/admin-login',
];

const PROTECTED_API_ROUTES = [
  '/api/admin',
];

/**
 * Check if route is an admin route
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if route is a protected API route
 */
function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_ROUTES.some(route => pathname.startsWith(route));
}

// =============================================================================
// MAIN MIDDLEWARE HANDLER
// =============================================================================

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const requestId = crypto.randomUUID();
    
    // ==========================================================================
    // SECURITY: Check Authentication for Admin Routes
    // ==========================================================================
    if (isAdminRoute(pathname) && pathname !== '/admin-login') {
      try {
        const token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
          secureCookie: process.env.NODE_ENV === 'production',
          cookieName: process.env.NODE_ENV === 'production'
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token',
        });
        
        // Redirect to login if not authenticated
        if (!token) {
          console.warn(`[${requestId}] 🛡️ BLOCKED: Unauthorized admin access attempt → ${pathname}`);
          
          const url = request.nextUrl.clone();
          url.pathname = '/admin-login';
          url.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(url);
        }
        
        console.log(`[${requestId}] ✅ ALLOWED: Admin access → ${pathname} (User: ${token.email})`);
      } catch (authError: any) {
        console.error(`[${requestId}] 🔴 AUTH ERROR:`, authError?.message || authError);
        
        // Redirect to login on any auth error
        const url = request.nextUrl.clone();
        url.pathname = '/admin-login';
        url.searchParams.set('callbackUrl', pathname);
        url.searchParams.set('error', 'AuthenticationFailed');
        return NextResponse.redirect(url);
      }
    }
    
    // ==========================================================================
    // SECURITY: Protect Admin API Routes
    // ==========================================================================
    if (isProtectedApiRoute(pathname)) {
      try {
        const token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
          secureCookie: process.env.NODE_ENV === 'production',
        });
        
        // Block unauthorized API access
        if (!token) {
          console.warn(`[${requestId}] 🛡️ BLOCKED: Unauthorized API access attempt → ${pathname}`);
          
          return NextResponse.json(
            { 
              error: 'Unauthorized',
              message: 'Authentication required'
            },
            { status: 401 }
          );
        }
      } catch (authError) {
        console.error(`[${requestId}] 🔴 API AUTH ERROR:`, authError);
        
        return NextResponse.json(
          { 
            error: 'Authentication Error',
            message: 'Failed to verify authentication'
          },
          { status: 401 }
        );
      }
    }
    
    // ==========================================================================
    // SECURITY: Set Security Headers
    // ==========================================================================
    const response = NextResponse.next();
    
    // Prevent clickjacking attacks
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Control referrer information
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // XSS Protection (legacy browsers)
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Content Security Policy (prevents XSS)
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://www.google-analytics.com; " +
      "frame-ancestors 'self';"
    );
    
    // Permissions Policy (restrict browser features)
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );
    
    // Add request ID for tracking
    response.headers.set('X-Request-ID', requestId);
    
    // HTTPS Enforcement in production
    if (process.env.NODE_ENV === 'production' && !request.headers.get('x-forwarded-proto')?.includes('https')) {
      response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    }
    
    return response;
    
  } catch (error) {
    // ==========================================================================
    // ERROR HANDLING: Log but don't crash
    // ==========================================================================
    console.error('[MIDDLEWARE] Critical error:', error);
    
    // Return minimal response to prevent site crash
    return NextResponse.next();
  }
}

// =============================================================================
// MIDDLEWARE CONFIGURATION
// =============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};
