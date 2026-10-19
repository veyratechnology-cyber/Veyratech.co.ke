# 📱 VeyraTech Multi-Step Booking Flow

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRICING PAGE (/pricing)                       │
│                                                                  │
│  [Consultation] [AI Solutions] [Support]  ← Category Tabs       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Starter    │  │Comprehensive │  │  Enterprise  │         │
│  │  KSH 15,000  │  │  KSH 45,000  │  │  KSH 150,000 │         │
│  │              │  │              │  │              │         │
│  │ [Book Now]   │  │ [Book Now]   │  │ [Book Now]   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Clicks "Book Now"
                               ↓ (with ?package=consultation-starter)
┌─────────────────────────────────────────────────────────────────┐
│           BOOKING PAGE - STEP 1/6: PACKAGE SELECTION             │
│                                                                  │
│  ● ─────── ○ ─────── ○ ─────── ○ ─────── ○ ─────── ○          │
│  Package  Personal  Business  Schedule  Payment  Confirm        │
│                                                                  │
│  [Consultation] [AI Solutions] [Support]  ← Select Category     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ ✓ SELECTED   │  │              │  │              │         │
│  │   Starter    │  │Comprehensive │  │  Enterprise  │         │
│  │ KSH 15,000   │  │  KSH 45,000  │  │  KSH 150,000 │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  [Back]                                          [Continue →]   │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Click Continue
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│           STEP 2/6: YOUR INFORMATION                             │
│                                                                  │
│  ● ────── ● ─────── ○ ─────── ○ ─────── ○ ─────── ○          │
│  Package  Personal  Business  Schedule  Payment  Confirm        │
│                                                                  │
│  Full Name: [                    ] *                            │
│  Email:     [                    ] *                            │
│  Phone:     [                    ] *                            │
│  Company:   [                    ]                              │
│  Job Title: [                    ]                              │
│                                                                  │
│  [← Back]                                        [Continue →]   │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Form validated ✓
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│           STEP 3/6: BUSINESS NEEDS                               │
│                                                                  │
│  ● ────── ● ─────── ● ─────── ○ ─────── ○ ─────── ○          │
│  Package  Personal  Business  Schedule  Payment  Confirm        │
│                                                                  │
│  Industry: [Select...          ▼]                               │
│                                                                  │
│  Areas of Interest (optional):                                  │
│  [AI Adoption] [Automation] [Strategy] [Other...]               │
│                                                                  │
│  Your Main Challenge: *                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Describe your business challenge...                     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [← Back]                                        [Continue →]   │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│           STEP 4/6: SCHEDULE MEETING                             │
│                                                                  │
│  ● ────── ● ─────── ● ─────── ● ─────── ○ ─────── ○          │
│  Package  Personal  Business  Schedule  Payment  Confirm        │
│                                                                  │
│  Meeting Format:                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ ✓ SELECTED   │  │              │  │              │         │
│  │   📹 Video   │  │   📞 Phone   │  │   🏢 Office  │         │
│  │ Google Meet  │  │  Phone Call  │  │  In-Person   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  Preferred Date: [2026-08-25    ▼] *                           │
│  Preferred Time: [10:00         ▼] *                           │
│                                                                  │
│  📅 Flexible: We'll find the best available slot               │
│                                                                  │
│  [← Back]                                        [Continue →]   │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│           STEP 5/6: PAYMENT & REVIEW                             │
│                                                                  │
│  ● ────── ● ─────── ● ─────── ● ─────── ● ─────── ○          │
│  Package  Personal  Business  Schedule  Payment  Confirm        │
│                                                                  │
│  ┌─────────────────────── BOOKING SUMMARY ──────────────────┐  │
│  │ Package:     Consultation - Starter                       │  │
│  │ Meeting:     Google Meet                                  │  │
│  │ Date & Time: Aug 25, 2026, 10:00 AM                      │  │
│  │                                                           │  │
│  │ Subtotal:         KSH 12,931.03                          │  │
│  │ VAT (16%):        KSH  2,068.97                          │  │
│  │ ─────────────────────────────────                        │  │
│  │ TOTAL:            KSH 15,000.00                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Payment Method: *                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ✓ 📱 M-Pesa - Pay instantly with STK Push              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   🏦 Bank Transfer - Details in invoice                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   📄 Invoice Later - Pay within 30 days                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  M-Pesa Phone: [+254 712 345 678] *                            │
│                                                                  │
│  🔒 Secure payment - You'll receive an STK push prompt         │
│                                                                  │
│  [← Back]                              [Complete Booking ✓]    │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Click "Complete Booking"
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSING                            │
│                                                                  │
│  1. ✅ Create Invoice (INV-202608-1234)                         │
│  2. ✅ Create Consultation Record                               │
│  3. ✅ Link Invoice ↔ Consultation                              │
│  4. ✅ Reserve Time Slot                                        │
│  5. ✅ Create Google Calendar Event                             │
│  6. ✅ Initiate M-Pesa STK Push                                 │
│  7. ✅ Send Confirmation Emails                                 │
│  8. ✅ Create Admin Notification                                │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│           STEP 6/6: CONFIRMATION                                 │
│                                                                  │
│  ● ────── ● ─────── ● ─────── ● ─────── ● ─────── ●          │
│  Package  Personal  Business  Schedule  Payment  Confirm        │
│                                                                  │
│                        ✅                                        │
│                                                                  │
│              Booking Confirmed!                                 │
│                                                                  │
│      Thank you for booking with VeyraTech                       │
│      Confirmation email sent shortly                            │
│                                                                  │
│            ⏳ Redirecting...                                     │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Auto-redirect after 2 seconds
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│              SUCCESS PAGE (/book-consultation/success)           │
│                                                                  │
│                        ✅                                        │
│            Consultation Confirmed!                              │
│                                                                  │
│  ┌───────────────────── YOUR DETAILS ─────────────────────┐    │
│  │ Name:     John Doe                                     │    │
│  │ Company:  ABC Corp                                     │    │
│  │ Email:    john@abc.com                                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────── MEETING SCHEDULE ───────────────────┐    │
│  │ 📅 Monday, August 25, 2026                            │    │
│  │ 🕐 10:00 AM EAT                                       │    │
│  │ ⏱️  Duration: 60 minutes                              │    │
│  │                                                        │    │
│  │ 📹 Google Meet                                        │    │
│  │ [Join Meeting →]                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────── WHAT HAPPENS NEXT ──────────────────┐    │
│  │ 1. Confirmation email with details                     │    │
│  │ 2. Calendar invite                                     │    │
│  │ 3. Reminders (24h, 1h before)                         │    │
│  │ 4. Consultation discussion                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Questions? consulting@veyratech.co.ke | +254 745 247 211      │
│                                                                  │
│  [Return to Homepage]  [Read Our Insights →]                   │
└─────────────────────────────────────────────────────────────────┘


                    MEANWHILE (ASYNC)...

┌─────────────────────────────────────────────────────────────────┐
│              M-PESA PAYMENT FLOW (IF SELECTED)                   │
└─────────────────────────────────────────────────────────────────┘

User's Phone:
  ↓
┌──────────────────────┐
│  📱 M-PESA PROMPT   │
│                      │
│  Pay KSH 15,000     │
│  to VeyraTech?      │
│                      │
│  [Enter PIN]        │
│                      │
│  [Pay] [Cancel]     │
└──────────────────────┘
         │
         │ User enters PIN and confirms
         ↓
┌─────────────────────────────────────────────────────────────────┐
│           SAFARICOM DARAJA API                                   │
│           Processes payment...                                   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ Payment successful
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│           CALLBACK TO: /api/mpesa/callback                       │
│                                                                  │
│  Received:                                                      │
│  - CheckoutRequestID: ws_CO_123456789                          │
│  - ResultCode: 0 (SUCCESS)                                     │
│  - Amount: 15000                                                │
│  - MpesaReceiptNumber: QBR7X8Y9Z0                              │
│  - PhoneNumber: 254712345678                                    │
│                                                                  │
│  Processing:                                                    │
│  1. ✅ Find consultation by CheckoutRequestID                   │
│  2. ✅ Create InvoicePayment record                             │
│  3. ✅ Update Invoice: status = PAID                            │
│  4. ✅ Update Consultation: paymentStatus = PAID                │
│  5. ✅ Create InvoiceHistory entry                              │
│  6. ✅ Send payment confirmation email (TODO)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Result: Invoice marked PAID, booking confirmed!
```

---

## 🎨 Visual Progress Indicator

```
STEP 1:  ●━━━━━━○━━━━━━○━━━━━━○━━━━━━○━━━━━━○
         📦     👤     💼     📅     💳     ✅
       Package Personal Business Schedule Payment Confirm

STEP 2:  ●━━━━━━●━━━━━━○━━━━━━○━━━━━━○━━━━━━○
         📦     👤     💼     📅     💳     ✅
       Package Personal Business Schedule Payment Confirm

STEP 5:  ●━━━━━━●━━━━━━●━━━━━━●━━━━━━●━━━━━━○
         📦     👤     💼     📅     💳     ✅
       Package Personal Business Schedule Payment Confirm

STEP 6:  ●━━━━━━●━━━━━━●━━━━━━●━━━━━━●━━━━━━●
         ✅     ✅     ✅     ✅     ✅     ✅
       Package Personal Business Schedule Payment Confirm
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Pricing   │
│   Page      │
│             │
│  packages.ts│
└──────┬──────┘
       │
       │ package=consultation-starter
       ↓
┌─────────────────────────────────────────────────────────┐
│  Multi-Step Booking Form (Client-Side)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  LocalStorage (Auto-Save Progress)              │   │
│  │  {                                               │   │
│  │    formData: {...},                             │   │
│  │    step: 3,                                      │   │
│  │    timestamp: 1724419200000                     │   │
│  │  }                                               │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ POST formData
                         ↓
┌─────────────────────────────────────────────────────────┐
│  API: /api/consultations/book-with-payment              │
│                                                          │
│  1. Validate Input (Zod)                                │
│  2. Generate Invoice                                     │
│  3. Create Consultation                                  │
│  4. Link Invoice ↔ Consultation                         │
│  5. Reserve Time Slot                                    │
│  6. Create Google Calendar Event                         │
│  7. Initiate M-Pesa (if selected)                       │
│  8. Send Emails                                          │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ↓               ↓               ↓
    ┌─────────┐    ┌─────────┐    ┌──────────┐
    │Database │    │  Email  │    │  M-Pesa  │
    │ Prisma  │    │ Resend  │    │  Daraja  │
    └─────────┘    └─────────┘    └────┬─────┘
         │               │               │
         │               │               │ Callback
         │               │               ↓
         │               │        ┌──────────────┐
         │               │        │ /api/mpesa/  │
         │               │        │  callback    │
         │               │        └──────┬───────┘
         │               │               │
         └───────────────┴───────────────┘
                         │
                         ↓
              Payment Status Updated
```

---

## 🗂️ Database Relationships

```
┌─────────────────────────┐
│   CONSULTATION          │
│─────────────────────────│
│ id                      │
│ name                    │
│ email                   │
│ packageId         ────┐ │
│ quotedAmount          │ │
│ paymentStatus         │ │
│ invoiceId         ────┼─┼──┐
│ actualScheduledAt     │ │  │
│ googleCalendarEventId │ │  │
└───────────────────────┘ │  │
                          │  │
                          │  │ Foreign Key
                          │  │
                          │  ↓
                          │ ┌─────────────────────────┐
                          │ │   INVOICE               │
                          │ │─────────────────────────│
                          │ │ id                      │
                          │ │ invoiceNumber           │
                          │ │ consultationId      ────┘
                          │ │ clientName              │
                          │ │ totalAmount             │
                          │ │ paymentStatus           │
                          │ │ status                  │
                          │ └───────┬─────────────────┘
                          │         │
                          │         │ 1:Many
                          │         ↓
                          │ ┌─────────────────────────┐
                          │ │   INVOICE_ITEM          │
                          │ │─────────────────────────│
                          │ │ id                      │
                          │ │ invoiceId               │
                          │ │ description             │
                          │ │ quantity                │
                          │ │ unitPrice               │
                          │ │ total                   │
                          │ └─────────────────────────┘
                          │
                          │ 1:Many
                          ↓
┌─────────────────────────┐
│   PRICING_PACKAGE       │
│─────────────────────────│
│ id (e.g., consultation- │
│         starter)        │
│ name                    │
│ price                   │
│ category                │
└─────────────────────────┘

(Defined in code, not database)
```

---

## 📧 Email Flow

```
Booking Submitted
      │
      ├──→ [Client Email]
      │    Subject: Consultation Confirmed!
      │    Content:
      │    - Booking details
      │    - Meeting info (date, time, type)
      │    - Google Meet link (if applicable)
      │    - What to expect
      │    - Contact information
      │
      └──→ [Admin Email] (hello@veyratech.co.ke)
           Subject: New Consultation Booking
           Content:
           - Client information
           - Package selected
           - Amount: KSH 15,000
           - Payment method
           - Meeting schedule
           - Link to admin panel

M-Pesa Payment Success
      │
      └──→ [Client Email] (TODO: Create template)
           Subject: Payment Received - KSH 15,000
           Content:
           - Payment confirmation
           - M-Pesa receipt number
           - Invoice attached (PDF)
           - Receipt attached
```

---

## 🔄 State Transitions

### Payment Status Flow:

```
  PENDING  (Initial state after booking)
     │
     ├─→ [M-Pesa] → PROCESSING (STK Push sent)
     │                  │
     │                  ├─→ PAID (Payment successful)
     │                  └─→ FAILED (User cancelled/insufficient funds)
     │
     ├─→ [Bank Transfer] → PENDING (awaiting payment)
     │                          │
     │                          └─→ PAID (Admin confirms)
     │
     └─→ [Invoice Later] → PENDING (30-day terms)
                               │
                               └─→ PAID (Payment received)
```

### Booking Status Flow:

```
  NEW (Created)
    │
    ├─→ SCHEDULED (Time slot confirmed)
    │      │
    │      ├─→ COMPLETED (Consultation done)
    │      └─→ NO_SHOW (Client didn't attend)
    │
    └─→ CANCELLED (Client or admin cancelled)
```

---

**Created:** August 23, 2026  
**For:** VeyraTech Multi-Step Booking Implementation  
**Purpose:** Visual guide for developers and stakeholders
