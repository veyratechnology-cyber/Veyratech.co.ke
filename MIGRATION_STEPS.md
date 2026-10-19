# Database Migration Steps - Multi-Step Booking & Payment

## Problem Fixed ✅
- **Issue**: Type mismatch between Prisma schema (`String`) and PostgreSQL (`UUID`)
- **Solution**: Updated Prisma schema to use `@db.Uuid` for all ID fields that reference UUID columns in PostgreSQL

## Files Updated
1. `prisma/schema.prisma` - Added `@db.Uuid` to `Consultation.id`, `Invoice.id`, `invoiceId`, and `consultationId`
2. `DATABASE_SCHEMA_UPDATE.sql` - Uses `UUID` type for foreign key columns

---

## Step 1: Run Database Migration in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `DATABASE_SCHEMA_UPDATE.sql`
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. Verify success message

Expected output:
```
ALTER TABLE
ALTER TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

---

## Step 2: Generate Prisma Client

Open your terminal and run:

```powershell
npx prisma generate
```

Expected output:
```
✔ Generated Prisma Client (5.x.x) to .\node_modules\@prisma\client in XXms
```

---

## Step 3: Verify Database Schema (Optional)

To verify the migration worked:

1. In Supabase SQL Editor, run:
```sql
-- Check consultations table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'consultations'
AND column_name IN ('package_id', 'quoted_amount', 'payment_status', 'invoice_id');

-- Check invoices table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'invoices'
AND column_name = 'consultation_id';
```

You should see:
- `package_id` → `character varying` (nullable)
- `quoted_amount` → `numeric` (nullable)
- `payment_status` → `character varying` (not null)
- `invoice_id` → `uuid` (nullable)
- `consultation_id` → `uuid` (nullable)

---

## Step 4: Deploy to Vercel

```powershell
# Stage files
git add .

# Commit
git commit -m "feat: multi-step booking with payment integration

- Add 6-step booking wizard with package selection
- Integrate M-Pesa STK Push payment
- Add Google Meet/Phone/In-Person meeting scheduling
- Auto-generate invoices on booking
- Send email notifications
- Update Prisma schema to match PostgreSQL UUID types"

# Push to trigger deployment
git push
```

---

## Step 5: Test the Booking Flow

1. **Visit pricing page**: `/pricing`
2. **Click a booking CTA** (should include `?package=xxx` in URL)
3. **Complete the 6-step wizard**:
   - Step 1: Package Selection (pre-filled from URL)
   - Step 2: Personal Information
   - Step 3: Business Needs
   - Step 4: Meeting Schedule (Google Meet/Phone/In-Person)
   - Step 5: Payment Method (M-Pesa/Bank Transfer/Invoice)
   - Step 6: Confirmation
4. **Verify**:
   - Invoice created in database
   - Consultation created with payment status
   - Email sent to client
   - If M-Pesa: STK Push initiated (sandbox mode)

---

## Environment Variables Needed

Make sure these are set in Vercel:

```env
# Database
DATABASE_URL=your_supabase_connection_string

# M-Pesa (Currently using sandbox)
MPESA_CONSUMER_KEY=your_sandbox_consumer_key
MPESA_CONSUMER_SECRET=your_sandbox_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_sandbox_passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback

# Google Calendar (Optional - for auto-scheduling)
GOOGLE_CALENDAR_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
GOOGLE_CALENDAR_REFRESH_TOKEN=your_refresh_token

# Email
RESEND_API_KEY=your_resend_api_key
```

---

## Troubleshooting

### Migration fails with "relation already exists"
- The `IF NOT EXISTS` clauses should prevent this
- If it still fails, the columns may already exist from a previous attempt
- Check existing columns with:
```sql
\d+ consultations
\d+ invoices
```

### Prisma generate fails
- Delete `node_modules/.prisma` folder
- Run `npx prisma generate` again

### Type errors in TypeScript after changes
- Run `npm run build` to check for type errors
- May need to update API route types to handle `@db.Uuid` strings

---

## Next Steps After Deployment

1. **Test M-Pesa integration** with real credentials (production):
   - Get production credentials from Safaricom Daraja
   - Update environment variables
   - Test with small amount (e.g., KSH 1)

2. **Set up Google Calendar integration** (optional):
   - Follow Google OAuth setup
   - Get refresh token
   - Update environment variables

3. **Monitor invoice generation**:
   - Check Supabase database for created invoices
   - Verify invoice numbers are unique
   - Check payment status updates

4. **Email deliverability**:
   - Verify emails are being sent
   - Check spam folders
   - Consider adding SPF/DKIM records

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs (Database → Logs)
3. Check browser console for client-side errors
4. Verify all environment variables are set
