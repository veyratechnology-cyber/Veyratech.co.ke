/**
 * Setup VeyraTech CRM Admin Account
 * Email: Admin@veyratech.co.ke
 * Password: Bonaventure123kenya
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  console.log('🔧 Setting up VeyraTech CRM Admin...\n');

  const adminData = {
    email: 'Admin@veyratech.co.ke',
    password: 'Bonaventure123kenya',
    name: 'VeyraTech Administrator'
  };

  try {
    // Generate password hash
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(adminData.password, 10);
    console.log('✅ Password hashed successfully\n');

    // Delete existing admin accounts
    console.log('🗑️  Removing old admin accounts...');
    await prisma.admin.deleteMany({});
    console.log('✅ Old accounts removed\n');

    // Insert new admin
    console.log('👤 Creating new admin account...');
    const newAdmin = await prisma.admin.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        passwordHash: passwordHash,
        status: 'ACTIVE',
      }
    });

    console.log('✅ Admin account created successfully!\n');

    // Verify the account
    console.log('🔍 Verifying admin account...');
    const verifyAdmin = await prisma.admin.findUnique({
      where: { email: adminData.email },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true
      }
    });

    if (!verifyAdmin) {
      throw new Error('Failed to verify admin account');
    }

    console.log('✅ Admin account verified!\n');

    // Display results
    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ VEYRATECH CRM ADMIN SETUP COMPLETE ✨');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📋 Admin Details:');
    console.log('─────────────────────────────────────────────────────');
    console.log(`Name:     ${verifyAdmin.name}`);
    console.log(`Email:    ${verifyAdmin.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Status:   ${verifyAdmin.status}`);
    console.log(`ID:       ${verifyAdmin.id}`);
    console.log('─────────────────────────────────────────────────────\n');

    console.log('🌐 Login URL:');
    console.log('─────────────────────────────────────────────────────');
    console.log('https://www.veyratech.co.ke/admin/login');
    console.log('─────────────────────────────────────────────────────\n');

    console.log('📊 What You Can Access:');
    console.log('─────────────────────────────────────────────────────');
    console.log('✅ Dashboard & Analytics');
    console.log('✅ Leads Management');
    console.log('✅ Consultation Bookings');
    console.log('✅ Proposals & Quotes');
    console.log('✅ Projects Tracking');
    console.log('✅ Admin Settings');
    console.log('─────────────────────────────────────────────────────\n');

    console.log('🔒 Security Notes:');
    console.log('─────────────────────────────────────────────────────');
    console.log('• Password uses bcrypt with 10 salt rounds');
    console.log('• Change password after first login recommended');
    console.log('• Keep credentials secure');
    console.log('─────────────────────────────────────────────────────\n');

    console.log('✅ Setup completed successfully!');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('1. Check .env file has correct DATABASE_URL');
    console.error('2. Verify database is accessible');
    console.error('3. Ensure admins table exists in database');
    console.error('4. Run: npx prisma generate');
    console.error('5. Run: npx prisma db push\n');
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupAdmin();
