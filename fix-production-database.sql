-- ============================================================================
-- PRODUCTION DATABASE FIX - Run this in Supabase SQL Editor
-- ============================================================================

-- 1. FIX ADMIN PASSWORD HASH
-- This hash matches password: ***REMOVED***
UPDATE admins 
SET 
  password_hash = '***REMOVED_HASH***',
  status = 'ACTIVE',
  updated_at = NOW()
WHERE email = 'admin@veyratech.com';

INSERT INTO admins (id, name, email, password_hash, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Administrator',
  'admin@veyratech.com',
  '***REMOVED_HASH***',
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 3. VERIFY THE FIX
SELECT 
  email,
  name,
  status,
  substring(password_hash, 1, 20) as hash_preview,
  created_at,
  updated_at
FROM admins 
WHERE email = 'admin@veyratech.com';

-- Expected output:
-- email: admin@veyratech.com
-- name: Administrator
-- status: ACTIVE
-- hash_preview: $2a$10$x.x/hNXqWfHu
-- created_at: (date)
-- updated_at: (just now)

-- ============================================================================
-- LOGIN CREDENTIALS (for reference)
-- ============================================================================
-- Email: admin@veyratech.com
-- Password: ***REMOVED***
-- ============================================================================
