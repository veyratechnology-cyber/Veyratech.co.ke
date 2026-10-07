-- Fix admin password hash
-- Run this in Supabase SQL Editor

-- First, let's check if admin exists
SELECT id, email, status FROM admins WHERE email = 'admin@veyratech.com';

-- Update with correct bcryptjs hash for password: ***REMOVED***
UPDATE admins 
SET password_hash = '***REMOVED_HASH***'
WHERE email = 'admin@veyratech.com';

-- Verify the update
SELECT id, email, password_hash, status FROM admins WHERE email = 'admin@veyratech.com';
