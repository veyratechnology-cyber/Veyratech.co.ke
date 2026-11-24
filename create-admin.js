/**
 * Create Admin Account Script
 * Run with: node create-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@veyratech.co.ke';
  const password = 'Admin@2024'; // Change this after first login!
  const name = 'VeyraTech Admin';

  try {
    // Check if admin already exists
    const existing = await prisma.$queryRaw`
      SELECT id, email FROM admins WHERE email = ${email} LIMIT 1
    `;

    if (existing.length > 0) {
      console.log('✅ Admin already exists!');
      console.log('Email:', email);
      console.log('Password: Admin@2024 (if unchanged)');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin
    await prisma.$executeRaw`
      INSERT INTO admins (id, name, email, password_hash, status, created_at, updated_at)
      VALUES (
        gen_random_uuid()::text,
        ${name},
        ${email},
        ${passwordHash},
        'ACTIVE',
        NOW(),
        NOW()
      )
    `;

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('='.repeat(60));
    console.log('ADMIN LOGIN CREDENTIALS');
    console.log('='.repeat(60));
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('='.repeat(60));
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');
    console.log('Login at: https://royaltech.vercel.app/admin/login');
    console.log('Or local: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
