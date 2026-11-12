/**
 * Create (or reset) an admin account.
 *
 * Usage (PowerShell):
 *   $env:ADMIN_LOGIN_EMAIL="you@veyratech.co.ke"; $env:ADMIN_NEW_PASSWORD="<strong password>"; node scripts/create-admin.js
 *
 * Never hardcode passwords in this file - the repository is public.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_LOGIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_NEW_PASSWORD || '';

  if (!email || !password) {
    console.error('Set ADMIN_LOGIN_EMAIL and ADMIN_NEW_PASSWORD environment variables.');
    process.exit(1);
  }
  if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    console.error('Password must be 12+ characters with upper, lower case letters and numbers.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, status: 'ACTIVE' },
    create: { email, name: 'Administrator', passwordHash, status: 'ACTIVE' },
  });
  console.log(`Admin ready: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
