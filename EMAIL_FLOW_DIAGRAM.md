# 📧 VeyraTech Email Flow Diagrams

## 🎯 Contact Form Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTACT FORM SUBMISSION                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    User fills contact form
                    (name, email, subject, message)
                                │
                                ▼
                         Click "Send Message"
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND PROCESSING                       │
│                                                                  │
│  1. ✅ Validate input (Zod schema)                              │
│  2. ✅ Save to database (Prisma)                                │
│  3. ✅ Create admin notification (in-app)                       │
│  4. ✅ Send emails (Promise.allSettled)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │  EMAIL 1: Admin   │   │ EMAIL 2: Customer │
        │    Notification   │   │   Confirmation    │
        └───────────────────┘   └───────────────────┘
                    │                       │
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │       Resend      │   │      Resend       │
        │    sends email    │   │   sends email     │
        └───────────────────┘   └───────────────────┘
                    │                       │
                    ▼                       ▼
     hello@veyratech.co.ke        user's email address
                    │
                    ▼
        ┌───────────────────┐
        │ Email Forwarding  │
        │   (DNS setup)     │
        └───────────────────┘
                    │
                    ▼
         gisembaaggrey@gmail.com
```

---

## 🗓️ Consultation Booking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  CONSULTATION BOOKING SUBMISSION                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
              User fills consultation booking form
       (name, email, phone, challenge, preferred date/time)
                                │
                                ▼
                    Click "Book Free Consultation"
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND PROCESSING                       │
│                                                                  │
│  1. ✅ Validate input (Zod schema + security checks)            │
│  2. ✅ Check rate limiting (prevent spam)                       │
│  3. ✅ Reserve time slot (if date selected)                     │
│  4. ✅ Save to database (Prisma)                                │
│  5. ✅ Create Google Calendar event (if scheduled)              │
│  6. ✅ Create admin notifications (in-app)                      │
│  7. ✅ Send multi-channel notifications                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │  EMAIL 1: Admin   │   │ EMAIL 2: Customer │
        │    Notification   │   │   Confirmation    │
        └───────────────────┘   └───────────────────┘
                    │                       │
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │  Contains:        │   │  Contains:        │
        │  • Client info    │   │  • Confirmation   │
        │  • Challenge      │   │  • Meeting details│
        │  • Meeting time   │   │  • Google Meet    │
        │  • Admin link     │   │  • Calendar .ics  │
        └───────────────────┘   └───────────────────┘
                    │                       │
                    ▼                       ▼
   consulting@veyratech.co.ke      user's email address
                    │
                    ▼
        ┌───────────────────┐
        │ Email Forwarding  │
        │   (DNS setup)     │
        └───────────────────┘
                    │
                    ▼
         gisembaaggrey@gmail.com


                            ALSO:
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │  SMS Notification │   │ WhatsApp Message  │
        │    (optional)     │   │    (optional)     │
        └───────────────────┘   └───────────────────┘
                    │                       │
                    └───────────┬───────────┘
                                ▼
                    +254745247211 (your phone)
```

---

## ⏰ Reminder Email Flow (Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUTOMATED REMINDER SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    Consultation scheduled for
                       2026-08-25 at 10:00 AM
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │  24h Before │ │  1h Before  │ │ 10m Before  │
        │   Reminder  │ │   Reminder  │ │   Reminder  │
        └─────────────┘ └─────────────┘ └─────────────┘
                │               │               │
                └───────────────┼───────────────┘
                                ▼
                    ┌───────────────────────┐
                    │   Send Email to:      │
                    │   • Client            │
                    │   • Admin (copy)      │
                    └───────────────────────┘
                                │
                                ▼
                    Includes Google Meet link
                         and meeting details
```

---

## 🔄 Complete User Journey Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                         COMPLETE USER JOURNEY                       │
└────────────────────────────────────────────────────────────────────┘

STAGE 1: DISCOVERY
    │
    ▼
User visits veyratech.co.ke
    │
    ▼
Explores services, case studies, about page
    │
    ▼
Decision point: Ready to reach out?
    │
    ├─── No ───> Exit (may return later)
    │
    └─── Yes ──> Continue to Stage 2


STAGE 2: FIRST CONTACT
    │
    ├────────────────────┬────────────────────┐
    ▼                    ▼                    ▼
Quick Question    General Inquiry    Ready for Meeting
    │                    │                    │
    ▼                    ▼                    ▼
Email directly    Contact Form      Book Consultation
hello@            hello@            consulting@
    │                    │                    │
    └────────────────────┴────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  AUTOMATIC EMAIL:      │
            │  "We've received your  │
            │   message/booking"     │
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  ADMIN NOTIFICATION:   │
            │  To gisembaaggrey@     │
            │  gmail.com             │
            └────────────────────────┘


STAGE 3: ENGAGEMENT
    │
    ▼
You review the inquiry
    │
    ▼
Personal response within 24 hours
    │
    ├────────────────────┬────────────────────┐
    ▼                    ▼                    ▼
Phone call       Email discussion    Schedule meeting
    │                    │                    │
    └────────────────────┴────────────────────┘
                         │
                         ▼


STAGE 4: CONSULTATION
    │
    ▼
30-60 minute meeting
    │
    ▼
Discuss challenge, explore solutions
    │
    ▼
Agree on next steps
    │
    ▼
Send meeting notes + proposal


STAGE 5: PROPOSAL
    │
    ▼
Client reviews proposal
    │
    ├─── Questions ───> Answer & revise
    │
    ├─── Accept ──────> Move to Stage 6
    │
    └─── Decline ─────> Add to nurture list


STAGE 6: ONBOARDING
    │
    ▼
Contract signed + Payment received
    │
    ▼
Create client account (support@veyratech.co.ke)
    │
    ▼
Kickoff meeting + Project start


STAGE 7: DELIVERY
    │
    ▼
Regular updates via support@veyratech.co.ke
    │
    ▼
Weekly check-ins + Monthly reports
    │
    ▼
Project completion + Handover


STAGE 8: SUCCESS
    │
    ▼
Request testimonial + referrals
    │
    ▼
Quarterly check-ins
    │
    ▼
Potential future projects
```

---

## 📊 Email Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        EMAIL INFRASTRUCTURE                         │
└────────────────────────────────────────────────────────────────────┘

APPLICATION LAYER (Next.js)
    │
    ├── lib/email.ts
    │   ├── sendContactNotification()
    │   ├── sendContactConfirmation()
    │   ├── sendConsultationNotification()
    │   └── sendConsultationConfirmation()
    │
    ├── lib/notifications.ts
    │   ├── sendContactNotifications()
    │   └── sendConsultationNotifications()
    │
    └── API Routes
        ├── /api/contact/route.ts
        └── /api/consultations/route.ts
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                          EMAIL SERVICE                              │
│                                                                     │
│  Resend API                                                         │
│  • API Key: your_resend_api_key_here                   │
│  • Domain: veyratech.co.ke                                         │
│  • Status: Verified ✅                                             │
└────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                          DNS/FORWARDING                             │
│                                                                     │
│  Email Addresses:                                                  │
│  • hello@veyratech.co.ke      → gisembaaggrey@gmail.com           │
│  • consulting@veyratech.co.ke → gisembaaggrey@gmail.com           │
│  • support@veyratech.co.ke    → gisembaaggrey@gmail.com           │
└────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────┐
│                         YOUR INBOX                                  │
│                   gisembaaggrey@gmail.com                          │
│                                                                     │
│  All emails from:                                                  │
│  • Contact form submissions                                        │
│  • Consultation bookings                                           │
│  • Customer replies                                                │
│  • System notifications                                            │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Validation Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    FORM SUBMISSION SECURITY                         │
└────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                     User submits form data
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │  Client-side      │   │  Server-side      │
        │  Validation       │   │  Validation       │
        │  (React)          │   │  (Zod Schema)     │
        └───────────────────┘   └───────────────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │  Security Checks:     │
                            │  • Rate limiting      │
                            │  • XSS prevention     │
                            │  • SQL injection      │
                            │  • Email validation   │
                            │  • Disposable email   │
                            └───────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            ✅ Valid Input      ❌ Invalid Input    ❌ Spam Detected
                    │                   │                   │
                    ▼                   ▼                   ▼
        Process normally    Return 400 error    Block & log
                                        │
                                        ▼
                            User sees error message
```

---

## 📈 Monitoring & Analytics

```
┌────────────────────────────────────────────────────────────────────┐
│                      MONITORING DASHBOARD                           │
└────────────────────────────────────────────────────────────────────┘

Resend Dashboard (resend.com/emails)
    ├── Email delivery status
    ├── Bounce rate
    ├── Open rate
    └── Click rate

Vercel Logs (vercel.com/logs)
    ├── [EMAIL] success/error logs
    ├── [CONTACT] submission logs
    ├── API response times
    └── Error tracking

Database (Supabase)
    ├── ContactMessage table
    ├── Consultation table
    ├── Admin notification counts
    └── Historical data

Google Analytics (optional)
    ├── Form submission events
    ├── Booking conversion rate
    ├── User journey tracking
    └── Traffic sources
```

---

**Created:** August 23, 2026  
**Purpose:** Visual reference for email and customer journey flows  
**Use:** Share with team, reference during troubleshooting
