/**
 * Enhanced Admin Security Features
 * - Rate limiting for login attempts
 * - IP-based access control
 * - Failed login tracking
 * - Session security
 */

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
  blockUntil?: number;
}

// In-memory store (for production, use Redis or database)
const loginAttempts = new Map<string, LoginAttempt>();
const blockedIPs = new Set<string>();

// Configuration
const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Check if IP is rate limited
 */
export function checkRateLimit(ip: string): { 
  allowed: boolean; 
  attemptsLeft?: number;
  blockUntil?: Date;
} {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  // Clean up old attempts
  if (attempt && now > attempt.firstAttempt + ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }

  // Check if currently blocked
  if (attempt?.blocked) {
    if (attempt.blockUntil && now < attempt.blockUntil) {
      return {
        allowed: false,
        blockUntil: new Date(attempt.blockUntil),
      };
    }
    // Unblock if time has passed
    loginAttempts.delete(ip);
    return { allowed: true, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }

  // Check attempt count
  if (attempt && attempt.count >= MAX_LOGIN_ATTEMPTS) {
    // Block the IP
    attempt.blocked = true;
    attempt.blockUntil = now + BLOCK_DURATION_MS;
    return {
      allowed: false,
      blockUntil: new Date(attempt.blockUntil),
    };
  }

  const attemptsLeft = MAX_LOGIN_ATTEMPTS - (attempt?.count || 0);
  return { allowed: true, attemptsLeft };
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false,
    });
  } else {
    attempt.count++;
    attempt.lastAttempt = now;

    // Block if exceeded attempts
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.blocked = true;
      attempt.blockUntil = now + BLOCK_DURATION_MS;
      blockedIPs.add(ip);
      console.warn(`[SECURITY] IP blocked due to failed attempts: ${ip}`);
    }
  }
}

/**
 * Clear login attempts after successful login
 */
export function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
  blockedIPs.delete(ip);
}

/**
 * Get client IP from request
 */
export function getClientIP(headers: Headers): string {
  // Try various headers in order
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

/**
 * Check if IP is whitelisted (optional - for extra security)
 * Add your office/home IPs here for IP whitelisting
 */
const WHITELISTED_IPS: string[] = [
  // Add your trusted IPs here
  // Example: '102.140.XXX.XXX',
];

export function isIPWhitelisted(ip: string): boolean {
  // If no whitelist configured, allow all
  if (WHITELISTED_IPS.length === 0) {
    return true;
  }

  // Check exact match
  if (WHITELISTED_IPS.includes(ip)) {
    return true;
  }

  // Check subnet match (e.g., 192.168.1.0/24)
  for (const whitelistedIP of WHITELISTED_IPS) {
    if (whitelistedIP.endsWith('/24')) {
      const subnet = whitelistedIP.slice(0, -3);
      if (ip.startsWith(subnet.slice(0, subnet.lastIndexOf('.')))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain special characters');
  }

  // Check for common passwords
  const commonPasswords = [
    'password', 'password123', 'admin123', '12345678', 'qwerty',
    'abc123', 'letmein', 'welcome', 'monkey', '1234567890'
  ];

  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate secure session token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(length);
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      token += chars[randomValues[i] % chars.length];
    }
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return token;
}

/**
 * Cleanup old entries (run periodically)
 */
export function cleanupOldAttempts(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const [ip, attempt] of loginAttempts.entries()) {
    if (now > attempt.firstAttempt + ATTEMPT_WINDOW_MS * 2) {
      expiredKeys.push(ip);
    }
  }

  expiredKeys.forEach(ip => {
    loginAttempts.delete(ip);
    blockedIPs.delete(ip);
  });

  if (expiredKeys.length > 0) {
    console.log(`[SECURITY] Cleaned up ${expiredKeys.length} expired login attempt records`);
  }
}

// Run cleanup every 30 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldAttempts, 30 * 60 * 1000);
}
