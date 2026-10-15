# Portfolio Networking System - Complete Setup Guide

## 📧 Email Configuration

### Current Setup:
- **Your Email**: `gisembaaggrey@gmail.com`
- **Email Service**: Resend (already configured)
- **Status**: ✅ Working - You'll receive all networking connections here

### What Happens:
1. Someone fills the portfolio form
2. You get an email at `gisembaaggrey@gmail.com` with:
   - Their name, email, phone
   - Company they work for
   - Their role/position
   - What they're building/working on
3. They get a confirmation email immediately

---

## 📱 WhatsApp Notifications Setup

### Option 1: WhatsApp Business API (Recommended for Scale)
**Best for**: High volume connections, automated workflows

**Services to Use:**
1. **Twilio WhatsApp API**
   - URL: https://www.twilio.com/whatsapp
   - Cost: ~$0.005 per message
   - Setup time: 30 minutes
   
2. **MessageBird**
   - URL: https://www.messagebird.com/whatsapp-business-api
   - Cost: Pay per message
   - Setup time: 20 minutes

3. **Africa's Talking** (Local)
   - URL: https://africastalking.com/whatsapp
   - Best for Kenya-based businesses
   - Setup time: 15 minutes

#### Twilio Setup Steps:
```bash
# 1. Install Twilio SDK
npm install twilio

# 2. Add to .env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+254745247211
```

#### Code to Add (in portfolio-contact/route.ts):
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send WhatsApp notification
await client.messages.create({
  from: process.env.TWILIO_WHATSAPP_FROM,
  to: process.env.TWILIO_WHATSAPP_TO,
  body: `🤝 New Connection!

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${role ? `Role: ${role}` : ''}
${building ? `Working on: ${building}` : ''}

Reply within 24hrs!`
});
```

---

### Option 2: Zapier/Make.com (No Code - Quick Setup)
**Best for**: Quick start, no coding needed

#### Zapier Setup (5 minutes):
1. Go to https://zapier.com
2. Create new Zap:
   - **Trigger**: Webhook (Catch Hook)
   - **Action**: WhatsApp (Send Message via Twilio)
3. Get Webhook URL from Zapier
4. Add to portfolio API

#### Code Update:
```typescript
// In portfolio-contact/route.ts, after email sends:

await fetch('YOUR_ZAPIER_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name, email, phone, company, role, building,
    timestamp: new Date().toISOString()
  })
});
```

---

### Option 3: WhatsApp Link (Free - Manual)
**Best for**: Low volume, manual checking

Create a WhatsApp notification link that opens automatically:
```
https://wa.me/254745247211?text=New%20Portfolio%20Connection:%20Check%20email
```

No code changes needed - you'll just get the email.

---

## 🎯 Follow-Up System Based on Context

### Email Templates for Different Scenarios:

#### For Developers/Tech Roles:
```
Subject: Great connecting, [Name]!

Hi [Name],

Thanks for connecting at [event]. Saw you're working on [their project] 
at [company] - that sounds exciting!

I'd love to hear more about the challenges you're facing with [their tech]. 
At VeyraTech, we've helped similar companies with [relevant solution].

Quick 15-min call this week?

Best,
Aggrey
```

#### For Business Owners/Founders:
```
Subject: Building something great at [Company]

Hi [Name],

Loved connecting with you! Building [their project] is no small feat.

As someone who's been through the startup journey with VeyraTech, 
I know the challenges of [relevant challenge for their role].

Would you be open to a quick chat about your tech strategy?

Best,
Aggrey
```

#### For Students/Learners:
```
Subject: Great energy, [Name]!

Hi [Name],

Really enjoyed our conversation! Your enthusiasm about [what they're 
working on] is contagious.

If you ever want to chat about getting into tech, AI, or 
entrepreneurship, I'm always happy to help.

Let's stay connected!

Best,
Aggrey
```

---

## 📊 CRM Integration (Recommended)

### Free Options:

#### 1. Google Sheets Auto-Logger
**Cost**: Free
**Setup**: 10 minutes

Add to your API:
```typescript
// Google Sheets integration
const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK;

await fetch(GOOGLE_SHEET_URL, {
  method: 'POST',
  body: JSON.stringify({
    timestamp: new Date().toISOString(),
    name, email, phone, company, role, building,
    status: 'New',
    followedUp: 'No'
  })
});
```

**Benefits**:
- Track all connections in one place
- Filter by company, role, or project
- Mark follow-up status
- Export for analysis

#### 2. Notion Database
**Cost**: Free
**Setup**: 15 minutes

Create a Notion page with columns:
- Name
- Email
- Phone
- Company
- Role
- Working On
- Connected Date
- Follow-up Status
- Notes

Use Notion API to auto-add entries.

#### 3. Airtable
**Cost**: Free (up to 1,200 records)
**Setup**: 10 minutes

Similar to Notion but with better automation.

---

## 🔄 Automated Follow-Up System

### Using Resend + Cron Job:

Create `app/api/cron/portfolio-followup/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend-client";

export async function GET(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Query database for connections needing follow-up
  // (You'd store these in Supabase/database)
  
  // Send personalized follow-ups based on their info
  
  return NextResponse.json({ success: true });
}
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/portfolio-followup",
    "schedule": "0 9 * * *"
  }]
}
```

---

## 📝 Quick Setup Checklist

### Immediate (Already Done):
- [x] Email to gisembaaggrey@gmail.com
- [x] Confirmation email to contacts
- [x] Beautiful email templates
- [x] Contact details collected

### Next Steps (Choose Your Path):

#### Minimal Setup (5 minutes):
1. ✅ Current system working
2. Just check `gisembaaggrey@gmail.com`
3. Follow up manually

#### Basic Setup (30 minutes):
1. Sign up for Twilio ($20 credit)
2. Enable WhatsApp sandbox
3. Add Twilio to `.env`
4. Deploy code update
5. Test with your phone

#### Advanced Setup (2 hours):
1. Set up Twilio/WhatsApp
2. Create Google Sheet logger
3. Build follow-up templates
4. Set up automated reminders

---

## 🚀 Recommended: Quick Start Guide

### For You (Right Now):

1. **Email Setup**: ✅ Already done
   - Check `gisembaaggrey@gmail.com`
   - All connections come here

2. **WhatsApp (15 minutes)**:
   ```bash
   # Sign up: https://www.twilio.com/try-twilio
   # Get $15 free credit
   # Enable WhatsApp sandbox
   # Add to Vercel environment variables:
   TWILIO_ACCOUNT_SID=xxx
   TWILIO_AUTH_TOKEN=xxx
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   TWILIO_WHATSAPP_TO=whatsapp:+254745247211
   ```

3. **Google Sheet Tracker** (10 minutes):
   - Create sheet: "Portfolio Connections"
   - Columns: Date, Name, Email, Company, Role, Project, Status
   - Manually add for now
   - Later: automate with Zapier

4. **Follow-Up Template** (5 minutes):
   - Save email templates above
   - Customize with their info
   - Send within 24 hours

---

## 📞 Support Contact

If you need help setting up:
- WhatsApp Business API
- CRM integration
- Automated follow-ups
- Custom email templates

Just let me know which features you want enabled!

---

## Current Status

✅ **Working Now:**
- Portfolio form at veyratech.co.ke/portfolio
- Email notifications to gisembaaggrey@gmail.com
- Auto-reply emails to contacts
- All networking fields captured

⏳ **Ready to Enable:**
- WhatsApp notifications (needs Twilio)
- Database logging (needs setup choice)
- Automated follow-ups (needs templates)

---

Let me know which features you want to enable and I'll help set them up!
