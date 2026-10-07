# 🚀 VeyraTech Deployment Checklist

## ✅ Step 1: DNS Configuration (DONE)
- [x] Configured DNS records
- [x] DNS is resolving (verified)

---

## 📋 Step 2: Verify DNS Records

Check your DNS settings at your domain registrar. You should have:

```
Type: A
Name: @ (or blank for root)
Value: 76.76.21.21
TTL: 3600

Type: A
Name: www
Value: 76.76.21.21
TTL: 3600
```

**Quick Check**: Visit https://dnschecker.org/#A/veyratech.co.ke

✅ It should show: `76.76.21.21` globally

---

## 📋 Step 3: Add Domain in Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech/settings/domains

2. Click **"Add Domain"**

3. Enter: `veyratech.co.ke`

4. Click **"Add"**

5. Also add: `www.veyratech.co.ke`

6. Vercel will:
   - ✅ Verify DNS records
   - ✅ Generate SSL certificate (automatic)
   - ✅ Set up redirects

**Status**: ⏳ Pending (do this now)

---

## 📋 Step 4: Update Environment Variables in Vercel

Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech/settings/environment-variables

### Variables to Update (4 total):

#### 1. NEXTAUTH_URL
```
Current: https://vera-tech.vercel.app
New: https://veyratech.co.ke
Environment: Production ✅
```

#### 2. NEXT_PUBLIC_APP_URL
```
Current: https://vera-tech.vercel.app
New: https://veyratech.co.ke
Environment: Production ✅
```

#### 3. NEXT_PUBLIC_ADMIN_URL
```
Current: https://vera-tech.vercel.app/admin
New: https://veyratech.co.ke/admin
Environment: Production ✅
```

#### 4. GOOGLE_REDIRECT_URI
```
Current: https://vera-tech.vercel.app/api/auth/google/callback
New: https://veyratech.co.ke/api/auth/google/callback
Environment: Production ✅
```

**How to Update Each Variable:**
1. Find the variable in the list
2. Click the **3 dots (•••)** → **"Edit"**
3. Change the value
4. Click **"Save"**

**Status**: ⏳ Pending (do this now)

---

## 📋 Step 5: Redeploy in Vercel

After updating environment variables:

1. Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech

2. Click **"Deployments"** tab

3. Find the latest deployment

4. Click **3 dots (•••)** → **"Redeploy"**

5. ✅ **UNCHECK** "Use existing build cache"

6. Click **"Redeploy"**

7. Wait 2-3 minutes for deployment to complete

**Status**: ⏳ Pending (do this after Step 4)

---

## 📋 Step 6: Seed Database (If Needed)

After deployment completes, check if database has data:

### Check Database Status:
Visit: https://veyratech.co.ke/api/debug/check-db

**If services/industries = 0**, then seed:

1. Go to: https://veyratech.co.ke/seed.html

2. Click **"Seed Database Now"**

3. Wait for success message

4. Verify:
   - ✅ 8 services inserted
   - ✅ 6 industries inserted

**Status**: ⏳ Pending (after deployment)

---

## 🧪 Step 7: Test Everything

### Test 1: Homepage
```
URL: https://veyratech.co.ke
Expected: ✅ Homepage loads successfully
SSL: ✅ Padlock icon visible
```

### Test 2: WWW Redirect
```
URL: https://www.veyratech.co.ke
Expected: ✅ Redirects to https://veyratech.co.ke
```

### Test 3: Admin Protection (Unauthorized Access)
```
Action: Open INCOGNITO window (Ctrl+Shift+N)
URL: https://veyratech.co.ke/admin
Expected: 🛡️ Redirects to /admin-login (protection works!)
```

### Test 4: Admin Login
```
URL: https://veyratech.co.ke/admin-login
Email: admin@veyratech.com
Password: ***REMOVED***
Expected: ✅ Logs in successfully → Shows admin dashboard
```

### Test 5: Booking Form (Security)
```
URL: https://veyratech.co.ke/book-consultation
Action: Fill form and submit
Expected: ✅ Works, validates input, shows user-friendly errors
```

### Test 6: SQL Injection Test (Should Block)
```
Action: Enter in name field: Robert'); DROP TABLE;--
Expected: 🛡️ Sanitized to "Robert" (attack blocked)
```

### Test 7: Service Pages
```
URL: https://veyratech.co.ke/services/software-systems
Expected: ✅ Page loads (no 404)
```

### Test 8: Industry Pages
```
URL: https://veyratech.co.ke/industries/real-estate
Expected: ✅ Page loads (no 404)
```

### Test 9: Sitemap
```
URL: https://veyratech.co.ke/sitemap.xml
Expected: ✅ Shows XML format with all pages
```

### Test 10: Robots.txt
```
URL: https://veyratech.co.ke/robots.txt
Expected: ✅ Shows robots configuration
```

---

## 🔍 Troubleshooting

### Issue: Domain shows "Domain Not Found" or "Server Not Found"
**Solution**:
- DNS hasn't propagated yet (can take up to 24 hours)
- Check DNS at: https://dnschecker.org/#A/veyratech.co.ke
- Wait and try again in 1 hour

### Issue: "Invalid configuration" in Vercel
**Solution**:
- Ensure A record points to: `76.76.21.21`
- Remove any conflicting DNS records (old A records, CNAME conflicts)
- Contact your domain registrar if issues persist

### Issue: SSL certificate not working (no padlock)
**Solution**:
- Wait 10-15 minutes after adding domain in Vercel
- Vercel auto-generates SSL certificates (Let's Encrypt)
- Check Vercel → Domains → Status should show "Active"

### Issue: Admin pages accessible without login
**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito mode
- Verify redeploy completed successfully
- Check middleware.ts is deployed

### Issue: Still seeing vera-tech.vercel.app
**Solution**:
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Verify environment variables updated in Vercel
- Check redeploy completed

### Issue: 404 on service/industry pages
**Solution**:
- Database is empty
- Visit: https://veyratech.co.ke/seed.html
- Click "Seed Database Now"

---

## 📊 Current Status

| Task | Status | Notes |
|------|--------|-------|
| DNS Configured | ✅ Done | User confirmed |
| DNS Propagation | 🔄 In Progress | Check dnschecker.org |
| Add Domain in Vercel | ⏳ Pending | Your action |
| Update Env Variables | ⏳ Pending | 4 variables |
| Redeploy | ⏳ Pending | After env update |
| Seed Database | ⏳ Pending | If needed |
| Test Everything | ⏳ Pending | After deploy |

---

## 🎯 Priority Actions (Do These Now)

### 1️⃣ HIGHEST PRIORITY: Add Domain in Vercel
- Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech/settings/domains
- Add: `veyratech.co.ke` and `www.veyratech.co.ke`

### 2️⃣ HIGH PRIORITY: Update Environment Variables
- Go to: https://vercel.com/veyratechnology-cybers-projects/vera-tech/settings/environment-variables
- Update 4 variables (see Step 4 above)

### 3️⃣ MEDIUM PRIORITY: Redeploy
- After Step 2, redeploy without cache
- Wait 2-3 minutes

### 4️⃣ LOW PRIORITY: Test
- After deployment, test all functionality
- Report any issues

---

## 📞 Need Help?

**While completing these steps, if you encounter any issues:**
- **Email**: admin@veyratech.com
- **Phone**: +254 745 247 211
- **Vercel Support**: https://vercel.com/support

**Or just tell me:**
- Which step you're on
- What you're seeing
- Any error messages

---

## ✅ Final Verification

After completing all steps, you should have:

- [ ] ✅ https://veyratech.co.ke loads successfully
- [ ] ✅ SSL certificate active (padlock icon)
- [ ] ✅ Admin pages protected (require login)
- [ ] ✅ Booking form works with security
- [ ] ✅ Service pages load (no 404)
- [ ] ✅ Industry pages load (no 404)
- [ ] ✅ Sitemap.xml accessible
- [ ] ✅ Robots.txt accessible
- [ ] ✅ Old domain (vera-tech.vercel.app) still works as backup

---

**Current Status**: 🔄 **IN PROGRESS**  
**Next Step**: Add domain in Vercel + Update environment variables  
**ETA**: 10-15 minutes (your actions) + 2-3 minutes (deployment)
