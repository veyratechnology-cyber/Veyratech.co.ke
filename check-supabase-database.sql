-- ============================================================
-- SUPABASE DATABASE IDENTIFICATION SCRIPT
-- Run this to identify which Supabase database you're connected to
-- ============================================================

-- Show database name and connection info
SELECT 
  current_database() as database_name,
  current_user as connected_user,
  version() as postgres_version;

-- Show when the database was created (approximately)
SELECT 
  pg_database.datname as database_name,
  pg_database.datcollate as collation,
  pg_size_pretty(pg_database_size(pg_database.datname)) as database_size
FROM pg_database
WHERE datname = current_database();

-- List all tables in your database (this helps identify which project)
SELECT 
  schemaname as schema,
  tablename as table_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count records in key tables (if they exist)
SELECT 
  'admins' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as last_record_date
FROM admins
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins')
UNION ALL
SELECT 
  'leads' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as last_record_date
FROM leads
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads')
UNION ALL
SELECT 
  'consultations' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as last_record_date
FROM consultations
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consultations')
UNION ALL
SELECT 
  'proposals' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as last_record_date
FROM proposals
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'proposals');

-- Check for admin users (this helps identify your project)
SELECT 
  email as admin_email,
  name as admin_name,
  status,
  created_at,
  last_login_at
FROM admins
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins')
ORDER BY created_at
LIMIT 10;

-- Show recent activity (helps confirm it's the right database)
SELECT 
  'Recent Leads' as activity_type,
  COUNT(*) as count,
  MAX(created_at) as latest_date
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads')
UNION ALL
SELECT 
  'Recent Consultations' as activity_type,
  COUNT(*) as count,
  MAX(created_at) as latest_date
FROM consultations
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consultations')
UNION ALL
SELECT 
  'Recent Contact Messages' as activity_type,
  COUNT(*) as count,
  MAX(created_at) as latest_date
FROM contact_messages
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_messages');

-- Check if invoices table exists (from our new feature)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices')
    THEN '✅ Invoice tables EXISTS - New feature already installed'
    ELSE '❌ Invoice tables NOT FOUND - Need to run migration'
  END as invoice_system_status;

-- Show Supabase project URL hint (from connection string)
SELECT 
  'Check your .env file DATABASE_URL - it should contain your project reference' as hint,
  'Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres' as format_example;

COMMENT ON DATABASE postgres IS 'VeyraTech Production Database';
