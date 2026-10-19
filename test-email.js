/**
 * Email Testing Script
 * 
 * This script tests if Resend email service is working correctly.
 * Run: node test-email.js
 */

require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing Resend Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Configuration Check:');
  console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ Missing');
  console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ Missing');
  console.log('');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set in .env file');
    process.exit(1);
  }
  
  // Test 1: Send test email to admin
  console.log('📧 Test 1: Sending test email to admin...');
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: '✅ VeyraTech Email Test - Admin Notification',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from your VeyraTech website.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>If you're seeing this, your email configuration is working correctly! ✅</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This email was sent to: ${process.env.ADMIN_EMAIL}<br>
          From: ${process.env.EMAIL_FROM}
        </p>
      `
    });
    
    console.log('  ✅ Email sent successfully!');
    console.log('  Email ID:', result.id);
    console.log('');
  } catch (error) {
    console.error('  ❌ Failed to send email:', error.message);
    console.error('');
    process.exit(1);
  }
  
  // Test 2: Send test email to a different address (optional)
  const testEmail = 'gisembaaggrey@gmail.com';
  console.log(`📧 Test 2: Sending test email to ${testEmail}...`);
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: '✅ VeyraTech Email Test - Customer Confirmation',
      html: `
        <h2>Email Test Successful!</h2>
        <p>Hi there,</p>
        <p>This is a test confirmation email from VeyraTech.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>If you're seeing this, your customer confirmation emails will work correctly! ✅</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This email was sent to: ${testEmail}<br>
          From: ${process.env.EMAIL_FROM}
        </p>
      `
    });
    
    console.log('  ✅ Email sent successfully!');
    console.log('  Email ID:', result.id);
    console.log('');
  } catch (error) {
    console.error('  ❌ Failed to send email:', error.message);
    console.error('');
  }
  
  console.log('✅ Email testing complete!');
  console.log('');
  console.log('📌 Next Steps:');
  console.log('  1. Check your inbox at:', process.env.ADMIN_EMAIL);
  console.log('  2. Check your inbox at:', testEmail);
  console.log('  3. Check Resend dashboard: https://resend.com/emails');
  console.log('  4. Check spam/junk folders if emails not in inbox');
  console.log('');
  console.log('🔗 Resend Dashboard: https://resend.com/emails');
}

testEmail().catch(console.error);
