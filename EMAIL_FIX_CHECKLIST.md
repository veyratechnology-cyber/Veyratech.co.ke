# ✅ Email Fix Checklist - Do These 3 Things

## 🚨 Why Emails Aren't Working

**Problem:** `RESEND_API_KEY` is empty → No email service connected

---

## ✅ Step 1: Get Resend API Key (5 min)

### 1.1 Sign Up
- [ ] Go to: **https://resend.com/signup**
- [ ] Create account with your email
- [ ] Verify email

### 1.2 Add Domain
- [ ] Dashboard → **Domains** → **Add Domain**
- [ ] Enter: **veyratech.co.ke**
- [ ] Copy DNS records shown

### 1.3 Update DNS
Go to your domain provider and add:

```
Record 1:
Type: TXT
Name: resend._domainkey
Value: [paste from Resend]

Record 2:
Type: TXT
Name: _resend  
Value: [paste from Resend]
```

### 1.4 Verify Domain
- [ ] Wait 5-30 minutes
- [ ] Click "Verify Domain" in Resend
- [ ] Should show **"Verified ✅"**

### 1.5 Create API Key
- [ ] Dashboard → **API Keys** → **Create API Key**
- [ ] Name: "VeyraTech Production"
- [ ] **Copy the key** (starts with `re_...`)
- [ ] Save it somewhere safe!

```
Your API Key: re_________________________
```

---

## ✅ Step 2: Update Vercel (3 min)

### 2.1 Open Vercel
- [ ] Go to: **https://vercel.com**
- [ ] Open your VeyraTech project
- [ ] **Settings** → **Environment Variables**

### 2.2 Update These 3 Variables

**Variable 1:**
```
Name: RESEND_API_KEY
Value: re_________________________
       (paste your API key from Step 1.5)
```

**Variable 2:**
```
Name: EMAIL_FROM
Value: VeyraTech <noreply@veyratech.co.ke>
```

**Variable 3:**
```
Name: ADMIN_EMAIL  
Value: hello@veyratech.co.ke
```

### 2.3 Redeploy
- [ ] **Deployments** tab
- [ ] Click latest deployment → **Redeploy**
- [ ] Wait ~2 minutes for deployment

---

## ✅ Step 3: Set Up Email Forwarding (5 min)

### 3.1 Open Domain Provider
- [ ] Go to your domain control panel (Hostinger/Namecheap/etc)
- [ ] Find **Email** or **Email Forwarding** section

### 3.2 Create 3 Forwards

**Forward 1:**
```
From: hello@veyratech.co.ke
To: gisembaaggrey@gmail.com
```

**Forward 2:**
```
From: consulting@veyratech.co.ke
To: gisembaaggrey@gmail.com
```

**Forward 3:**
```
From: support@veyratech.co.ke
To: gisembaaggrey@gmail.com
```

- [ ] Save all forwards
- [ ] Verify they're **Active**

---

## 🧪 Step 4: Test (2 min)

### Test 1: Contact Form
- [ ] Go to: **https://veyratech.co.ke/contact**
- [ ] Fill form with YOUR email
- [ ] Click Submit
- [ ] Wait 1 minute
- [ ] Check **gisembaaggrey@gmail.com** for notification ✉️
- [ ] Check your email for confirmation ✉️

### Test 2: Consultation Form
- [ ] Go to: **https://veyratech.co.ke/book-consultation**
- [ ] Fill form and pick time
- [ ] Click Submit
- [ ] Check **gisembaaggrey@gmail.com** for notification ✉️

### Test 3: Check Resend
- [ ] Go to: **https://resend.com/emails**
- [ ] Should see emails with **"Delivered"** status ✅

---

## ❓ If Emails Still Don't Arrive

### Check Spam Folder
- [ ] Open **gisembaaggrey@gmail.com**
- [ ] Check **Spam** folder
- [ ] If found → Mark as **"Not Spam"**

### Check Resend Logs
- [ ] **https://resend.com/emails**
- [ ] Look for error messages
- [ ] Status should be **"Delivered"**

### Check Vercel Logs
- [ ] Vercel → Your Project → **Logs**
- [ ] Look for errors about email

---

## 🎯 Quick Reference

**Resend Sign Up:** https://resend.com/signup  
**Vercel Dashboard:** https://vercel.com  
**Check Resend Logs:** https://resend.com/emails  

**Test Contact:** https://veyratech.co.ke/contact  
**Test Booking:** https://veyratech.co.ke/book-consultation  
**Test Portfolio:** https://veyratech.co.ke/portfolio  

---

## ✅ Done?

When all checkboxes are ✅, emails will work!

**Current Status:**
- ✅ Code is correct (already deployed)
- ⏳ Need Resend API key
- ⏳ Need Vercel environment variables updated
- ⏳ Need email forwarding set up

**Total Time:** ~15 minutes  
**Total Cost:** $0 (Free tier is enough)

---

**Start with Step 1:** Get your Resend API key! 🚀
