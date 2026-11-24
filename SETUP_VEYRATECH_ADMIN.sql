-- ============================================================================
-- VEYRATECH CRM ADMIN SETUP
-- ============================================================================
-- This creates the admin account for the VeyraTech consultation/CRM system
-- Email: Admin@veyratech.co.ke
-- Password: Bonaventure123kenya
-- ============================================================================

-- Remove any existing admin accounts
DELETE FROM admins;

-- Insert VeyraTech CRM Admin
-- Password: Bonaventure123kenya (hashed with bcrypt)
INSERT INTO admins (name, email, password_hash, status, created_at, updated_at)
VALUES (
  'VeyraTech Administrator',
  'Admin@veyratech.co.ke',
  '$2b$10$YXS9KqN.gL3vBzHLBkO8FeVBYF7FjnP3qDHZEKqvU2h3rX5oN9Jty',
  'ACTIVE',
  NOW(),
  NOW()
);

-- Verify the admin was created
SELECT 
  id,
  name,
  email,
  status,
  SUBSTRING(password_hash, 1, 20) || '...' as password_hash_preview,
  created_at,
  '✅ Admin account ready!' as message
FROM admins 
WHERE email = 'Admin@veyratech.co.ke';

-- ============================================================================
-- LOGIN INSTRUCTIONS
-- ============================================================================
-- URL:      https://www.veyratech.co.ke/admin/login
-- Email:    Admin@veyratech.co.ke
-- Password: Bonaventure123kenya
-- ============================================================================

-- ============================================================================
-- WHAT THIS ADMIN CAN ACCESS
-- ============================================================================
-- ✅ Dashboard & Analytics
-- ✅ Leads Management (from contact form submissions)
-- ✅ Consultation Bookings (scheduled meetings)
-- ✅ Proposals & Quotes
-- ✅ Projects Tracking
-- ✅ Admin Settings
-- ============================================================================

-- ============================================================================
-- NOTES
-- ============================================================================
-- • This is for the MAIN VeyraTech CRM system (consulting/business)
-- • No learning module features (removed as requested)
-- • Password is securely hashed with bcrypt
-- • Recommend changing password after first login
-- ============================================================================
