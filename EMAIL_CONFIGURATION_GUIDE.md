# 📧 VeyraTech Email Configuration Guide

Complete guide to VeyraTech's email system and how everything is connected.

---

## 📬 Email Addresses Overview

VeyraTech uses **specialized email addresses** for different purposes:

| Email Address | Purpose | Receives From | Example Use |
|---------------|---------|---------------|-------------|
| **hello@veyratech.co.ke** | General inquiries & first contact | Website contact form, social media, business cards | "What services does VeyraTech provide?" |
| **consulting@veyratech.co.ke** | Consultation bookings & client engagements | Consultation booking page | "I want to discuss AI strategy for my business" |
| **support@veyratech.co.ke** | Existing client support | Client requests, technical issues | "My website feature isn't working" |
| **gisembaaggrey@gmail.com** | Personal portfolio connections | Portfolio page (veyratech.co.ke/portfolio) | Networking event contacts |
| **noreply@veyratech.co.ke** | System sender (no replies) | Automated confirmations, notifications | Confirmation emails |

---

## 🔌 Where Each Email is Used

### 1. hello@veyratech.co.ke (General Inquiries)

**Purpose:** Public front door for VeyraTech

**Connected to:**
- ✅ Main website contact form (`/contact`)
- ✅ Social media profiles
- ✅ Business cards and marketing materials
- ✅ Terms of Service page
- ✅ Privacy Policy page
- ✅ Schema.org structured data (SEO)
- ✅ Error messages fallback

**Files configured:**
```
lib/email.ts → ADMIN_EMAIL = "hello@veyratech.co.ke"
lib/constants.ts → email: "hello@veyratech.co.ke"
lib/seo/metadata.ts → email: 'hello@veyratech.co.ke'
app/layout.tsx → email: 'hello@veyratech.co.ke'
app/(public)/terms/page.tsx
app/(public)/privacy/page.tsx
app/api/contact/route.ts
```

**Email Flow:**
```
User fills contact form → POST /api/contact
  ↓
Saves to database (contacts table)
  ↓
Sends 2 emails:
  1. To hello@veyratech.co.ke (notification)
  2. To user (confirmation)
```

**What you receive:**
```
Subject: Contact Form: [Their Subject]

From: [Name]
Email: [Their Email]
Company: [Their Company]
Phone: [Their Phone]
Subject: [Their Subject]
Message: [Their Message]

[Reply Button]
```

---

### 2. consulting@veyratech.co.ke (Consultation Bookings)

**Purpose:** Manage consultation requests and client engagements

**Connected to:**
- ✅ Consultation booking page (`/book-consultation`)
- ✅ Consultation success page
- ✅ Meeting scheduling system
- ✅ Client discovery and assessment
- ✅ Advisory engagement coordination

**Files configured:**
```
lib/email.ts → CONSULTING_EMAIL = "consulting@veyratech.co.ke"
lib/email.ts → sendConsultationNotification() sends to CONSULTING_EMAIL
app/(public)/book-consultation/page.tsx (mailto link)
app/(public)/book-consultation/success/page.tsx (contact info)
```

**Email Flow:**
```
User books consultation → POST /api/book-consultation
  ↓
Saves to database (consultations table)
  ↓
Sends 2 emails:
  1. To consulting@veyratech.co.ke (notification with details)
  2. To user (confirmation with meeting details)
```

**What you receive:**
```
Subject: 🔔 New Consultation Request from [Name]

Contact Information:
- Name: [Name]
- Email: [Email]
- Company: [Company]
- Phone: [Phone]

Industry: [Industry]

Scheduled Meeting:
- Date: [Date]
- Time: [Time] EAT

Business Challenge:
[Their description of what they need help with]

[View Consultation Details Button]
```

**Consultation Workflow:**
1. Request arrives at consulting@veyratech.co.ke
2. Review business challenge and context
3. Conduct discovery meeting
4. Assess where technology can help
5. Prepare recommendations
6. Present findings
7. Sales team handles proposal (if needed)
8. Consulting manages advisory engagement

---

### 3. support@veyratech.co.ke (Client Support)

**Purpose:** Support existing clients after purchase

**Connected to:**
- ✅ Invoice footers
- ✅ Client portal (when built)
- ✅ Post-purchase communications
- ✅ Technical issue reporting
- ✅ Implementation questions

**Files configured:**
```
lib/invoices/generator.ts → Email: support@veyratech.co.ke
lib/email/resend-client.ts → supportEmail: 'support@veyratech.co.ke'
```

**What you handle:**
- Technical problems
- Website/system issues
- Change requests (within agreement)
- Implementation questions
- Service updates
- Troubleshooting

**Response Time Guidelines:**
- Critical issues: 2-4 hours
- High priority: Same business day
- Normal: 24 hours
- Low priority: 48 hours

**Rule:** Distinguish work covered by existing agreement from new work requiring quotation.

---

### 4. gisembaaggrey@gmail.com (Personal Portfolio)

**Purpose:** Networking and personal connections

**Connected to:**
- ✅ Portfolio page (`/portfolio`)
- ✅ Portfolio contact form
- ✅ vCard downloads
- ✅ Personal networking

**Files configured:**
```
app/api/portfolio-contact/route.ts → to: "gisembaaggrey@gmail.com"
app/portfolio/page.tsx (navigation, social links, direct contact)
```

**Email Flow:**
```
User submits portfolio form → POST /api/portfolio-contact
  ↓
Sends 2 emails:
  1. To gisembaaggrey@gmail.com (connection details)
  2. To user (confirmation)
```

**What you receive:**
```
Subject: 🤝 New Connection: [Name] from [Company]

Name: [Name]
Email: [Email]
Phone: [Phone]
Company: [Company]
Role: [Role]
What they're working on: [Project/Business]

💡 Follow-up tip: [Context-based suggestion]
```

---

### 5. noreply@veyratech.co.ke (System Sender)

**Purpose:** Send automated emails (no replies expected)

**Connected to:**
- ✅ All outgoing emails (FROM field)
- ✅ Confirmations
- ✅ Notifications
- ✅ Reminders

**Files configured:**
```
lib/email.ts → FROM_EMAIL = "VeyraTech <noreply@veyratech.co.ke>"
lib/email/resend-client.ts → from: 'VeyraTech <noreply@veyratech.co.ke>'
app/api/portfolio-contact/route.ts
```

**Note:** This email should NOT receive replies. All emails set a REPLY-TO header pointing to the appropriate address.

---

## 🔐 Environment Variables

### Required Variables:

```env
# Resend API Key (Required for all emails)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email Configuration (Optional - defaults shown)
EMAIL_FROM="VeyraTech <noreply@veyratech.co.ke>"
ADMIN_EMAIL="hello@veyratech.co.ke"
```

### Where to Set (Production):
1. Go to vercel.com → Your project
2. Settings → Environment Variables
3. Add/Update these variables
4. Redeploy for changes to take effect

### Where to Set (Development):
```bash
# Create .env.local file in project root
echo 'RESEND_API_KEY=re_your_key_here' >> .env.local
echo 'EMAIL_FROM="VeyraTech <noreply@veyratech.co.ke>"' >> .env.local
echo 'ADMIN_EMAIL="hello@veyratech.co.ke"' >> .env.local
```

---

## 📊 Email Routing Table

Complete routing for all website forms:

| Form/Page | API Endpoint | Notification To | Purpose |
|-----------|--------------|-----------------|---------|
| Contact Form | `/api/contact` | hello@veyratech.co.ke | General inquiries |
| Book Consultation | `/api/book-consultation` | consulting@veyratech.co.ke | Consultation requests |
| Portfolio Contact | `/api/portfolio-contact` | gisembaaggrey@gmail.com | Networking connections |
| (Future) Support Form | `/api/support` | support@veyratech.co.ke | Client support tickets |

---

## 🔧 Email Setup in Resend

### Step 1: Domain Verification

**In Resend Dashboard:**
1. Go to Domains → Add Domain
2. Enter: `veyratech.co.ke`
3. Copy DNS records provided

**In Your Domain Provider (Hostinger/Namecheap/etc):**
1. Add TXT records for verification
2. Add MX records (if receiving)
3. Add SPF, DKIM, DMARC records
4. Wait 24-48 hours for propagation

**DNS Records Needed:**
```
Type: TXT
Name: _resend
Value: [Provided by Resend]

Type: MX
Name: @
Value: mx.resend.com
Priority: 10

Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@veyratech.co.ke
```

### Step 2: Email Address Setup

**In Resend:**
1. Create API key
2. Copy to environment variables

**Email addresses work automatically** - no need to "create" them in Resend. Once domain is verified, you can send from any `@veyratech.co.ke` address.

**To Receive Emails:**
You need an email provider (Google Workspace, Microsoft 365, or email hosting from your domain provider).

---

## 📮 Setting Up Email Reception

### Option 1: Google Workspace (Recommended)

**Pros:**
- Professional
- Great spam filtering
- Team collaboration
- Mobile apps
- Reliable

**Cost:** $6/user/month

**Setup:**
1. Sign up: https://workspace.google.com/
2. Verify domain ownership
3. Create email addresses:
   - hello@veyratech.co.ke
   - consulting@veyratech.co.ke
   - support@veyratech.co.ke
4. Update MX records to Google's
5. Configure SPF/DKIM/DMARC

### Option 2: Email Forwarding (Quick & Free)

**Setup in Domain Provider:**
1. Go to Email Forwarding settings
2. Create forwards:
   ```
   hello@veyratech.co.ke → gisembaaggrey@gmail.com
   consulting@veyratech.co.ke → gisembaaggrey@gmail.com
   support@veyratech.co.ke → gisembaaggrey@gmail.com
   ```
3. Test each forward

**Pros:**
- Free
- Quick setup
- All emails go to one place

**Cons:**
- Can't reply FROM @veyratech.co.ke
- No professional email client
- May end up in spam

### Option 3: Microsoft 365

Similar to Google Workspace
**Cost:** $6/user/month

### Option 4: Domain Email Hosting

Most domain providers offer email hosting:
- Hostinger: ~$1/month
- Namecheap: ~$1/month
- Others

---

## 🧪 Testing Email Setup

### Test 1: Send Test Email (Backend)

```bash
# From project root
node -e "
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

resend.emails.send({
  from: 'VeyraTech <noreply@veyratech.co.ke>',
  to: 'gisembaaggrey@gmail.com',
  subject: 'Test Email from VeyraTech',
  html: '<h1>It works!</h1><p>Email system is configured correctly.</p>'
}).then(console.log).catch(console.error);
"
```

### Test 2: Contact Form (Frontend)

1. Go to https://veyratech.co.ke/contact
2. Fill out form
3. Submit
4. Check hello@veyratech.co.ke for notification
5. Check your email for confirmation

### Test 3: Consultation Booking

1. Go to https://veyratech.co.ke/book-consultation
2. Fill out form and pick a time
3. Submit
4. Check consulting@veyratech.co.ke for notification
5. Check your email for confirmation

### Test 4: Portfolio Contact

1. Go to https://veyratech.co.ke/portfolio
2. Fill out networking form
3. Submit
4. Check gisembaaggrey@gmail.com for notification
5. Check your email for confirmation

---

## 🚨 Troubleshooting

### Emails Not Sending

**Check 1: API Key**
```bash
# Verify environment variable exists
echo $RESEND_API_KEY  # Linux/Mac
echo %RESEND_API_KEY%  # Windows CMD
$env:RESEND_API_KEY   # Windows PowerShell
```

**Check 2: Resend Dashboard**
1. Go to resend.com
2. Logs → Check for errors
3. Look for bounces or blocks

**Check 3: Domain Verification**
1. Resend → Domains
2. Verify domain shows "Verified"
3. Check DNS records are correct

### Emails Going to Spam

**Solutions:**
1. ✅ Add DKIM records
2. ✅ Add SPF records
3. ✅ Add DMARC records
4. ✅ Verify domain in Resend
5. ✅ Ask recipients to add to contacts
6. ✅ Don't use spam trigger words
7. ✅ Include unsubscribe link (if bulk)

### Emails Not Receiving

**Check 1: Email Forwarding**
- Verify forwards are set up correctly
- Test by sending email directly to @veyratech.co.ke

**Check 2: MX Records**
- Use mxtoolbox.com to check MX records
- Verify they point to correct mail server

**Check 3: Spam Folder**
- Check spam in receiving inbox
- Mark as "Not Spam"

---

## 📈 Email Analytics

### Track in Resend Dashboard:
- Emails sent
- Delivery rate
- Open rate (if enabled)
- Click rate
- Bounce rate
- Complaints

### Track in Your App:
- Contact form submissions
- Consultation bookings
- Portfolio connections
- Support tickets

### Recommended Metrics:
- **Response Time:** How fast you reply
- **Resolution Time:** Time to solve issue
- **Satisfaction:** Follow-up survey
- **Conversion:** Inquiries → Clients

---

## 📝 Email Templates

All email templates are in:
```
lib/email.ts
lib/email/resend-client.ts
```

**Available Templates:**
1. `sendConsultationConfirmation()` - Booking confirmation
2. `sendConsultationNotification()` - Internal notification
3. `sendContactNotification()` - Contact form notification
4. `sendContactConfirmation()` - Contact confirmation
5. `sendMeetingReminder()` - Meeting reminders
6. Portfolio contact emails (in portfolio API)

---

## 🎯 Best Practices

### Response Times:
- **hello@** → 4-24 hours (business inquiries)
- **consulting@** → Same day (booked consultations)
- **support@** → 2-24 hours (based on priority)
- **Personal (gmail)** → Flexible (networking)

### Email Etiquette:
- ✅ Reply within stated time
- ✅ Professional tone
- ✅ Clear subject lines
- ✅ Include next steps
- ✅ Signature with contact info

### Organization:
- Use labels/folders for each email
- Set up filters/rules
- Archive after handling
- Keep templates for common responses

---

## 🔄 Migration Checklist

Everything is now configured! Here's what was updated:

### ✅ Completed Updates:

**Email Configuration Files:**
- [x] `lib/email.ts` → Updated all email constants
- [x] `lib/email/resend-client.ts` → Updated EMAIL_CONFIG
- [x] `lib/constants.ts` → hello@veyratech.co.ke
- [x] `lib/seo/metadata.ts` → hello@veyratech.co.ke
- [x] `lib/invoices/generator.ts` → support@veyratech.co.ke

**Page Updates:**
- [x] `app/layout.tsx` → Schema.org email
- [x] `app/(public)/terms/page.tsx` → hello@
- [x] `app/(public)/privacy/page.tsx` → hello@
- [x] `app/(public)/book-consultation/page.tsx` → consulting@
- [x] `app/(public)/book-consultation/success/page.tsx` → consulting@

**API Routes:**
- [x] `app/api/contact/route.ts` → Error messages to hello@
- [x] Consultation notifications → consulting@veyratech.co.ke
- [x] Contact notifications → hello@veyratech.co.ke
- [x] Portfolio notifications → gisembaaggrey@gmail.com

### 🚀 What You Need to Do:

1. **Set up email reception** (choose option above)
2. **Update environment variables** in Vercel (if needed)
3. **Test all forms** (contact, consultation, portfolio)
4. **Update social media** with hello@veyratech.co.ke
5. **Update business cards** with hello@veyratech.co.ke
6. **Configure email client** (Gmail/Outlook filters)

---

## 📞 Summary

Your VeyraTech email system is now properly configured:

| Email | Purpose | Status |
|-------|---------|--------|
| hello@veyratech.co.ke | General inquiries | ✅ Connected |
| consulting@veyratech.co.ke | Consultation bookings | ✅ Connected |
| support@veyratech.co.ke | Client support | ✅ Connected |
| gisembaaggrey@gmail.com | Personal networking | ✅ Connected |
| noreply@veyratech.co.ke | System sender | ✅ Connected |

**All website forms are properly routed!**

**Next Step:** Set up email reception (Google Workspace or forwarding) and test all forms.

---

*Last Updated: August 23, 2026*  
*Email Configuration v2.0*
