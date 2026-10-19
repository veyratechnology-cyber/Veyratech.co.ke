# ⚡ Quick Start - Deploy Multi-Step Booking & Payment

## 🚀 5-Minute Deployment

### Step 1: Run Database Migration (2 minutes)

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to SQL Editor
3. Copy entire contents of `DATABASE_SCHEMA_UPDATE.sql`
4. Paste and click "Run"
5. ✅ Should see "Success. No rows returned"

**Option B: Via Command Line**
```bash
cd royaltech
psql $DATABASE_URL -f DATABASE_SCHEMA_UPDATE.sql
```

### Step 2: Regenerate Prisma Client (30 seconds)

```bash
cd royaltech
npx prisma generate
```

### Step 3: Deploy to Vercel (2 minutes)

```bash
git add .
git commit -m "feat: Multi-step booking with payment integration"
git push origin main
```

Vercel will auto-deploy in ~2 minutes.

### Step 4: Test It! (30 seconds)

1. Visit: https://veyratech.co.ke/pricing
2. Click any "Book Consultation" button
3. Complete the 6-step wizard
4. ✅ Should work end-to-end!

---

## 🧪 Quick Test Checklist

After deployment, verify these work:

### ✅ Basic Flow
- [ ] Pricing page loads
- [ ] Click "Book Consultation" → redirects to booking
- [ ] Package is pre-selected (check Step 1)
- [ ] Can navigate forward through all 6 steps
- [ ] Can click Back button
- [ ] Form validates (try leaving name empty)

### ✅ Booking Completion
- [ ] Complete all steps with valid data
- [ ] Click "Complete Booking"
- [ ] See confirmation screen (Step 6)
- [ ] Redirects to success page after 2 seconds
- [ ] Success page shows booking details

### ✅ Database
- [ ] Check Supabase → Consultations table
- [ ] New consultation record exists
- [ ] Check Invoices table
- [ ] New invoice record exists with correct amount

### ✅ Emails
- [ ] Check your inbox (email you entered)
- [ ] Should receive confirmation email
- [ ] Check gisembaaggrey@gmail.com
- [ ] Should receive admin notification

---

## 🔧 M-Pesa Configuration (Optional)

If you want to test M-Pesa payments:

### Sandbox (Testing)

1. Go to Safaricom Developer Portal: https://developer.safaricom.co.ke
2. Create account / Log in
3. Create a new app
4. Get credentials:
   - Consumer Key
   - Consumer Secret
   - Shortcode (Test: 174379)
   - Passkey

5. Add to Vercel environment variables:
```
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
```

6. Redeploy Vercel

7. Test:
   - Book consultation
   - Select M-Pesa payment
   - Use test phone: 254708374149
   - You'll receive STK push on Safaricom test env

### Production

Same steps, but:
- Use `MPESA_ENVIRONMENT=production`
- Apply for production credentials from Safaricom
- Use your actual Paybill/Till number

---

## 🐛 Troubleshooting

### "Cannot find module 'xyz'"
```bash
cd royaltech
npm install
```

### Prisma errors
```bash
npx prisma generate
npx prisma db push  # Alternative to SQL migration
```

### Booking submits but no invoice created
1. Check Vercel logs: https://vercel.com/your-project/logs
2. Search for `[BOOKING]` errors
3. Verify DATABASE_URL is set
4. Check database connection

### M-Pesa not working
1. Check environment variables are set in Vercel
2. Verify credentials from Safaricom
3. Check callback URL is publicly accessible
4. Look for `[MPESA]` errors in Vercel logs

### Emails not sending
1. Verify RESEND_API_KEY is set
2. Check Resend dashboard: https://resend.com/emails
3. Look for `[EMAIL]` errors in logs
4. Check spam folder

---

## 📊 Monitor Your Deployment

### Vercel Dashboard
- **Logs:** https://vercel.com/your-project/logs
- **Deployments:** https://vercel.com/your-project/deployments
- **Analytics:** https://vercel.com/your-project/analytics

### Database (Supabase)
- **Table Editor:** Check consultations and invoices
- **Logs:** Monitor database queries
- **API Logs:** Track Prisma queries

### Email (Resend)
- **Emails:** https://resend.com/emails
- **Analytics:** Check delivery rates
- **Logs:** Debug email issues

### M-Pesa (Safaricom)
- **Daraja Portal:** https://developer.safaricom.co.ke
- **API Logs:** Monitor STK Push requests
- **Transactions:** View payment history

---

## 🎯 Success Indicators

Your deployment is successful when:

1. ✅ **Pricing page** shows all packages
2. ✅ **Booking wizard** works through all 6 steps
3. ✅ **Database records** created (consultation + invoice)
4. ✅ **Emails sent** (confirmation to user + notification to admin)
5. ✅ **Payment methods** displayed correctly
6. ✅ **No console errors** in browser or Vercel logs

---

## 📞 Need Help?

### Quick Fixes

**"Page not found"**
- Clear browser cache
- Check Vercel deployment status
- Verify build succeeded

**"Internal server error"**
- Check Vercel logs for stack trace
- Verify environment variables are set
- Check database connection string

**"Form validation errors"**
- Check browser console for details
- Verify all required fields are filled
- Check date/time format

### Get Support

- **Email:** gisembaaggrey@gmail.com
- **Check logs:** Vercel Functions logs
- **Database:** Supabase logs
- **API:** Check Network tab in browser DevTools

---

## 🎉 You're Done!

If all checklist items pass, your multi-step booking with payment is live! 🚀

**Next recommended steps:**
1. Configure M-Pesa for production
2. Customize email templates
3. Add receipt generation
4. Set up installment plans

**Enjoy your new booking system!** 💼✨
