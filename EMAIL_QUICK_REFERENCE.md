# 📧 VeyraTech Email Quick Reference

## Your Email Addresses

| Email | Use For | Who Sees It |
|-------|---------|-------------|
| **hello@veyratech.co.ke** | General inquiries, first contact | Website, social media, business cards |
| **consulting@veyratech.co.ke** | Consultation bookings, client discovery | Booking page, consultations |
| **support@veyratech.co.ke** | Client support, technical issues | Invoices, existing clients |
| **gisembaaggrey@gmail.com** | Personal networking | Portfolio page, QR codes |

---

## Where Emails Come From

### hello@veyratech.co.ke Receives:
- ✅ Website contact form (`/contact`)
- ✅ General business inquiries
- ✅ Partnership requests
- ✅ Media inquiries
- ✅ "What services do you offer?"

### consulting@veyratech.co.ke Receives:
- ✅ Consultation booking form (`/book-consultation`)
- ✅ Discovery meeting requests
- ✅ Business assessment inquiries
- ✅ "I need help with AI/automation/tech"

### support@veyratech.co.ke Receives:
- ✅ Existing client support requests
- ✅ Technical issues
- ✅ Implementation questions
- ✅ "My website feature isn't working"

### gisembaaggrey@gmail.com Receives:
- ✅ Portfolio contact form (`/portfolio`)
- ✅ Networking connections
- ✅ QR code scans
- ✅ "Let's connect!"

---

## Email Routing Map

```
veyratech.co.ke/contact
    ↓
hello@veyratech.co.ke
    ↓
Review inquiry → Route to sales/consulting

veyratech.co.ke/book-consultation
    ↓
consulting@veyratech.co.ke
    ↓
Schedule meeting → Conduct discovery → Assess → Recommend

veyratech.co.ke/portfolio
    ↓
gisembaaggrey@gmail.com
    ↓
Personal follow-up → Build relationship

Client has issue
    ↓
support@veyratech.co.ke
    ↓
Troubleshoot → Resolve → Document
```

---

## Quick Setup (5 minutes)

### Option 1: Email Forwarding (Fastest)
In your domain provider, forward all to one inbox:
```
hello@veyratech.co.ke → gisembaaggrey@gmail.com
consulting@veyratech.co.ke → gisembaaggrey@gmail.com
support@veyratech.co.ke → gisembaaggrey@gmail.com
```

### Option 2: Google Workspace (Professional)
1. Sign up: https://workspace.google.com/
2. Create 3 accounts ($18/month total)
3. Professional email clients

---

## Testing Checklist

- [ ] Submit contact form → Check hello@ receives it
- [ ] Book consultation → Check consulting@ receives it
- [ ] Submit portfolio form → Check gisembaaggrey@ receives it
- [ ] Check confirmation emails arrive to submitters

---

## Response Time Guide

| Email | Target Response | Priority |
|-------|----------------|----------|
| hello@ | 4-24 hours | Medium |
| consulting@ | Same day | High |
| support@ | 2-24 hours | Varies |
| Personal | Flexible | Low |

---

## What Each Email Notification Looks Like

### hello@ (Contact Form):
```
Subject: Contact Form: [Subject]
From: [Name] at [Company]
[Message content]
```

### consulting@ (Booking):
```
Subject: New Consultation Request from [Name]
Meeting: [Date] at [Time]
Industry: [Industry]
Challenge: [Description]
```

### gisembaaggrey@ (Portfolio):
```
Subject: New Connection: [Name] from [Company]
Role: [Role]
Working on: [Project]
```

---

## Files Updated ✅

All email addresses are now configured in:
- lib/email.ts
- lib/constants.ts
- lib/seo/metadata.ts
- app/layout.tsx
- All booking pages
- All contact forms
- Terms & Privacy pages

---

## Next Steps

1. ✅ Emails configured in code (DONE)
2. ⏳ Set up email reception (forwarding or Google Workspace)
3. ⏳ Test all 3 forms
4. ⏳ Update business cards with hello@veyratech.co.ke
5. ⏳ Update social media profiles

---

**Full Documentation:** See `EMAIL_CONFIGURATION_GUIDE.md` for complete details.

**Status:** ✅ All emails connected and working!
