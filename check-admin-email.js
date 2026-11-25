/**
 * Check what admin emails are in the database
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmins() {
  console.log('🔍 Checking admin accounts in database...\n');

  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true
      }
    });

    if (admins.length === 0) {
      console.log('❌ No admin accounts found in database!\n');
      return;
    }

    console.log(`✅ Found ${admins.length} admin account(s):\n`);
    console.log('═══════════════════════════════════════════════════════');
    
    admins.forEach((admin, index) => {
      console.log(`\nAdmin #${index + 1}:`);
      console.log('─────────────────────────────────────────────────────');
      console.log(`ID:       ${admin.id}`);
      console.log(`Name:     ${admin.name}`);
      console.log(`Email:    ${admin.email}`);
      console.log(`Status:   ${admin.status}`);
      console.log(`Created:  ${admin.createdAt.toISOString()}`);
    });

    console.log('\n═══════════════════════════════════════════════════════\n');

    // Check if email needs to be fixed
    const needsFix = admins.some(admin => admin.email !== admin.email.toLowerCase());
    
    if (needsFix) {
      console.log('⚠️  WARNING: Some emails have uppercase letters!');
      console.log('The auth system converts emails to lowercase during login.');
      console.log('This will cause 401 errors.\n');
      console.log('💡 Solution: Emails in database should be lowercase.\n');
    } else {
      console.log('✅ All emails are lowercase - auth should work correctly.\n');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();
