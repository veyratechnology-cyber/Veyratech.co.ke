# 🌐 Domain Update: veyratech.co.ke Setup Guide

## Overview
You've purchased **veyratech.co.ke**! This guide will help you connect it to your Vercel deployment.

---

## 🚀 Step-by-Step Setup

### Step 1: Add Domain in Vercel

1. Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech/settings/domains

2. Click **"Add Domain"**

3. Enter: `veyratech.co.ke`

4. Click **"Add"**

5. Vercel will show DNS records you need to configure

---

### Step 2: Configure DNS Records

Go to your **domain registrar** (where you bought veyratech.co.ke) and add these DNS records:

#### Option A: Using A Records (Recommended)
```
Type: A
Name: @ (or leave blank for root domain)
Value: 76.76.21.21
TTL: 3600 (or Auto)

Type: A
Name: www
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### Option B: Using CNAME (Alternative)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)

Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**⚠️ Note**: DNS changes can take 24-48 hours to propagate globally.

---

### Step 3: Update Environment Variables

Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech/settings/environment-variables

Update these variables:

#### NEXTAUTH_URL
```
Old: https://vera-tech.vercel.app
New: https://veyratech.co.ke
```

#### NEXT_PUBLIC_APP_URL
```
Old: https://vera-tech.vercel.app
New: https://veyratech.co.ke
```

#### NEXT_PUBLIC_ADMIN_URL
```
Old: https://vera-tech.vercel.app/admin
New: https://veyratech.co.ke/admin
```

#### GOOGLE_REDIRECT_URI (if using Google Calendar)
```
Old: https://vera-tech.vercel.app/api/auth/google/callback
New: https://veyratech.co.ke/api/auth/google/callback
```

---

### Step 4: Redeploy

1. Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech

2. Click **"Deployments"** tab

3. Click **3 dots (•••)** next to latest deployment

4. Click **"Redeploy"**

5. ✅ **UNCHECK** "Use existing build cache"

6. Click **"Redeploy"**

---

### Step 5: Verify SSL Certificate

Vercel automatically generates SSL certificates. After DNS propagates:

1. Visit: https://veyratech.co.ke

2. Click the **padlock icon** in browser address bar

3. ✅ Should show: "Connection is secure"

---

## 🔍 Testing Your New Domain

### Test 1: Homepage
```
URL: https://veyratech.co.ke
Expected: ✅ Homepage loads
```

### Test 2: Admin Login
```
URL: https://veyratech.co.ke/admin-login
Expected: ✅ Login page loads
Login: admin@veyratech.com / ***REMOVED***
```

### Test 3: Booking Form
```
URL: https://veyratech.co.ke/book-consultation
Expected: ✅ Booking form loads and works
```

### Test 4: Services
```
URL: https://veyratech.co.ke/services/software-systems
Expected: ✅ Service page loads (no 404)
```

### Test 5: Sitemap
```
URL: https://veyratech.co.ke/sitemap.xml
Expected: ✅ XML format (not HTML)
```

---

## 📧 Update Search Console

### Google Search Console

1. Go to: https://search.google.com/search-console

2. Click **"Add Property"**

3. Choose **"Domain"** property type

4. Enter: `veyratech.co.ke`

5. Verify ownership (Vercel DNS TXT record method)

6. Submit sitemap: `https://veyratech.co.ke/sitemap.xml`

### Bing Webmaster Tools

1. Go to: https://www.bing.com/webmasters

2. Click **"Add Site"**

3. Enter: `https://veyratech.co.ke`

4. Verification: Bing will detect meta tag automatically ✅

5. Submit sitemap: `https://veyratech.co.ke/sitemap.xml`

---

## 🔄 Redirect Setup (Optional but Recommended)

### Redirect www to non-www (or vice versa)

In Vercel, both `veyratech.co.ke` and `www.veyratech.co.ke` will work automatically.

**Recommendation**: Choose one as primary:
- ✅ **Option 1**: `veyratech.co.ke` (cleaner, shorter)
- Option 2: `www.veyratech.co.ke` (traditional)

Vercel handles redirects automatically if you add both domains.

---

## 📝 Update Code References

Files that reference the old domain (optional updates):

### Update Now:
1. `app/layout.tsx` - Line 21 (metadataBase)
2. `app/sitemap.ts` - Line 9 (baseUrl)
3. `app/robots.ts` - Line 16 (sitemap URL)
4. `.env` - NEXTAUTH_URL, NEXT_PUBLIC_APP_URL

### Update Later (documentation):
- All `.md` files with `vera-tech.vercel.app` references
- Can keep as historical reference

---

## ⚠️ About DATABASE_URL Port

### Your Question: Why change from port 6543 to 5432?

**Answer**: It's about **compatibility**, not security!

#### Port 6543 (PgBouncer Pooler):
- ❌ Connection pooler that causes issues with Prisma
- ❌ "prepared statement already exists" errors
- ❌ Prisma migrations/seeders fail
- ✅ Good for: High-traffic runtime queries only

#### Port 5432 (Direct Connection):
- ✅ Direct PostgreSQL connection
- ✅ Works perfectly with Prisma
- ✅ No "prepared statement" errors
- ✅ Seeders and migrations work

**Security Note**: Both ports are equally secure! Your DATABASE_URL credentials and Supabase firewall rules protect your database, not the port number.

### When to Use Each Port:

**Use Port 5432 (Direct) When:**
- Running Prisma migrations: `npx prisma migrate`
- Running seeders: `/api/admin/seed-database`
- Using admin operations
- Development work

**Use Port 6543 (Pooler) When:**
- High-traffic production queries
- Serverless functions (many concurrent connections)
- Runtime-only queries (no Prisma migrations)

### Recommendation for You:
✅ **Keep port 5432** - You're using admin seeders and Prisma migrations, so direct connection is better.

---

## 🎯 Timeline

| Step | Time | Status |
|------|------|--------|
| Add domain in Vercel | 2 minutes | ⏳ Pending |
| Configure DNS records | 5 minutes | ⏳ Pending |
| DNS propagation | 1-24 hours | ⏳ Waiting |
| Update env variables | 3 minutes | ⏳ Pending |
| Redeploy | 2 minutes | ⏳ Pending |
| SSL certificate | Automatic | ⏳ Vercel handles |
| Update Search Console | 10 minutes | ⏳ After DNS |

**Total Time**: ~1-24 hours (mostly waiting for DNS)

---

## ✅ Verification Checklist

After DNS propagates (24-48 hours):

- [ ] https://veyratech.co.ke loads
- [ ] https://www.veyratech.co.ke redirects properly
- [ ] SSL certificate active (padlock icon)
- [ ] Admin login works at new domain
- [ ] Booking form works
- [ ] Service pages load (no 404)
- [ ] Sitemap.xml accessible
- [ ] Google Search Console verified
- [ ] Bing Webmaster Tools verified

---

## 🆘 Troubleshooting

### Domain Not Loading After 24 Hours
1. Check DNS records at: https://dnschecker.org/#A/veyratech.co.ke
2. Verify A record points to: `76.76.21.21`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito mode

### SSL Certificate Not Working
1. Wait 10-15 minutes after DNS propagates
2. Vercel auto-generates SSL (Let's Encrypt)
3. Check Vercel dashboard: Domains → Status should be "Active"

### Old Domain Still Shows
1. Clear browser cache
2. Hard refresh (Ctrl+F5)
3. Check NEXTAUTH_URL updated in Vercel
4. Verify redeploy completed

---

## 📞 Support

**Need Help?**
- Vercel Support: https://vercel.com/support
- Email: admin@veyratech.com
- Phone: +254 745 247 211

---

## 🎉 After Setup Complete

Your site will be accessible at:

✅ **Primary Domain**: https://veyratech.co.ke  
✅ **WWW**: https://www.veyratech.co.ke  
✅ **Vercel**: https://vera-tech.vercel.app (still works as backup)  

All three domains point to the same site with SSL certificates!

---

**Status**: 📋 **READY TO CONFIGURE**  
**Estimated Time**: 1-24 hours (mostly DNS propagation)  
**Difficulty**: ⭐⭐ Easy
