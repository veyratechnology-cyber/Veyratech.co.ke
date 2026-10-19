# ⚡ Quick Start Checklist - Get Emails Working NOW

## 🎯 Goal
Get your email confirmations working in the next 10 minutes.

---

## ✅ Step-by-Step Checklist

### ☐ Step 1: Test Emails Locally (2 minutes)

Open your terminal in the `royaltech` folder and run:

```bash
node test-email.js
```

**Expected result:**
- ✅ Two emails sent successfully
- ✅ Email IDs shown in console

**If you get an error:**
- Check `.env` file has `RESEND_API_KEY=your_resend_api_key_here`
- Make sure you're in the `royaltech` folder
- Run `npm install` if packages are missing

---

### ☐ Step 2: Check Your Inbox (2 minutes)

Check email: **gisembaaggrey@gmail.com**

**You should receive 2 test emails:**
1. "VeyraTech Email Test - Admin Notification"
2. "VeyraTech Email Test - Customer Confirmation"

**If emails don't arrive:**
- Wait 5 minutes (sometimes delayed)
- Check spam/junk folder
- Move on to Step 3 while waiting

---

### ☐ Step 3: Verify Vercel Settings (3 minutes)

1. Go to: https://vercel.com
2. Select your VeyraTech project
3. Click "Settings" → "Environment Variables"
4. Verify these exist:
   ```
   RESEND_API_KEY = your_resend_api_key_here
   EMAIL_FROM = VeyraTech <noreply@veyratech.co.ke>
   ADMIN_EMAIL = hello@veyratech.co.ke
   ```

**If missing or wrong:**
- Add/update the variables
- ✅ Apply to: Production, Preview, Development (all three)
- Click "Save"

---

### ☐ Step 4: Redeploy Site (2 minutes)

**After updating environment variables:**

1. Go to "Deployments" tab in Vercel
2. Click latest deployment
3. Click "⋯" menu → "Redeploy"
4. ✅ Check "Use existing Build Cache" (faster)
5. Click "Redeploy"
6. Wait ~2-3 minutes for deployment to complete
7. You'll see "Ready" status when done

---

### ☐ Step 5: Test Contact Form on Live Site (3 minutes)

1. Go to: https://veyratech.co.ke/contact
2. Fill in the form:
   - **Name:** Your Name
   - **Email:** gisembaaggrey@gmail.com
   - **Subject:** Testing email system
   - **Message:** This is a test to verify email confirmations are working.
3. Click "Send Message"
4. You should see: "Message sent successfully!"

**Check your inbox (gisembaaggrey@gmail.com) within 2 minutes:**
- ✅ Confirmation email: "We've Received Your Message"
- ✅ Admin notification: "Contact Form: Testing email system"

---

### ☐ Step 6: Test Consultation Booking (3 minutes)

1. Go to: https://veyratech.co.ke/book-consultation
2. Fill in the form:
   - **Name:** Your Name
   - **Email:** gisembaaggrey@gmail.com
   - **Phone:** +254745247211
   - **Business Challenge:** Testing consultation booking emails
   - **Preferred Date:** Tomorrow
   - **Preferred Time:** 10:00
3. Click "Book Free Consultation"
4. You should be redirected to success page

**Check your inbox within 2 minutes:**
- ✅ Confirmation email with meeting details
- ✅ Admin notification about new booking

---

### ☐ Step 7: Verify in Resend Dashboard (1 minute)

1. Go to: https://resend.com/emails
2. Log in with: gisembaaggrey@gmail.com
3. You should see recent emails with status: **Delivered** ✅

**If status is "Bounced" or "Failed":**
- Click the email to see error details
- Check email forwarding is configured
- Check if domain is verified

---

### ☐ Step 8: Check Vercel Logs (1 minute)

1. Go to: https://vercel.com/[your-project]/logs
2. Filter by searching: `[EMAIL]`
3. You should see logs like:
   ```
   [EMAIL] Contact notification sent to admin: {...}
   [EMAIL] Contact confirmation sent to customer: {...}
   ```

**If you see errors:**
- Note the error message
- Share it with developer/support
- See troubleshooting section below

---

## 🎉 Success!

If you completed all steps and received emails, your system is working! 🎊

**You should have received:**
- ✅ 2 test emails (from Step 1)
- ✅ 2 contact form emails (from Step 5)
- ✅ 2 consultation booking emails (from Step 6)
- **Total: 6 emails** in gisembaaggrey@gmail.com

---

## 🐛 Quick Troubleshooting

### Problem: "node test-email.js" fails

**Error: "Cannot find module 'resend'"**
```bash
npm install
```

**Error: "RESEND_API_KEY is not set"**
```bash
# Check .env file
cat .env | grep RESEND_API_KEY
```

Should show: `RESEND_API_KEY=your_resend_api_key_here`

---

### Problem: Test emails sent but not arriving

**Check 1: Spam folder**
- Look in junk/spam
- Mark as "Not Spam" if found there

**Check 2: Resend dashboard**
- Go to: https://resend.com/emails
- Check if emails show status "Delivered"
- If "Bounced" - check recipient email

**Check 3: Wait longer**
- Sometimes takes 5-10 minutes
- Especially for first emails

---

### Problem: Live site forms not sending emails

**Check 1: Vercel environment variables**
- Are they set correctly?
- Did you redeploy after setting them?

**Check 2: Vercel logs**
- Any `[EMAIL]` error messages?
- Share error with support

**Check 3: Resend domain verification**
- Go to: https://resend.com/domains
- Is veyratech.co.ke status "Verified"?
- If not, check DNS records

---

## 📞 Need Help?

### Option 1: Check detailed guides
- `EMAIL_TESTING_GUIDE.md` - Full testing instructions
- `EMAIL_CONFIGURATION_GUIDE.md` - Setup instructions
- `CUSTOMER_JOURNEY_AND_EMAIL_FIX.md` - Overview

### Option 2: Resend Support
- Email: support@resend.com
- Dashboard: https://resend.com/support
- Include: domain name, error messages, email IDs

### Option 3: Vercel Support
- Dashboard: https://vercel.com/support
- If deployment or environment variable issues

---

## 🚀 After Emails Work

Once emails are working reliably, next steps:

1. ✅ **Add your logo** to email templates (branded emails)
2. ✅ **Set up email forwarding** (all @veyratech.co.ke → gisembaaggrey@gmail.com)
3. ✅ **Add calendar invites** (.ics files for consultations)
4. ✅ **Set up reminder emails** (24h before meetings)
5. ✅ **Monitor email metrics** (open rates, delivery rates)

---

## 📊 Tracking Progress

Mark items as complete:

- [ ] Step 1: Test emails locally ✅
- [ ] Step 2: Received test emails ✅
- [ ] Step 3: Verified Vercel settings ✅
- [ ] Step 4: Redeployed site ✅
- [ ] Step 5: Tested contact form ✅
- [ ] Step 6: Tested consultation booking ✅
- [ ] Step 7: Verified in Resend dashboard ✅
- [ ] Step 8: Checked Vercel logs ✅

**Progress: ___ / 8 steps complete**

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Easy  
**Last Updated:** August 23, 2026
