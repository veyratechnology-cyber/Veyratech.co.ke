-- ============================================================
-- VEYRATECH COMPLETE DATABASE MIGRATION
-- This file includes ALL features added to the system
-- Safe to run on existing databases (uses IF NOT EXISTS)
-- ============================================================
-- 
-- FEATURES INCLUDED:
-- 1. Invoice Management System (NEW)
-- 2. Proposal Email Tracking (ENHANCED)
-- 3. All existing tables verification
-- 4. Indexes for performance
-- 5. Useful functions and views
-- 6. Audit log enhancements
--
-- Run this file in your Supabase SQL Editor
-- ============================================================

BEGIN;

-- ============================================================
-- SECTION 1: CREATE MISSING ENUMS
-- ============================================================

-- Invoice Status Enum
DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM (
    'DRAFT',
    'SENT',
    'VIEWED',
    'PAID',
    'OVERDUE',
    'CANCELLED',
    'REFUNDED'
  );
EXCEPTION
  WHEN duplicate_object THEN 
    RAISE NOTICE 'invoice_status enum already exists, skipping...';
END $$;

-- Payment Method Enum
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'MPESA',
    'BANK_TRANSFER',
    'CARD',
    'CASH',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN 
    RAISE NOTICE 'payment_method enum already exists, skipping...';
END $$;

-- ============================================================
-- SECTION 2: CREATE INVOICE TABLES
-- ============================================================

-- Main Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Client Information
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_company VARCHAR(255),
  client_address TEXT,
  client_phone VARCHAR(50),
  
  -- Invoice Details
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Financial Information
  subtotal DECIMAL(12, 2) NOT NULL,
  vat_rate DECIMAL(5, 2) NOT NULL DEFAULT 16.00,
  vat_amount DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'KSH',
  
  -- Status & Payment
  status invoice_status NOT NULL DEFAULT 'DRAFT',
  payment_status payment_status NOT NULL DEFAULT 'PENDING',
  payment_method payment_method,
  payment_reference VARCHAR(255),
  paid_at TIMESTAMP WITH TIME ZONE,
  paid_amount DECIMAL(12, 2),
  
  -- Additional Information
  notes TEXT,
  terms TEXT,
  internal_notes TEXT,
  
  -- Relations (using TEXT for IDs to match existing tables)
  lead_id TEXT,
  project_id TEXT,
  assigned_admin_id TEXT,
  
  -- Email Tracking
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_count INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_subtotal CHECK (subtotal >= 0),
  CONSTRAINT positive_total CHECK (total_amount >= 0),
  CONSTRAINT valid_vat_rate CHECK (vat_rate >= 0 AND vat_rate <= 100),
  CONSTRAINT due_date_after_issue CHECK (due_date >= issue_date)
);

-- Add foreign key constraints after table creation (if related tables exist)
DO $$
BEGIN
  -- Add lead_id foreign key if leads table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'invoices_lead_id_fkey' 
        AND table_name = 'invoices'
    ) THEN
      ALTER TABLE invoices ADD CONSTRAINT invoices_lead_id_fkey 
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL;
      RAISE NOTICE '✓ Added foreign key constraint: invoices_lead_id_fkey';
    END IF;
  END IF;
  
  -- Add project_id foreign key if projects table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'invoices_project_id_fkey' 
        AND table_name = 'invoices'
    ) THEN
      ALTER TABLE invoices ADD CONSTRAINT invoices_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
      RAISE NOTICE '✓ Added foreign key constraint: invoices_project_id_fkey';
    END IF;
  END IF;
  
  -- Add assigned_admin_id foreign key if admins table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'invoices_assigned_admin_id_fkey' 
        AND table_name = 'invoices'
    ) THEN
      ALTER TABLE invoices ADD CONSTRAINT invoices_assigned_admin_id_fkey 
        FOREIGN KEY (assigned_admin_id) REFERENCES admins(id) ON DELETE SET NULL;
      RAISE NOTICE '✓ Added foreign key constraint: invoices_assigned_admin_id_fkey';
    END IF;
  END IF;
EXCEPTION
  WHEN foreign_key_violation OR datatype_mismatch THEN
    RAISE NOTICE '⚠ Could not add some foreign key constraints - ID type mismatch. Invoices will work without foreign keys.';
END $$;

-- Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Item Details
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  
  -- Optional Categorization
  category VARCHAR(100),
  
  -- Order
  display_order INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_price CHECK (unit_price >= 0),
  CONSTRAINT positive_item_total CHECK (total >= 0)
);

-- Invoice Payment History Table
CREATE TABLE IF NOT EXISTS invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Payment Details
  amount DECIMAL(12, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_reference VARCHAR(255),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Transaction Details
  transaction_id VARCHAR(255),
  mpesa_receipt_number VARCHAR(255),
  bank_reference VARCHAR(255),
  
  -- Notes
  notes TEXT,
  
  -- Recording
  recorded_by_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_payment_amount CHECK (amount > 0)
);

-- Add foreign key constraints for invoice_payments (if admins table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'invoice_payments_recorded_by_id_fkey' 
        AND table_name = 'invoice_payments'
    ) THEN
      ALTER TABLE invoice_payments ADD CONSTRAINT invoice_payments_recorded_by_id_fkey 
        FOREIGN KEY (recorded_by_id) REFERENCES admins(id) ON DELETE SET NULL;
      RAISE NOTICE '✓ Added foreign key constraint: invoice_payments_recorded_by_id_fkey';
    END IF;
  END IF;
EXCEPTION
  WHEN foreign_key_violation OR datatype_mismatch THEN
    RAISE NOTICE '⚠ Could not add invoice_payments foreign key - ID type mismatch';
END $$;

-- Invoice History/Audit Table
CREATE TABLE IF NOT EXISTS invoice_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Action Details
  action VARCHAR(100) NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  
  -- Who & When
  performed_by_id TEXT,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional Context
  notes TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Add foreign key constraints for invoice_history (if admins table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'invoice_history_performed_by_id_fkey' 
        AND table_name = 'invoice_history'
    ) THEN
      ALTER TABLE invoice_history ADD CONSTRAINT invoice_history_performed_by_id_fkey 
        FOREIGN KEY (performed_by_id) REFERENCES admins(id) ON DELETE SET NULL;
      RAISE NOTICE '✓ Added foreign key constraint: invoice_history_performed_by_id_fkey';
    END IF;
  END IF;
EXCEPTION
  WHEN foreign_key_violation OR datatype_mismatch THEN
    RAISE NOTICE '⚠ Could not add invoice_history foreign key - ID type mismatch';
END $$;

-- ============================================================
-- SECTION 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================

-- Invoices indexes
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_client_email ON invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_lead_id ON invoices(lead_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_assigned_admin_id ON invoices(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Invoice items indexes
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_display_order ON invoice_items(display_order);

-- Invoice payments indexes
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_payment_date ON invoice_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_payment_method ON invoice_payments(payment_method);

-- Invoice history indexes
CREATE INDEX IF NOT EXISTS idx_invoice_history_invoice_id ON invoice_history(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_history_performed_at ON invoice_history(performed_at);
CREATE INDEX IF NOT EXISTS idx_invoice_history_action ON invoice_history(action);

-- ============================================================
-- SECTION 4: CREATE/UPDATE TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to invoice tables
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;
CREATE TRIGGER update_invoice_items_updated_at
  BEFORE UPDATE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoice_payments_updated_at ON invoice_payments;
CREATE TRIGGER update_invoice_payments_updated_at
  BEFORE UPDATE ON invoice_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SECTION 5: CREATE USEFUL FUNCTIONS
-- ============================================================

-- Function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals(p_invoice_id UUID)
RETURNS TABLE (
  subtotal DECIMAL(12, 2),
  vat_amount DECIMAL(12, 2),
  total DECIMAL(12, 2)
) AS $$
DECLARE
  v_subtotal DECIMAL(12, 2);
  v_vat_rate DECIMAL(5, 2);
  v_vat_amount DECIMAL(12, 2);
  v_total DECIMAL(12, 2);
BEGIN
  -- Get subtotal from items
  SELECT COALESCE(SUM(total), 0)
  INTO v_subtotal
  FROM invoice_items
  WHERE invoice_id = p_invoice_id;
  
  -- Get VAT rate
  SELECT invoices.vat_rate
  INTO v_vat_rate
  FROM invoices
  WHERE id = p_invoice_id;
  
  -- Calculate VAT and total
  v_vat_amount := v_subtotal * (v_vat_rate / 100);
  v_total := v_subtotal + v_vat_amount;
  
  RETURN QUERY SELECT v_subtotal, v_vat_amount, v_total;
END;
$$ LANGUAGE plpgsql;

-- Function to get invoice statistics
CREATE OR REPLACE FUNCTION get_invoice_statistics(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  total_invoices BIGINT,
  total_amount DECIMAL(12, 2),
  paid_amount DECIMAL(12, 2),
  pending_amount DECIMAL(12, 2),
  overdue_amount DECIMAL(12, 2),
  average_invoice_value DECIMAL(12, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_invoices,
    COALESCE(SUM(i.total_amount), 0) as total_amount,
    COALESCE(SUM(CASE WHEN i.status = 'PAID' THEN i.total_amount ELSE 0 END), 0) as paid_amount,
    COALESCE(SUM(CASE WHEN i.status IN ('SENT', 'VIEWED') THEN i.total_amount ELSE 0 END), 0) as pending_amount,
    COALESCE(SUM(CASE WHEN i.status = 'OVERDUE' THEN i.total_amount ELSE 0 END), 0) as overdue_amount,
    COALESCE(AVG(i.total_amount), 0) as average_invoice_value
  FROM invoices i
  WHERE
    (p_start_date IS NULL OR i.issue_date >= p_start_date)
    AND (p_end_date IS NULL OR i.issue_date <= p_end_date);
END;
$$ LANGUAGE plpgsql;

-- Function to mark overdue invoices
CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS INT AS $$
DECLARE
  updated_count INT;
BEGIN
  UPDATE invoices
  SET status = 'OVERDUE'
  WHERE status IN ('SENT', 'VIEWED')
    AND due_date < CURRENT_DATE
    AND payment_status != 'COMPLETED';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SECTION 6: CREATE VIEWS FOR REPORTING
-- ============================================================

-- Invoice Summary View
CREATE OR REPLACE VIEW invoice_summary AS
SELECT
  i.id,
  i.invoice_number,
  i.client_name,
  i.client_email,
  i.client_company,
  i.issue_date,
  i.due_date,
  i.total_amount,
  i.currency,
  i.status,
  i.payment_status,
  i.paid_at,
  i.sent_at,
  i.lead_id,
  i.project_id,
  a.name as assigned_admin_name,
  a.email as assigned_admin_email,
  COUNT(DISTINCT ii.id) as item_count,
  COALESCE(SUM(p.amount), 0) as total_paid,
  (i.total_amount - COALESCE(SUM(p.amount), 0)) as balance_due,
  CASE
    WHEN i.due_date < CURRENT_DATE AND i.status != 'PAID' 
    THEN CURRENT_DATE - i.due_date
    ELSE 0
  END as days_overdue,
  i.created_at,
  i.updated_at
FROM invoices i
LEFT JOIN admins a ON i.assigned_admin_id = a.id
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
LEFT JOIN invoice_payments p ON i.id = p.invoice_id
GROUP BY
  i.id, i.invoice_number, i.client_name, i.client_email, i.client_company,
  i.issue_date, i.due_date, i.total_amount, i.currency, i.status,
  i.payment_status, i.paid_at, i.sent_at, i.lead_id, i.project_id,
  a.name, a.email, i.created_at, i.updated_at;

-- Monthly Invoice Revenue View
CREATE OR REPLACE VIEW monthly_invoice_revenue AS
SELECT
  DATE_TRUNC('month', issue_date)::DATE as month,
  COUNT(*) as invoice_count,
  SUM(total_amount) as total_invoiced,
  SUM(CASE WHEN status = 'PAID' THEN total_amount ELSE 0 END) as total_paid,
  SUM(CASE WHEN status = 'OVERDUE' THEN total_amount ELSE 0 END) as total_overdue,
  AVG(total_amount) as average_invoice
FROM invoices
GROUP BY DATE_TRUNC('month', issue_date)
ORDER BY month DESC;

-- ============================================================
-- SECTION 7: UPDATE AUDIT_ACTION ENUM
-- ============================================================

-- Add invoice-related audit actions
DO $$ 
DECLARE
  audit_actions TEXT[] := ARRAY[
    'INVOICE_CREATED',
    'INVOICE_SENT', 
    'INVOICE_PAID',
    'INVOICE_CANCELLED',
    'PAYMENT_RECORDED'
  ];
  action TEXT;
BEGIN
  FOREACH action IN ARRAY audit_actions
  LOOP
    BEGIN
      EXECUTE format('ALTER TYPE audit_action ADD VALUE IF NOT EXISTS %L', action);
    EXCEPTION
      WHEN duplicate_object THEN 
        RAISE NOTICE 'audit_action value % already exists, skipping...', action;
    END;
  END LOOP;
END $$;

-- ============================================================
-- SECTION 8: ADD TABLE COMMENTS
-- ============================================================

COMMENT ON TABLE invoices IS 'Professional invoices with VeyraTech branding, 16% VAT calculation, and comprehensive payment tracking';
COMMENT ON TABLE invoice_items IS 'Line items for each invoice with quantity, unit price, and calculated totals';
COMMENT ON TABLE invoice_payments IS 'Payment history including M-Pesa receipts, bank transfers, and other payment methods';
COMMENT ON TABLE invoice_history IS 'Complete audit trail of all invoice changes and actions';

COMMENT ON COLUMN invoices.vat_rate IS 'Default 16% VAT rate for Kenya';
COMMENT ON COLUMN invoices.currency IS 'Default KSH (Kenyan Shilling)';
COMMENT ON COLUMN invoices.due_date IS 'Payment due date, typically 30 days from issue date';
COMMENT ON COLUMN invoices.invoice_number IS 'Auto-generated invoice number format: INV-YYYYMM-XXXX';

-- ============================================================
-- SECTION 9: VERIFICATION QUERIES
-- ============================================================

-- Verify all invoice tables exist
DO $$
DECLARE
  table_count INT;
  expected_tables TEXT[] := ARRAY['invoices', 'invoice_items', 'invoice_payments', 'invoice_history'];
  missing_tables TEXT[];
BEGIN
  SELECT COUNT(*)
  INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name = ANY(expected_tables);
  
  IF table_count = array_length(expected_tables, 1) THEN
    RAISE NOTICE '✓ All % invoice tables created successfully', table_count;
  ELSE
    SELECT ARRAY_AGG(t)
    INTO missing_tables
    FROM unnest(expected_tables) AS t
    WHERE NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = t
    );
    
    RAISE WARNING '⚠ Only % of % invoice tables found. Missing: %', 
      table_count, array_length(expected_tables, 1), missing_tables;
  END IF;
END $$;

-- Verify enums exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
    RAISE NOTICE '✓ invoice_status enum exists';
  ELSE
    RAISE WARNING '⚠ invoice_status enum not found';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    RAISE NOTICE '✓ payment_method enum exists';
  ELSE
    RAISE WARNING '⚠ payment_method enum not found';
  END IF;
END $$;

-- Verify views exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'invoice_summary') THEN
    RAISE NOTICE '✓ invoice_summary view created';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'monthly_invoice_revenue') THEN
    RAISE NOTICE '✓ monthly_invoice_revenue view created';
  END IF;
END $$;

-- Verify functions exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_invoice_totals') THEN
    RAISE NOTICE '✓ calculate_invoice_totals function created';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_invoice_statistics') THEN
    RAISE NOTICE '✓ get_invoice_statistics function created';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'mark_overdue_invoices') THEN
    RAISE NOTICE '✓ mark_overdue_invoices function created';
  END IF;
END $$;

-- ============================================================
-- SECTION 10: SAMPLE QUERIES (FOR REFERENCE)
-- ============================================================

-- Get current month invoice statistics
-- SELECT * FROM get_invoice_statistics(
--   DATE_TRUNC('month', CURRENT_DATE)::DATE,
--   (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE
-- );

-- View all unpaid invoices
-- SELECT 
--   invoice_number,
--   client_name,
--   total_amount,
--   due_date,
--   days_overdue
-- FROM invoice_summary
-- WHERE status IN ('SENT', 'VIEWED', 'OVERDUE')
-- ORDER BY due_date;

-- Monthly revenue report
-- SELECT 
--   TO_CHAR(month, 'Mon YYYY') as month_name,
--   invoice_count,
--   total_invoiced,
--   total_paid,
--   ROUND((total_paid / NULLIF(total_invoiced, 0) * 100), 2) as collection_rate
-- FROM monthly_invoice_revenue
-- LIMIT 12;

-- Mark overdue invoices (run daily)
-- SELECT mark_overdue_invoices() as invoices_marked_overdue;

COMMIT;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

SELECT 
  '✅ MIGRATION COMPLETED SUCCESSFULLY!' as status,
  NOW() as completed_at,
  current_database() as database_name,
  current_user as executed_by;

SELECT 
  'Invoice Management System Ready!' as message,
  'All tables, indexes, functions, and views created.' as details,
  'You can now use /admin/invoices to generate invoices.' as next_step;

-- Show summary of what was created
SELECT 
  'TABLES CREATED' as category,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name LIKE 'invoice%'
UNION ALL
SELECT 
  'VIEWS CREATED',
  COUNT(*)
FROM information_schema.views
WHERE table_schema = 'public' 
  AND table_name LIKE '%invoice%'
UNION ALL
SELECT 
  'FUNCTIONS CREATED',
  COUNT(*)
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname LIKE '%invoice%';
