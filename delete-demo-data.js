/**
 * Delete Demo Data
 * Removes the fake demo data added by seed script
 * Keeps any real customer data
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEMO_EMAILS = [
  'john.kamau@techstartup.co.ke',
  'sarah@retailcorp.co.ke',
  'david.o@fintechke.com',
  'mary@logistics.co.ke',
  'robert@sportstach.co.ke'
];

async function deleteDemoData() {
  console.log('🗑️  Deleting demo data from VeyraTech CRM...\n');

  try {
    // Delete demo leads
    console.log('👥 Deleting demo leads...');
    const deletedLeads = await prisma.lead.deleteMany({
      where: {
        email: {
          in: DEMO_EMAILS
        }
      }
    });
    console.log(`✅ Deleted ${deletedLeads.count} demo leads\n`);

    // Delete demo prospects
    console.log('💼 Deleting demo prospects...');
    const deletedProspects = await prisma.prospect.deleteMany({
      where: {
        email: {
          in: DEMO_EMAILS
        }
      }
    });
    console.log(`✅ Deleted ${deletedProspects.count} demo prospects\n`);

    // Check remaining data
    const remainingLeads = await prisma.lead.count();
    const remainingConsultations = await prisma.consultation.count();
    const remainingProspects = await prisma.prospect.count();

    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ DEMO DATA DELETED ✨');
    console.log('═══════���═══════════════════════════════════════════════\n');

    console.log('📊 Remaining Real Data:');
    console.log('─────────────────────────────────────────────────────');
    console.log(`Leads: ${remainingLeads}`);
    console.log(`Consultations: ${remainingConsultations}`);
    console.log(`Prospects: ${remainingProspects}`);
    console.log('─────────────────────────────────────────────────────\n');

    if (remainingLeads > 0 || remainingConsultations > 0) {
      console.log('✅ Your real customer data is safe!');
      console.log('✅ Only demo data was deleted.\n');
    } else {
      console.log('💡 Database is now empty and ready for real customers.\n');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the deletion
deleteDemoData();
