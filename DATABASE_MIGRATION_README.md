# VeyraTech Database Migration Guide

## Overview
This guide explains how to add the latest database features to your VeyraTech application, including the new Invoice Management System and other enhancements.

---

## 📋 What's New

### Invoice Management System
Complete invoicing system with:
- Professional invoice generation with VeyraTech branding
- 16% VAT calculation (Kenya standard)
- Payment tracking (M-Pesa, Bank Transfer, etc.)
- Email delivery tracking
- Overdue invoice management
- Payment history
- Comprehensive reporting and analytics

---

## 🗂️ SQL Files

### 1. `add-all-latest-features.sql` ⭐ RECOMMENDED
**Use this file for production deployment**

Complete migration script that:
- Creates all invoice-related tables
- Adds necessary enums
- Creates indexes for performance
- Sets up triggers for automatic timestamps
- Adds useful functions and views
- Includes safety checks (IF NOT EXISTS)
- Works with existing databases

**Run this on your Supabase/PostgreSQL database:**

```sql
-- Copy the contents of add-all-latest-features.sql
-- and run it in your Supabase SQL Editor
```

### 2. `add-invoice-tables.sql`
Detailed version with:
- More comments and documentation
- Sample data examples (commented out)
- Additional maintenance queries
- Useful for understanding the schema

---

## 🚀 Quick Start

### Step 1: Backup Your Database
```sql
-- Always backup before migrations!
-- In Supabase: Settings > Database > Backups
```

### Step 2: Run the Migration

**Option A: Supabase Dashboard**
1. Open your Supabase project
2. Go to **SQL Editor**
3. Create a new query
4. Copy contents of `add-all-latest-features.sql`
5. Click **Run**
6. Wait for success message

**Option B: psql Command Line**
```bash
psql $DATABASE_URL -f add-all-latest-features.sql
```

**Option C: Prisma Migrate** (Recommended for development)
```bash
# The schema is already updated in prisma/schema.prisma
npx prisma db push
# or for production
npx prisma migrate deploy
```

### Step 3: Verify Installation

Run this query to verify all tables were created:

```sql
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name LIKE 'invoice%'
ORDER BY table_name;
```

Expected output:
```
table_name        | column_count
------------------+-------------
invoices          | 29
invoice_items     | 9
invoice_payments  | 12
invoice_history   | 10
```

---

## 📊 Database Schema

### Invoices Table
Main table storing invoice information:
- Client details (name, email, company, address, phone)
- Financial data (subtotal, VAT, total)
- Status tracking (DRAFT, SENT, VIEWED, PAID, OVERDUE, CANCELLED, REFUNDED)
- Payment information
- Email tracking (sent, viewed, reminders)
- Relations to leads, projects, and admins

### Invoice Items Table
Line items for each invoice:
- Description
- Quantity
- Unit price
- Total amount
- Display order

### Invoice Payments Table
Payment history:
- Amount paid
- Payment method (M-Pesa, Bank Transfer, Card, Cash, Other)
- Transaction details (M-Pesa receipt, bank reference)
- Payment date
- Notes

### Invoice History Table
Complete audit trail:
- All changes made to invoices
- Who made the change
- When it was made
- Previous and new values
- IP address and user agent

---

## 🔧 Useful Queries

### Get Invoice Statistics
```sql
-- All time statistics
SELECT * FROM get_invoice_statistics();

-- This month's statistics
SELECT * FROM get_invoice_statistics(
  DATE_TRUNC('month', CURRENT_DATE)::DATE,
  (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE
);
```

### View All Unpaid Invoices
```sql
SELECT 
  invoice_number,
  client_name,
  client_company,
  total_amount,
  currency,
  due_date,
  days_overdue,
  status
FROM invoice_summary
WHERE status IN ('SENT', 'VIEWED', 'OVERDUE')
  AND payment_status != 'COMPLETED'
ORDER BY due_date;
```

### Monthly Revenue Report
```sql
SELECT 
  TO_CHAR(month, 'Month YYYY') as month_name,
  invoice_count,
  TO_CHAR(total_invoiced, 'L999,999,999.99') as total_invoiced,
  TO_CHAR(total_paid, 'L999,999,999.99') as total_paid,
  TO_CHAR(total_overdue, 'L999,999,999.99') as total_overdue,
  ROUND((total_paid / NULLIF(total_invoiced, 0) * 100), 2) as collection_rate
FROM monthly_invoice_revenue
LIMIT 12;
```

### Mark Overdue Invoices
```sql
-- Run this daily (can be automated)
SELECT mark_overdue_invoices();
-- Returns: Number of invoices marked as overdue
```

### Find Invoices Needing Reminders
```sql
SELECT 
  invoice_number,
  client_name,
  client_email,
  total_amount,
  due_date,
  reminder_count
FROM invoice_summary
WHERE status IN ('SENT', 'VIEWED')
  AND payment_status != 'COMPLETED'
  AND due_date <= CURRENT_DATE + INTERVAL '3 days'
  AND (
    last_reminder_sent_at IS NULL 
    OR last_reminder_sent_at < CURRENT_DATE - INTERVAL '7 days'
  )
ORDER BY due_date;
```

---

## 🔐 Permissions

The migration script creates tables with default permissions. If using Row Level Security (RLS) in Supabase, add these policies:

```sql
-- Enable RLS on invoice tables
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_history ENABLE ROW LEVEL SECURITY;

-- Allow admins full access (adjust based on your auth setup)
CREATE POLICY "Admins can manage invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage invoice items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage payments"
  ON invoice_payments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view history"
  ON invoice_history FOR SELECT
  TO authenticated
  USING (true);
```

---

## 📈 Performance Considerations

The migration includes these optimizations:

1. **Indexes**: All foreign keys and commonly queried fields
2. **Triggers**: Automatic timestamp updates
3. **Views**: Pre-computed summaries for fast reporting
4. **Functions**: Efficient calculations without application logic
5. **Constraints**: Data validation at database level

---

## 🔄 Integration with Application

The invoice tables are already integrated with the application through:

1. **Prisma Schema**: Updated in `prisma/schema.prisma`
2. **API Routes**: 
   - `POST /api/admin/invoices/generate` - Generate and send invoices
3. **Admin UI**: 
   - `/admin/invoices` - Invoice creation interface
4. **Email Integration**: 
   - Automatic email sending with attachments
   - Tracking sent and viewed status

### Enable Database Persistence

To save generated invoices to database, update the API route:

```typescript
// app/api/admin/invoices/generate/route.ts

// After generating invoice, save to database:
const invoice = await prisma.invoice.create({
  data: {
    invoiceNumber: invoiceData.invoiceNumber,
    clientName: invoiceData.clientName,
    clientEmail: invoiceData.clientEmail,
    clientCompany: invoiceData.clientCompany,
    clientAddress: invoiceData.clientAddress,
    issueDate: invoiceData.date,
    dueDate: new Date(invoiceData.date.getTime() + 30 * 24 * 60 * 60 * 1000),
    subtotal: calculateSubtotal(invoiceData.items),
    vatRate: 16.00,
    vatAmount: calculateVAT(invoiceData.items),
    totalAmount: calculateTotal(invoiceData.items),
    currency: 'KSH',
    status: sendToClient ? 'SENT' : 'DRAFT',
    paymentStatus: 'PENDING',
    notes: invoiceData.notes,
    sentAt: sendToClient ? new Date() : null,
    items: {
      create: invoiceData.items.map((item, index) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        displayOrder: index,
      })),
    },
  },
  include: {
    items: true,
  },
});
```

---

## 🛠️ Maintenance Tasks

### Daily Tasks
```sql
-- Mark overdue invoices
SELECT mark_overdue_invoices();
```

### Weekly Tasks
```sql
-- Identify invoices needing reminders
SELECT COUNT(*) FROM invoice_summary
WHERE status IN ('SENT', 'VIEWED')
  AND due_date <= CURRENT_DATE + INTERVAL '7 days'
  AND payment_status != 'COMPLETED';
```

### Monthly Tasks
```sql
-- Generate revenue report
SELECT * FROM monthly_invoice_revenue LIMIT 12;

-- Check collection rate
SELECT 
  ROUND(
    SUM(CASE WHEN status = 'PAID' THEN total_amount ELSE 0 END) * 100.0 / 
    NULLIF(SUM(total_amount), 0),
    2
  ) as collection_rate_percentage
FROM invoices
WHERE issue_date >= DATE_TRUNC('month', CURRENT_DATE)::DATE;
```

---

## ⚠️ Troubleshooting

### Error: relation "invoices" already exists
**Solution**: The table already exists. Skip to verification step or use `DROP TABLE IF EXISTS invoices CASCADE;` to recreate (⚠️ will delete data).

### Error: type "invoice_status" already exists
**Solution**: The enum already exists. This is fine, script continues safely.

### Error: permission denied
**Solution**: Ensure you have SUPERUSER or database owner privileges. In Supabase, use the dashboard SQL editor which has proper permissions.

### Migration Hangs
**Solution**: There might be active transactions. Check with:
```sql
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

---

## 📝 Rollback

If you need to remove the invoice system:

```sql
-- WARNING: This will delete all invoice data!
DROP VIEW IF EXISTS monthly_invoice_revenue;
DROP VIEW IF EXISTS invoice_summary;
DROP FUNCTION IF EXISTS mark_overdue_invoices();
DROP FUNCTION IF EXISTS get_invoice_statistics(DATE, DATE);
DROP FUNCTION IF EXISTS calculate_invoice_totals(UUID);
DROP TABLE IF EXISTS invoice_history CASCADE;
DROP TABLE IF EXISTS invoice_payments CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TYPE IF EXISTS invoice_status;
DROP TYPE IF EXISTS payment_method;
```

---

## ✅ Verification Checklist

After migration, verify:

- [ ] All 4 invoice tables exist
- [ ] Enums created (invoice_status, payment_method)
- [ ] Indexes created (check with `\di invoice*` in psql)
- [ ] Views created (invoice_summary, monthly_invoice_revenue)
- [ ] Functions created (calculate_invoice_totals, get_invoice_statistics, mark_overdue_invoices)
- [ ] Triggers created (updated_at triggers)
- [ ] Can insert test invoice
- [ ] Can query invoice_summary view
- [ ] Prisma schema synced (`npx prisma generate`)

---

## 📞 Support

For issues or questions:
- **Email**: admin@veyratech.co.ke
- **Documentation**: See ADMIN_FEATURES.md
- **Schema Reference**: prisma/schema.prisma

---

## 🎉 Next Steps

After successful migration:

1. **Test invoice generation** in `/admin/invoices`
2. **Configure email settings** (RESEND_API_KEY)
3. **Set up daily cron** to mark overdue invoices
4. **Enable database persistence** (optional, see Integration section)
5. **Train admin users** on new invoice features
6. **Monitor invoice metrics** using provided queries

---

*Last Updated: December 2024*
*Migration Version: 1.0*
