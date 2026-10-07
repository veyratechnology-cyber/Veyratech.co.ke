-- ============================================================
-- VEYRATECH - ADD ALL LATEST FEATURES
-- This script adds Invoice tables and ensures all recent features
-- have proper database support
-- ============================================================

-- Start transaction
BEGIN;

-- ============================================================
-- 1. CREATE INVOICE ENUMS
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
  WHEN duplicate_object THEN null;
END $$;

-- Payment Method Enum (if not exists from newsletter)
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'MPESA',
    'BANK_TRANSFER',
    'CARD',
    'CASH',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 2. CREATE INVOICE TABLES
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
  
  -- Relations
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  assigned_admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  
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
  recorded_by_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_payment_amount CHECK (amount > 0)
);

-- Invoice History/Audit Table
CREATE TABLE IF NOT EXISTS invoice_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Action Details
  action VARCHAR(100) NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  
  -- Who & When
  performed_by_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional Context
  notes TEXT,
  ip_address INET,
  user_agent TEXT
);

-- ============================================================
-- 3. CREATE INDEXES
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
-- 4. CREATE TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to invoices
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to invoice_items
DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;
CREATE TRIGGER update_invoice_items_updated_at
  BEFORE UPDATE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to invoice_payments
DROP TRIGGER IF EXISTS update_invoice_payments_updated_at ON invoice_payments;
CREATE TRIGGER update_invoice_payments_updated_at
  BEFORE UPDATE ON invoice_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. CREATE USEFUL FUNCTIONS
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
  
  -- Calculate VAT
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
    COALESCE(SUM(total_amount), 0) as total_amount,
    COALESCE(SUM(CASE WHEN status = 'PAID' THEN total_amount ELSE 0 END), 0) as paid_amount,
    COALESCE(SUM(CASE WHEN status IN ('SENT', 'VIEWED') THEN total_amount ELSE 0 END), 0) as pending_amount,
    COALESCE(SUM(CASE WHEN status = 'OVERDUE' THEN total_amount ELSE 0 END), 0) as overdue_amount,
    COALESCE(AVG(total_amount), 0) as average_invoice_value
  FROM invoices
  WHERE
    (p_start_date IS NULL OR issue_date >= p_start_date)
    AND (p_end_date IS NULL OR issue_date <= p_end_date);
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
-- 6. CREATE VIEWS
-- ============================================================

-- View for invoice summary
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
  COUNT(ii.id) as item_count,
  COALESCE(SUM(p.amount), 0) as total_paid,
  (i.total_amount - COALESCE(SUM(p.amount), 0)) as balance_due,
  CASE
    WHEN i.due_date < CURRENT_DATE AND i.status != 'PAID' THEN CURRENT_DATE - i.due_date
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

-- View for monthly revenue
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
-- 7. UPDATE AUDIT_ACTION ENUM (Add invoice actions)
-- ============================================================

-- Add new audit actions for invoices
DO $$ BEGIN
  ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'INVOICE_CREATED';
  ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'INVOICE_SENT';
  ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'INVOICE_PAID';
  ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'INVOICE_CANCELLED';
  ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'PAYMENT_RECORDED';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 8. ADD COMMENTS
-- ============================================================

COMMENT ON TABLE invoices IS 'Professional invoices with VeyraTech branding, 16% VAT, and payment tracking';
COMMENT ON TABLE invoice_items IS 'Line items for invoices with quantity, pricing, and totals';
COMMENT ON TABLE invoice_payments IS 'Payment records including M-Pesa, bank transfers, and other methods';
COMMENT ON TABLE invoice_history IS 'Complete audit trail of invoice changes and actions';

COMMENT ON COLUMN invoices.vat_rate IS '16% VAT standard rate for Kenya';
COMMENT ON COLUMN invoices.currency IS 'Default KSH (Kenyan Shilling)';
COMMENT ON COLUMN invoices.due_date IS 'Payment due date, default 30 days from issue';

-- ============================================================
-- 9. VERIFY TABLES
-- ============================================================

-- Check all invoice tables exist
DO $$
DECLARE
  table_count INT;
BEGIN
  SELECT COUNT(*)
  INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('invoices', 'invoice_items', 'invoice_payments', 'invoice_history');
  
  IF table_count = 4 THEN
    RAISE NOTICE '✓ All invoice tables created successfully';
  ELSE
    RAISE WARNING '⚠ Only % of 4 invoice tables found', table_count;
  END IF;
END $$;

-- Check enums
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
    RAISE NOTICE '✓ invoice_status enum exists';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    RAISE NOTICE '✓ payment_method enum exists';
  END IF;
END $$;

-- Commit transaction
COMMIT;

-- ============================================================
-- 10. USAGE EXAMPLES
-- ============================================================

-- Example: Get invoice statistics for current month
-- SELECT * FROM get_invoice_statistics(
--   DATE_TRUNC('month', CURRENT_DATE)::DATE,
--   (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE
-- );

-- Example: View all unpaid invoices
-- SELECT * FROM invoice_summary
-- WHERE status IN ('SENT', 'VIEWED', 'OVERDUE')
-- ORDER BY due_date;

-- Example: Mark overdue invoices
-- SELECT mark_overdue_invoices();

-- Example: Get monthly revenue report
-- SELECT * FROM monthly_invoice_revenue
-- LIMIT 12;

SELECT '✓ All latest features added successfully!' as status;
SELECT 'Invoice management system is ready to use!' as message;
