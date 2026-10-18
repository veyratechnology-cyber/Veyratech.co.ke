# 🚨 Email Not Working - Quick Fix Guide

## Problem Identified

You're not receiving emails because:
1. ❌ `RESEND_API_KEY` is empty (no email service configured)
2. ❌ Old email addresses in environment variables
3. ❌ Email forwarding not set up

---

## ✅ Solution: 3 Steps (15 minutes)

### Step 1: Get Resend API Key (5 minutes)

**1.1. Sign up for Resend:**
- Go to: https://resend.com/signup
- Sign up with your email
- Verify your email

**1.2. Add Your Domain:**
- Dashboard → Domains → Add Domain
- Enter: `veyratech.co.ke`
- Copy the DNS records shown

**1.3. Add DNS Records to Your Domain:**

In your domain provider (Hostinger/Namecheap/etc), add these DNS records:

```
Type: TXT
Name: resend._domainkey
Value: [Copy from Resend dashboard]
TTL: 3600

Type: TXT  
Name: _resend
Value: [Copy from Resend dashboard]
TTL: 3600
```

**1.4. Wait for Verification:**
- Check "Verify Domain" in Resend dashboard
- May take 5-30 minutes for DNS to propagate
- You'll see "Verified" ✅ when ready

**1.5. Get API Key:**
- Resend Dashboard → API Keys → Create API Key
- Name it: "VeyraTech Production"
- Copy the key (starts with `re_...`)
- **IMPORTANT:** Save it somewhere safe - you can only see it once!

---

### Step 2: Update Vercel Environment Variables (3 minutes)

**2.1. Go to Vercel:**
- Login: https://vercel.com
- Select your VeyraTech project

**2.2. Update Environment Variables:**
- Settings → Environment Variables

**Update/Add these variables:**

```env
RESEND_API_KEY=re_your_actual_api_key_here

EMAIL_FROM=VeyraTech <noreply@veyratech.co.ke>

ADMIN_EMAIL=hello@veyratech.co.ke
```

**How to update:**
1. Find existing variable (e.g., `RESEND_API_KEY`)
2. Click the three dots → Edit
3. Paste the new value
4. Save
5. Repeat for `EMAIL_FROM` and `ADMIN_EMAIL`

**2.3. Redeploy:**
- Deployments tab → Click on latest deployment
- Click three dots → Redeploy
- Or just push any change to trigger auto-deploy

---

### Step 3: Set Up Email Forwarding (7 minutes)

You need to receive emails sent to @veyratech.co.ke addresses.

**Option A: Email Forwarding (Recommended - Free & Quick)**

In your domain provider (Hostinger, Namecheap, GoDaddy, etc.):

1. Find "Email Forwarding" or "Email" section
2. Create these forwards:

```
From: hello@veyratech.co.ke
To: gisembaaggrey@gmail.com

From: consulting@veyratech.co.ke
To: gisembaaggrey@gmail.com

From: support@veyratech.co.ke
To: gisembaaggrey@gmail.com
```

3. Save and test

**Option B: Google Workspace (Professional - $6/month)**

If you want to reply FROM @veyratech.co.ke addresses:
1. Sign up: https://workspace.google.com/
2. Verify domain ownership
3. Create mailboxes for hello@, consulting@, support@
4. Update MX records

---

## 🧪 Testing (5 minutes)

### Test 1: Check Resend is Working

Go to Resend Dashboard → Logs
- You should see email attempts here when forms are submitted

### Test 2: Submit Contact Form

1. Go to: https://veyratech.co.ke/contact
2. Fill out the form with YOUR email
3. Submit
4. Check:
   - ✅ Resend logs show email sent
   - ✅ gisembaaggrey@gmail.com receives notification
   - ✅ Your email receives confirmation

### Test 3: Check Spam Folder

If emails don't arrive in inbox:
- Check spam/junk folder
- Mark as "Not Spam"
- Add to contacts

### Test 4: Submit From Different Email

Try submitting with a different email address (not Gmail) to rule out Gmail-specific issues.

---

## 📊 Verification Checklist

**Resend Setup:**
- [ ] Account created
- [ ] Domain veyratech.co.ke added
- [ ] DNS records added to domain provider
- [ ] Domain shows "Verified" ✅
- [ ] API key generated and copied

**Vercel Setup:**
- [ ] RESEND_API_KEY updated with real key
- [ ] EMAIL_FROM updated to noreply@veyratech.co.ke
- [ ] ADMIN_EMAIL updated to hello@veyratech.co.ke
- [ ] Site redeployed

**Email Reception:**
- [ ] Forwarding rules created OR
- [ ] Google Workspace set up
- [ ] Test email sent to hello@veyratech.co.ke
- [ ] Test email received at gisembaaggrey@gmail.com

**Form Testing:**
- [ ] Contact form submitted
- [ ] Notification received
- [ ] Confirmation received
- [ ] No errors in Resend logs

---

## 🔍 If Still Not Working

### Check 1: Resend Logs
```
1. Go to: https://resend.com/emails
2. Look for recent emails
3. Check status:
   - ✅ Delivered = working
   - ❌ Bounced = email address invalid
   - ⏳ Queued = still sending
   - ❌ Failed = check error message
```

### Check 2: Vercel Logs
```
1. Vercel → Your Project → Logs
2. Look for email-related errors
3. Search for: "EMAIL" or "Resend"
```

### Check 3: Browser Console
```
1. Open website
2. F12 → Console tab
3. Submit form
4. Look for errors in red
```

### Check 4: Network Tab
```
1. F12 → Network tab
2. Submit form
3. Look for /api/contact or /api/book-consultation
4. Check response:
   - 200 = success
   - 400/500 = error (check response body)
```

---

## 🆘 Common Issues & Solutions

### Issue 1: "Resend API key not configured"
**Solution:** Add RESEND_API_KEY to Vercel environment variables and redeploy

### Issue 2: "Domain not verified"
**Solution:** 
- Check DNS records are correct
- Wait up to 48 hours for propagation
- Use DNSChecker.org to verify records

### Issue 3: "Emails going to spam"
**Solutions:**
- Add SPF record: `v=spf1 include:_spf.resend.com ~all`
- Add DMARC record: `v=DMARC1; p=none;`
- Ask recipients to add to contacts
- Avoid spam trigger words in emails

### Issue 4: "Email not receiving"
**Solution:**
- Check email forwarding rules are active
- Test by sending email directly to hello@veyratech.co.ke
- Check spam folder
- Verify MX records if using Google Workspace

### Issue 5: "Form submits but no email"
**Solution:**
- Check Resend logs for errors
- Verify API key is correct
- Check Vercel logs for errors
- Ensure environment variables are in Production scope

---

## 📞 Quick Commands to Check Setup

### Check DNS Records:
```bash
# Check if Resend DNS records are set
nslookup -type=TXT resend._domainkey.veyratech.co.ke
nslookup -type=TXT _resend.veyratech.co.ke
```

### Check MX Records (if using email hosting):
```bash
nslookup -type=MX veyratech.co.ke
```

### Test Email Sending (Node.js):
```javascript
// test-email.js
const { Resend } = require('resend');
const resend = new Resend('re_your_api_key_here');

resend.emails.send({
  from: 'VeyraTech <noreply@veyratech.co.ke>',
  to: 'gisembaaggrey@gmail.com',
  subject: 'Test Email',
  html: '<h1>It works!</h1>'
}).then(console.log).catch(console.error);
```

Run:
```bash
npm install resend
node test-email.js
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Resend Dashboard:**
   - Domain shows "Verified" ✅
   - Emails show "Delivered" status
   - No error messages

2. **Form Submission:**
   - Success message appears
   - No errors in browser console
   - Email arrives within 1 minute

3. **Email Received:**
   - Notification at gisembaaggrey@gmail.com
   - Confirmation to submitter's email
   - All form data included

---

## 📋 Current Status

**What's Already Done:**
- ✅ Code updated with correct email addresses
- ✅ Email routing configured (hello@, consulting@, support@)
- ✅ Forms connected to correct endpoints
- ✅ Deployed to production

**What You Need to Do:**
- ⏳ Get Resend API key
- ⏳ Update Vercel environment variables
- ⏳ Set up email forwarding
- ⏳ Test all forms

---

## 🎯 Summary

**The core issue:** `RESEND_API_KEY` is empty, so no emails can be sent.

**The fix:**
1. Sign up for Resend → Get API key
2. Add to Vercel environment variables
3. Set up email forwarding
4. Test

**Time needed:** ~15 minutes  
**Cost:** Free (Resend has generous free tier: 100 emails/day, 3,000/month)

---

## 📞 Need Help?

If you get stuck:

1. **Check Resend Documentation:** https://resend.com/docs
2. **Check Vercel Docs:** https://vercel.com/docs/projects/environment-variables
3. **Domain Provider Support:** They can help with DNS/forwarding
4. **Share Error Messages:** From Resend logs or Vercel logs

---

**Next Action:** Sign up for Resend and get your API key! 🚀

*Last Updated: August 23, 2026*
