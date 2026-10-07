-- Setup admin user for VeyraTech
-- Password: Admin123! (hashed with bcrypt)

INSERT INTO admins (id, name, email, password_hash, status, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'Admin User',
  'admin@veyratech.com',
  '***REMOVED_HASH***',
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
