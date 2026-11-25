/**
 * Check what data exists in the database
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 Checking database contents...\n');

  try {
    // Check all tables
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const consultations = await prisma.consultation.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        preferredDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const prospects = await prisma.prospect.findMany({
      select: {
        id: true,
        company: true,
        contactPerson: true,
        email: true,
        contactStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const proposals = [];
    const projects = [];

    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 DATABASE CONTENTS');
    console.log('═══════════════════════════════════════════════════════\n');

    // Leads
    console.log(`📋 LEADS (${leads.length} total):`);
    console.log('─────────────────────────────────────────────────────');
    if (leads.length > 0) {
      leads.forEach((lead, i) => {
        console.log(`\n${i + 1}. ${lead.name} - ${lead.company || 'No company'}`);
        console.log(`   Email: ${lead.email}`);
        console.log(`   Status: ${lead.status}`);
        console.log(`   Created: ${lead.createdAt.toISOString()}`);
      });
    } else {
      console.log('   ❌ No leads found');
    }
    console.log('\n');

    // Consultations
    console.log(`📅 CONSULTATIONS (${consultations.length} total):`);
    console.log('─────────────────────────────────────────────────────');
    if (consultations.length > 0) {
      consultations.forEach((consultation, i) => {
        console.log(`\n${i + 1}. ${consultation.name} - ${consultation.company || 'No company'}`);
        console.log(`   Email: ${consultation.email}`);
        console.log(`   Status: ${consultation.status}`);
        console.log(`   Preferred Date: ${consultation.preferredDate ? consultation.preferredDate.toISOString() : 'Not set'}`);
        console.log(`   Created: ${consultation.createdAt.toISOString()}`);
      });
    } else {
      console.log('   ❌ No consultations found');
    }
    console.log('\n');

    // Prospects
    console.log(`💼 PROSPECTS (${prospects.length} total):`);
    console.log('─────────────────────────────────────────────────────');
    if (prospects.length > 0) {
      prospects.forEach((prospect, i) => {
        console.log(`\n${i + 1}. ${prospect.company}`);
        console.log(`   Contact: ${prospect.contactPerson}`);
        console.log(`   Email: ${prospect.email}`);
        console.log(`   Status: ${prospect.contactStatus}`);
        console.log(`   Created: ${prospect.createdAt.toISOString()}`);
      });
    } else {
      console.log('   ❌ No prospects found');
    }
    console.log('\n');

    // Proposals
    console.log(`📄 PROPOSALS (${proposals.length} total):`);
    console.log('─────────────────────────────────────────────────────');
    if (proposals.length > 0) {
      proposals.forEach((proposal, i) => {
        console.log(`\n${i + 1}. ${proposal.title}`);
        console.log(`   Client: ${proposal.client}`);
        console.log(`   Status: ${proposal.status}`);
        console.log(`   Created: ${proposal.createdAt.toISOString()}`);
      });
    } else {
      console.log('   ❌ No proposals found');
    }
    console.log('\n');

    // Projects
    console.log(`🚀 PROJECTS (${projects.length} total):`);
    console.log('─────────────────────────────────────────────────────');
    if (projects.length > 0) {
      projects.forEach((project, i) => {
        console.log(`\n${i + 1}. ${project.name}`);
        console.log(`   Client: ${project.client}`);
        console.log(`   Status: ${project.status}`);
        console.log(`   Created: ${project.createdAt.toISOString()}`);
      });
    } else {
      console.log('   ❌ No projects found');
    }
    console.log('\n');

    console.log('═══════════════════════════════════════════════════════\n');

    // Summary
    const hasRealData = consultations.some(c => !c.email.includes('agritech') && !c.email.includes('healthtech') && !c.email.includes('edutech'));
    
    if (hasRealData) {
      console.log('✅ REAL customer data detected!');
      console.log('⚠️  Do NOT run seed-demo-data.js again - it will delete this!\n');
    } else if (consultations.length === 0) {
      console.log('⚠️  WARNING: No consultation bookings found!');
      console.log('💡 Check if data was accidentally deleted.\n');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
