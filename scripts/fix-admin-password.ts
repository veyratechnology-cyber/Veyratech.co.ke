/**
 * Reset an admin's password.
 *
 * Usage (PowerShell):
 *   $env:ADMIN_LOGIN_EMAIL="you@veyratech.co.ke"; $env:ADMIN_NEW_PASSWORD="<strong password>"; npx ts-node -P tsconfig.seed.json scripts/fix-admin-password.ts
 *
 * Never hardcode passwords in this file - the repository is public.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validatePasswordStrength } from '../lib/auth/security';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_LOGIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_NEW_PASSWORD || '';

  if (!email || !password) {
    console.error('Set ADMIN_LOGIN_EMAIL and ADMIN_NEW_PASSWORD environment variables.');
    process.exit(1);
  }

  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    console.error('Password is too weak:\n - ' + strength.errors.join('\n - '));
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, status: 'ACTIVE' },
    create: { email, name: 'Administrator', passwordHash, status: 'ACTIVE' },
  });

  console.log(`Password updated for ${admin.email}.`);
}

main()
  .catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
