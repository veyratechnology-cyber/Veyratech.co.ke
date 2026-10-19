# 📧 Email Testing & Setup Guide

## Quick Start - Test Your Emails Right Now! ⚡

### Step 1: Test Email Configuration (Local)

Run this command in your project folder:

```bash
node test-email.js
```

**What it does:**
- ✅ Checks if RESEND_API_KEY is set
- ✅ Sends a test email to `hello@veyratech.co.ke`
- ✅ Sends a test email to `gisembaaggrey@gmail.com`
- ✅ Shows you the email IDs from Resend

**Expected Output:**
```
🧪 Testing Resend Email Configuration...

📋 Configuration Check:
  RESEND_API_KEY: ✅ Set
  EMAIL_FROM: VeyraTech <noreply@veyratech.co.ke>
  ADMIN_EMAIL: hello@veyratech.co.ke

📧 Test 1: Sending test email to admin...
  ✅ Email sent successfully!
  Email ID: abc123...

📧 Test 2: Sending test email to gisembaaggrey@gmail.com...
  ✅ Email sent successfully!
  Email ID: def456...

✅ Email testing complete!
```

### Step 2: Check Your Inbox

Within 1-2 minutes, you should receive:
1. ✉️ Email at `gisembaaggrey@gmail.com` (direct)
2. ✉️ Email at `gisembaaggrey@gmail.com` (forwarded from hello@veyratech.co.ke)

**If emails don't arrive:**
- Check spam/junk folder
- Wait 5 minutes (sometimes delayed)
- Check Resend dashboard: https://resend.com/emails

---

## Step 3: Test Production (Vercel)

### A. Verify Vercel Environment Variables

Go to: https://vercel.com/[your-project]/settings/environment-variables

**Make sure these are set:**
```
RESEND_API_KEY = your_resend_api_key_here
EMAIL_FROM = VeyraTech <noreply@veyratech.co.ke>
ADMIN_EMAIL = hello@veyratech.co.ke
```

### B. Redeploy Your Site

After setting environment variables:
1. Go to: https://vercel.com/[your-project]/deployments
2. Click on the latest deployment
3. Click "Redeploy" button
4. Wait for deployment to complete (~2-3 minutes)

### C. Test Contact Form on Live Site

1. Go to: https://veyratech.co.ke/contact
2. Fill in the form with **your real email** (gisembaaggrey@gmail.com)
3. Submit the form
4. You should see: "Message sent successfully! We'll get back to you soon."

**Within 2 minutes, check:**
- ✅ Confirmation email in your inbox
- ✅ Admin notification at gisembaaggrey@gmail.com
- ✅ Both emails arrived

### D. Test Consultation Booking on Live Site

1. Go to: https://veyratech.co.ke/book-consultation
2. Fill in the form:
   - Name: Your name
   - Email: gisembaaggrey@gmail.com
   - Phone: +254745247211
   - Business Challenge: "Testing email functionality"
   - Preferred Date: Tomorrow's date
   - Preferred Time: 10:00
3. Submit the form
4. You should be redirected to success page

**Within 2 minutes, check:**
- ✅ Confirmation email with meeting details
- ✅ Admin notification at gisembaaggrey@gmail.com
- ✅ Calendar invite (if Google Calendar configured)

---

## Step 4: Monitor & Debug

### Check Vercel Logs (Real-Time)

Go to: https://vercel.com/[your-project]/logs

**Filter logs by:**
- Search for: `[EMAIL]`
- Search for: `[CONTACT]`

**What to look for:**
```
✅ Good logs:
[CONTACT] Received data: {...}
[CONTACT] Message saved successfully: msg_xxxxx
[EMAIL] Contact notification sent to admin: {...}
[EMAIL] Contact confirmation sent to customer: {...}

❌ Bad logs (errors):
[EMAIL] Failed to send contact notification: Error: ...
[EMAIL] Resend not configured - API key missing!
```

### Check Resend Dashboard

Go to: https://resend.com/emails

**What you should see:**
- List of recent emails
- Status: "Delivered" (green)
- Recipients: hello@veyratech.co.ke, consulting@veyratech.co.ke, etc.

**If status is "Bounced":**
- Check recipient email address is correct
- Check email forwarding is configured
- Contact Resend support

---

## 🐛 Troubleshooting

### Problem: "No emails arriving"

**Solution 1: Check API Key**
```bash
# In royaltech folder
node -e "console.log(require('dotenv').config()); console.log(process.env.RESEND_API_KEY)"
```
- Should show: `your_resend_api_key_here`
- If empty: API key not in .env file

**Solution 2: Check Resend Domain**
1. Go to: https://resend.com/domains
2. Find: `veyratech.co.ke`
3. Status should be: **Verified** ✅
4. If not verified, check DNS records

**Solution 3: Check Email Forwarding**
Your domain provider (Cloudflare, Namecheap, etc.) should have email forwarding:
- `hello@veyratech.co.ke` → `gisembaaggrey@gmail.com`
- `consulting@veyratech.co.ke` → `gisembaaggrey@gmail.com`
- `support@veyratech.co.ke` → `gisembaaggrey@gmail.com`

**Solution 4: Test Direct Send (No Forwarding)**
Change this temporarily in `.env`:
```env
ADMIN_EMAIL=gisembaaggrey@gmail.com
```
Then test again. If emails arrive now, the issue is email forwarding.

---

### Problem: "Form shows success but no email"

This means:
- ✅ Form submission works
- ✅ Database save works
- ❌ Email sending fails silently

**Check Vercel logs for:**
```
[EMAIL] Failed to send contact notification: ...
[EMAIL] Resend not configured - API key missing!
```

**Fix:**
1. Verify `RESEND_API_KEY` is set in Vercel
2. Redeploy the site
3. Test again

---

### Problem: "Emails going to spam"

**Immediate Fix:**
- Check spam folder
- Mark as "Not Spam"
- Add `noreply@veyratech.co.ke` to contacts

**Long-term Fix (DNS):**
Add these DNS records to your domain:

```
SPF Record:
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

DKIM Record:
Type: TXT
Name: resend._domainkey
Value: [Get from Resend dashboard]

DMARC Record:
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@veyratech.co.ke
```

Get exact values from: https://resend.com/domains/veyratech.co.ke

---

## ✅ Success Checklist

Your emails are working when you can confirm:

- [ ] `node test-email.js` sends emails successfully
- [ ] Test emails arrive at gisembaaggrey@gmail.com
- [ ] Resend dashboard shows "Delivered" status
- [ ] Contact form on live site sends confirmation email
- [ ] Consultation booking sends confirmation with meeting details
- [ ] Admin receives notifications at gisembaaggrey@gmail.com
- [ ] No errors in Vercel logs
- [ ] Emails not in spam folder

---

## 📞 Still Having Issues?

### Option 1: Check Resend Status
Go to: https://resend.com/status
- If Resend is down, emails won't send

### Option 2: Contact Resend Support
Email: support@resend.com
- They usually respond within 24 hours
- Include: your domain (veyratech.co.ke), API key (first 8 chars), error logs

### Option 3: Try Alternative Email Service
If Resend doesn't work, you can switch to:
- SendGrid (free tier: 100 emails/day)
- Mailgun (free tier: 5,000 emails/month)
- Amazon SES (very cheap, $0.10 per 1,000 emails)

---

## 🎯 Next Steps After Emails Work

Once emails are sending correctly:

1. **Add Calendar Invites** (.ics files attached to consultation confirmations)
2. **Set Up Reminder Emails** (24h, 1h before meetings)
3. **Add Email Templates** (branded HTML emails with your logo)
4. **Monitor Email Stats** (open rates, click rates from Resend dashboard)
5. **Set Up SMS Notifications** (optional, via Twilio)

---

**Last Updated:** August 23, 2026  
**Your API Key:** `your_resend_api_key_here`  
**Your Domain:** `veyratech.co.ke`  
**Resend Account Email:** `gisembaaggrey@gmail.com`
