# 📱 M-Pesa Newsletter Subscription Setup Guide

## 🎯 Overview

Your VeyraTech Insights newsletter now has **M-Pesa payment integration**! Users can subscribe for **KSH 100** and get 1 year of expert insights delivered to their inbox.

---

## ✅ What's Been Built:

### 1. **Database Schema**
- ✅ `NewsletterSubscription` model with payment tracking
- ✅ Payment status tracking (PENDING, PROCESSING, COMPLETED, FAILED)
- ✅ M-Pesa transaction IDs and receipts
- ✅ Subscription expiry dates (1 year)

### 2. **M-Pesa Integration**
- ✅ Daraja API STK Push implementation
- ✅ Phone number formatting and validation
- ✅ OAuth token generation
- ✅ Payment callback handler

### 3. **API Endpoints**
- ✅ `POST /api/newsletter/subscribe` - Initiate subscription & payment
- ✅ `POST /api/mpesa/callback` - Receive payment confirmations
- ✅ `GET /api/newsletter/status` - Check payment status

### 4. **Frontend Component**
- ✅ Beautiful subscription form with email + phone
- ✅ Real-time payment status updates
- ✅ M-Pesa STK Push initiation
- ✅ Loading states and success/error messages
- ✅ Automatic payment polling

---

## 🚀 Setup Instructions:

### Step 1: Get M-Pesa Daraja API Credentials

#### **For Testing (Sandbox)**:
1. Go to: https://developer.safaricom.co.ke/
2. **Sign up** for an account
3. **Create an app** in the dashboard
4. Select **"Lipa Na M-Pesa Online"** (STK Push)
5. Copy your credentials:
   - Consumer Key
   - Consumer Secret
   - Shortcode (Test: `174379`)
   - Passkey (Test: Provided by Safaricom)

#### **For Production**:
1. Register your business with Safaricom
2. Apply for M-Pesa Paybill or Till number
3. Get production credentials from Safaricom
4. Go through compliance approval process

---

### Step 2: Add M-Pesa Credentials to Vercel

Go to **Vercel Dashboard** → **Settings** → **Environment Variables**

Add these variables:

```
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
```

**For Production**, change:
```
MPESA_ENVIRONMENT=production
MPESA_SHORTCODE=your_paybill_or_till_number
```

---

### Step 3: Update Database Schema

Run Prisma migration to add the newsletter subscription table:

```powershell
# Push schema changes to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

---

### Step 4: Register Callback URL with Safaricom

Your callback URL is:
```
https://veyratech.co.ke/api/mpesa/callback
```

**For Sandbox:**
- URL is automatically registered when you make STK Push requests
- No manual setup needed

**For Production:**
1. Contact Safaricom to whitelist your callback URL
2. Provide them: `https://veyratech.co.ke/api/mpesa/callback`
3. Wait for approval (usually 1-2 business days)

---

### Step 5: Test the Integration

#### **Sandbox Testing**:
1. Go to: https://veyratech.co.ke/insights
2. Scroll to "Get Expert Insights Delivered"
3. Enter email and test phone number
4. Click "Subscribe - KSH 100"

**Sandbox Test Numbers:**
- Phone: `254708374149` (Test number provided by Safaricom)
- Any 4-digit PIN works in sandbox

Expected flow:
1. ✅ Form submitted
2. ✅ "Check your phone!" message appears
3. ✅ (In production, user enters M-Pesa PIN on phone)
4. ✅ Payment confirmed
5. ✅ "Payment successful!" message
6. ✅ Subscription activated

---

## 📊 How It Works:

### User Flow:
```
1. User visits /insights page
   ↓
2. Enters email + phone number
   ↓
3. Clicks "Subscribe - KSH 100"
   ↓
4. System initiates M-Pesa STK Push
   ↓
5. User receives prompt on their phone
   ↓
6. User enters M-Pesa PIN
   ↓
7. Payment processed by Safaricom
   ↓
8. Callback sent to /api/mpesa/callback
   ↓
9. Subscription activated (status = ACTIVE)
   ↓
10. User receives confirmation ✅
```

### Technical Flow:
```
POST /api/newsletter/subscribe
→ Create subscription record (status: PENDING_PAYMENT)
→ Call M-Pesa STK Push API
→ Return checkoutRequestId
→ Frontend polls /api/newsletter/status every 2 seconds

User enters PIN on phone
→ Safaricom processes payment
→ Safaricom sends callback to /api/mpesa/callback
→ Update subscription (status: ACTIVE, paymentStatus: COMPLETED)
→ Frontend detects status change
→ Show success message ✅
```

---

## 🗂️ Database Schema:

```prisma
model NewsletterSubscription {
  id                  String              @id @default(uuid())
  email               String              @unique
  phoneNumber         String?
  status              NewsletterStatus    @default(PENDING_PAYMENT)
  subscriptionType    SubscriptionType    @default(PAID)
  paymentStatus       PaymentStatus       @default(PENDING)
  mpesaCheckoutId     String?             // STK Push checkout ID
  mpesaReceiptNumber  String?             // M-Pesa receipt (e.g., OEI2AK4Q0S)
  amount              Int                 @default(100)
  paidAt              DateTime?
  expiresAt           DateTime?           // 1 year from payment
  subscribedAt        DateTime?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
}
```

**Status Values:**
- `PENDING_PAYMENT` - Waiting for payment
- `ACTIVE` - Paid and subscribed
- `EXPIRED` - Subscription expired (after 1 year)
- `UNSUBSCRIBED` - User unsubscribed

**Payment Status:**
- `PENDING` - Payment not initiated
- `PROCESSING` - STK Push sent, waiting for user
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed or cancelled

---

## 📱 Testing Checklist:

### Sandbox Testing:
- [ ] Go to `/insights` page
- [ ] Enter email: `test@example.com`
- [ ] Enter phone: `254708374149` (Safaricom test number)
- [ ] Click "Subscribe - KSH 100"
- [ ] See "Check your phone!" message
- [ ] (In sandbox, auto-approves after 30 seconds)
- [ ] See "Payment successful!" message
- [ ] Check database: subscription status = ACTIVE

### Production Testing (After Go-Live):
- [ ] Use real phone number
- [ ] Receive STK Push on phone
- [ ] Enter M-Pesa PIN
- [ ] Payment deducted from M-Pesa
- [ ] Receive M-Pesa SMS confirmation
- [ ] Subscription activated
- [ ] Welcome email sent

---

## 🔧 Admin Features:

### View Subscriptions:
Go to: `/admin/insights` (coming soon)

You'll see:
- ✅ All newsletter subscriptions
- ✅ Payment status
- ✅ M-Pesa receipt numbers
- ✅ Subscription expiry dates
- ✅ Total revenue

### Export Subscriber Emails:
```sql
SELECT email, status, paid_at, expires_at
FROM newsletter_subscriptions
WHERE status = 'ACTIVE'
ORDER BY paid_at DESC;
```

---

## 💰 Pricing & Revenue:

**Subscription Price:** KSH 100 (one-time)
**Duration:** 1 year
**M-Pesa Fee:** ~KSH 2.50 (M-Pesa charges)
**Net Revenue:** ~KSH 97.50 per subscription

**Example:**
- 100 subscribers = KSH 10,000 gross / KSH 9,750 net
- 500 subscribers = KSH 50,000 gross / KSH 48,750 net
- 1,000 subscribers = KSH 100,000 gross / KSH 97,500 net

---

## 🎨 Customization Options:

### Change Subscription Price:
Edit: `lib/mpesa/index.ts` and `app/api/newsletter/subscribe/route.ts`
```typescript
amount: 200, // Change from 100 to 200
```

### Change Subscription Duration:
Edit: `app/api/mpesa/callback/route.ts`
```typescript
// Current: 1 year
expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),

// Change to 6 months:
expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
```

### Add Welcome Email:
Edit: `app/api/mpesa/callback/route.ts`
```typescript
// After subscription activated:
await sendWelcomeEmail(subscription.email);
```

---

## 🔒 Security Features:

✅ **Phone Number Validation** - Format checking (254XXXXXXXXX)
✅ **Email Validation** - Zod schema validation
✅ **Duplicate Prevention** - Can't subscribe same email twice
✅ **Payment Verification** - Callback from Safaricom only
✅ **Transaction Logging** - All payments tracked in database
✅ **Secure Tokens** - OAuth for M-Pesa API
✅ **HTTPS Only** - All endpoints require HTTPS

---

## 🆘 Troubleshooting:

### Issue: "Failed to initiate payment"
**Solution:**
- Check M-Pesa credentials in Vercel
- Verify MPESA_ENVIRONMENT is set correctly
- Check if Safaricom sandbox is operational

### Issue: "Invalid phone number"
**Solution:**
- Use Kenyan format: 0712345678 or +254712345678
- Phone must start with 07 or 01

### Issue: Payment successful but subscription not activated
**Solution:**
- Check callback URL is accessible: `/api/mpesa/callback`
- Check Vercel logs for callback errors
- Verify database connection

### Issue: STK Push not received on phone
**Solution:**
- In sandbox, use test number: 254708374149
- In production, verify phone has M-Pesa
- Check phone has network coverage

---

## 📞 Support:

**Safaricom Daraja Support:**
- Email: apisupport@safaricom.co.ke
- Portal: https://developer.safaricom.co.ke/support

**M-Pesa Business Support:**
- Call: 234 (from Safaricom)
- Email: business@safaricom.co.ke

---

## ✅ Go-Live Checklist:

Before switching to production:

- [ ] Get production M-Pesa credentials
- [ ] Register Paybill/Till number
- [ ] Whitelist callback URL with Safaricom
- [ ] Update environment variables to production
- [ ] Test with real phone number
- [ ] Set up welcome email sending
- [ ] Create admin dashboard for subscriptions
- [ ] Add unsubscribe functionality
- [ ] Set up email newsletter sending
- [ ] Monitor M-Pesa transactions
- [ ] Set up revenue tracking

---

**Status**: ✅ Sandbox Ready | ⏳ Production Pending Setup  
**Next Step**: Add M-Pesa credentials to test!
