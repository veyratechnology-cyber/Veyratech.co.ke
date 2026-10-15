# VeyraTech Admin Security Documentation

## 🔒 Security Features Implemented

### 1. Authentication & Authorization
- ✅ NextAuth.js with secure JWT sessions
- ✅ Bcrypt password hashing
- ✅ HTTP-only secure cookies
- ✅ 30-day session expiration
- ✅ Automatic session refresh every 24 hours

### 2. Rate Limiting
- ✅ **5 failed attempts** per IP within 15 minutes
- ✅ **30-minute block** after exceeding limit
- ✅ Automatic cleanup of old attempt records
- ✅ IP-based tracking

### 3. Middleware Protection
- ✅ All `/admin` routes protected
- ✅ Automatic redirect to login if unauthorized
- ✅ Session validation on every request
- ✅ Public paths whitelisted

### 4. Security Headers
- ✅ **X-Frame-Options**: DENY (prevents clickjacking)
- ✅ **X-Content-Type-Options**: nosniff
- ✅ **X-XSS-Protection**: 1; mode=block
- ✅ **Referrer-Policy**: strict-origin-when-cross-origin
- ✅ **Content-Security-Policy**: Strict CSP rules
- ✅ **Permissions-Policy**: Disables unnecessary features

### 5. Password Security
- ✅ Minimum 12 characters required
- ✅ Must contain: uppercase, lowercase, numbers, special chars
- ✅ Common password detection
- ✅ Bcrypt hashing with salt

### 6. Audit Logging
- ✅ All login attempts logged
- ✅ Admin actions tracked
- ✅ Database changes recorded
- ✅ IP address and user agent captured

### 7. Database Security
- ✅ Prisma ORM prevents SQL injection
- ✅ Parameterized queries only
- ✅ Connection pooling (limited to 5)
- ✅ Automatic retry logic
- ✅ Transaction mode for better concurrency

---

## 🛡️ Security Best Practices

### For Administrators

1. **Strong Passwords**
   - Use at least 12 characters
   - Mix uppercase, lowercase, numbers, and symbols
   - Avoid common words or patterns
   - Use a password manager

2. **Session Management**
   - Always log out when done
   - Don't share session cookies
   - Clear browser cache on shared computers
   - Report suspicious activity immediately

3. **Access Control**
   - Only use admin panel from trusted devices
   - Avoid public WiFi for admin access
   - Enable VPN if accessing remotely
   - Keep your email account secure (2FA recommended)

4. **Regular Security Checks**
   - Review audit logs weekly
   - Check for unauthorized access attempts
   - Monitor rate limit blocks
   - Update passwords quarterly

### For Developers

1. **Environment Variables**
   ```bash
   # Required in .env
   NEXTAUTH_SECRET=<strong-random-string>  # 32+ characters
   NEXTAUTH_URL=https://veyratech.co.ke
   DATABASE_URL=<your-connection-string>
   ```

2. **Vercel Environment Variables**
   - Set all environment variables in Vercel Dashboard
   - Never commit `.env` to Git
   - Use different secrets for dev/staging/production

3. **Database**
   - Regular backups (Supabase handles this)
   - Monitor connection limits
   - Keep Prisma schema up to date
   - Review audit logs for anomalies

4. **Dependencies**
   - Keep packages updated
   - Run `npm audit` regularly
   - Review security advisories
   - Test updates in staging first

---

## 🚨 Rate Limiting Details

### Configuration
```typescript
MAX_LOGIN_ATTEMPTS = 5          // Attempts allowed
ATTEMPT_WINDOW_MS = 15 minutes  // Time window
BLOCK_DURATION_MS = 30 minutes  // Block duration
```

### How It Works
1. User enters incorrect password
2. System records IP and increment counter
3. After 5 failed attempts in 15 minutes:
   - IP is blocked for 30 minutes
   - All login attempts return error
   - Countdown shown to user
4. After 30 minutes, block expires automatically
5. Successful login clears all attempt records

### Bypassing Rate Limits (Admin Emergency)
If legitimate admin is locked out:
1. Wait 30 minutes (safest option)
2. Or clear the rate limit manually via Vercel logs
3. Or restart the application (clears in-memory store)

**Note:** For production, consider migrating to Redis for persistent rate limiting.

---

## 🔐 IP Whitelisting (Optional)

To restrict admin access to specific IPs:

1. Edit `lib/auth/security.ts`
2. Add your IPs to `WHITELISTED_IPS` array:
   ```typescript
   const WHITELISTED_IPS: string[] = [
     '102.140.XXX.XXX',        // Office IP
     '41.90.XXX.XXX',          // Home IP
     '192.168.1.0/24',         // Local subnet
   ];
   ```
3. If array is empty, all IPs are allowed
4. If populated, only listed IPs can access admin

---

## 📊 Monitoring & Alerts

### Check Failed Login Attempts
```sql
-- In Supabase SQL Editor
SELECT 
  action,
  resource_id,
  ip_address,
  created_at
FROM audit_logs
WHERE action = 'FAILED_LOGIN'
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;
```

### Check Successful Logins
```sql
SELECT 
  admin_id,
  action,
  ip_address,
  created_at
FROM audit_logs
WHERE action = 'ADMIN_LOGIN'
ORDER BY created_at DESC
LIMIT 20;
```

### Monitor Admin Activity
```sql
SELECT 
  a.email,
  al.action,
  al.resource,
  al.created_at
FROM audit_logs al
JOIN admins a ON al.admin_id = a.id
WHERE al.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY al.created_at DESC;
```

---

## 🎯 Security Checklist

### Initial Setup
- [x] NEXTAUTH_SECRET set (32+ random characters)
- [x] NEXTAUTH_URL configured correctly
- [x] DATABASE_URL uses connection pooling
- [x] Strong admin password set
- [x] Environment variables in Vercel
- [x] HTTPS enabled (Vercel handles this)

### Regular Maintenance
- [ ] Review audit logs weekly
- [ ] Check for failed login attempts
- [ ] Monitor rate limit blocks
- [ ] Update dependencies monthly
- [ ] Run security audit quarterly
- [ ] Backup database weekly (Supabase automatic)

### Security Incidents
If you detect unauthorized access:

1. **Immediate Actions**
   - Change all admin passwords
   - Review audit logs for affected time period
   - Check for unauthorized changes
   - Disable compromised accounts

2. **Investigation**
   - Identify entry point
   - Check IP addresses in audit logs
   - Review all actions taken by attacker
   - Document findings

3. **Remediation**
   - Patch security vulnerability
   - Restore any corrupted data
   - Notify affected parties if necessary
   - Update security procedures

4. **Prevention**
   - Implement additional security measures
   - Enable IP whitelisting if needed
   - Consider 2FA implementation
   - Update security training

---

## 🔄 Future Security Enhancements

### Planned
1. **Two-Factor Authentication (2FA)**
   - TOTP-based (Google Authenticator)
   - SMS backup option
   - Recovery codes

2. **IP Whitelisting UI**
   - Admin panel for managing allowed IPs
   - Temporary access grants
   - Automatic expiration

3. **Advanced Audit Logging**
   - Detailed change tracking
   - Before/after values
   - Rollback capability

4. **Redis Rate Limiting**
   - Persistent across restarts
   - Distributed rate limiting
   - More sophisticated rules

5. **Security Alerts**
   - Email notifications for suspicious activity
   - Slack/Discord webhooks
   - Real-time monitoring dashboard

### Considering
- Biometric authentication
- Hardware security keys (WebAuthn)
- Geo-blocking
- Honeypot admin pages
- CAPTCHA for repeated failures

---

## 📞 Security Contact

For security issues or questions:
- **Email:** admin@veyratech.co.ke
- **Priority:** Security issues take highest priority
- **Response Time:** Within 24 hours

**Report Security Vulnerabilities Privately**
Do not create public GitHub issues for security vulnerabilities.

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/platform/going-into-prod)

---

*Last Updated: December 2024*
*Security Version: 1.0*
