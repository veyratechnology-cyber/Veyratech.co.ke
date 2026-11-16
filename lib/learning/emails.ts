/**
 * Learning Module Email Templates
 */

import { Resend } from "resend";

// Lazy-load Resend to avoid initialization during build
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.EMAIL_FROM || "VeyraTech <noreply@veyratech.co.ke>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://veyratech.co.ke";

/**
 * Send application confirmation email
 */
export async function sendApplicationConfirmation(data: {
  email: string;
  name: string;
  referenceNumber: string;
  programmeName: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Received - VeyraTech Learning</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #0D2340 0%, #1a3a5c 100%); padding: 40px 20px; text-align: center; }
            .logo { width: 150px; height: auto; }
            .content { padding: 40px 30px; }
            .reference-box { background: linear-gradient(135deg, #FC8436 0%, #ff9d5c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
            .reference-number { font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0; }
            .info-box { background-color: #f8f9fa; border-left: 4px solid #0D2340; padding: 15px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 14px; color: #666; }
            .button { display: inline-block; padding: 14px 28px; background-color: #FC8436; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .button:hover { background-color: #e67530; }
            h1 { color: white; margin: 0; font-size: 28px; }
            h2 { color: #0D2340; margin-top: 0; }
            ul { padding-left: 20px; }
            li { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Application Received!</h1>
            </div>
            
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              
              <p>Thank you for applying to <strong>${data.programmeName}</strong> at VeyraTech Learning & Mentorship.</p>
              
              <div class="reference-box">
                <p style="margin: 0; font-size: 14px;">Your Application Reference Number</p>
                <div class="reference-number">${data.referenceNumber}</div>
                <p style="margin: 0; font-size: 14px;">Please save this number for your records</p>
              </div>
              
              <h2>What Happens Next?</h2>
              
              <div class="info-box">
                <ul style="margin: 10px 0;">
                  <li><strong>Review:</strong> Our team will carefully review your application</li>
                  <li><strong>Decision:</strong> You'll receive an email within 3-5 business days</li>
                  <li><strong>Admission:</strong> If accepted, you'll receive account activation instructions</li>
                </ul>
              </div>
              
              <h2>Application Summary</h2>
              <ul>
                <li><strong>Programme:</strong> ${data.programmeName}</li>
                <li><strong>Reference Number:</strong> ${data.referenceNumber}</li>
                <li><strong>Submitted:</strong> ${new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</li>
              </ul>
              
              <p><strong>Important:</strong> Keep this email and reference number safe. You may need it to track your application status.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${APP_URL}/students" class="button">Visit Student Portal</a>
              </div>
              
              <p>If you have any questions, feel free to contact us at <a href="mailto:hello@veyratech.co.ke">hello@veyratech.co.ke</a> or call +254 745 247 211.</p>
              
              <p>Best regards,<br><strong>VeyraTech Learning Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>VeyraTech</strong><br>Software Development & Solutions</p>
              <p>Nairobi, Kenya<br>hello@veyratech.co.ke | +254 745 247 211</p>
              <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} VeyraTech. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Application Received - ${data.programmeName} | VeyraTech Learning`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Application confirmation error:", error);
    return { success: false, error: "Failed to send confirmation email" };
  }
}

/**
 * Send admission notification email with account activation
 */
export async function sendAdmissionNotification(data: {
  email: string;
  name: string;
  programmeName: string;
  activationToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const activationLink = `${APP_URL}/students/activate?token=${data.activationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Congratulations! You've Been Admitted - VeyraTech Learning</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #FC8436 0%, #ff9d5c 100%); padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .success-badge { background-color: #28a745; color: white; display: inline-block; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 20px 0; }
            .action-box { background: linear-gradient(135deg, #0D2340 0%, #1a3a5c 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; }
            .info-box { background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
            .warning-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 14px; color: #666; }
            .button { display: inline-block; padding: 16px 32px; background-color: #FC8436; color: white !important; text-decoration: none; border-radius: 6px; font-weight: 700; margin: 20px 0; font-size: 16px; }
            .button:hover { background-color: #e67530; }
            h1 { color: white; margin: 0; font-size: 32px; }
            h2 { color: #0D2340; margin-top: 0; }
            ul { padding-left: 20px; }
            li { margin: 10px 0; }
            .emoji { font-size: 48px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">🎉</div>
              <h1>Congratulations!</h1>
              <p style="color: white; font-size: 18px; margin: 10px 0;">You've Been Admitted!</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              
              <p style="font-size: 18px;"><strong>We're thrilled to inform you that you have been admitted to <span style="color: #FC8436;">${data.programmeName}</span>!</strong></p>
              
              <div class="success-badge">✓ APPLICATION APPROVED</div>
              
              <p>Your application impressed us, and we believe you have what it takes to succeed in this programme.</p>
              
              <div class="action-box">
                <h2 style="color: white; margin-top: 0;">🚀 Activate Your Account</h2>
                <p style="color: white;">Click the button below to set your password and activate your student account.</p>
                <a href="${activationLink}" class="button">Activate My Account</a>
                <p style="color: #ccc; font-size: 14px; margin-top: 20px;">This link expires in 7 days</p>
              </div>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #28a745;">What You'll Get:</h3>
                <ul style="margin: 10px 0;">
                  <li>Access to complete learning modules and lessons</li>
                  <li>Hands-on assignments and projects</li>
                  <li>One-on-one mentorship sessions</li>
                  <li>Personalized feedback on your work</li>
                  <li>Certificate of completion</li>
                </ul>
              </div>
              
              <h2>Next Steps</h2>
              <ol>
                <li><strong>Activate Your Account:</strong> Click the activation button above</li>
                <li><strong>Set Your Password:</strong> Choose a strong, secure password</li>
                <li><strong>Complete Your Profile:</strong> Add any additional information</li>
                <li><strong>Start Learning:</strong> Access your first module immediately</li>
              </ol>
              
              <div class="warning-box">
                <p style="margin: 0;"><strong>⚠️ Important:</strong> You must activate your account within 7 days. After that, this link will expire and you'll need to contact us.</p>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px; font-family: monospace;">${activationLink}</p>
              
              <h2>Need Help?</h2>
              <p>If you have any questions or need assistance, our team is here to help:</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:hello@veyratech.co.ke">hello@veyratech.co.ke</a></li>
                <li><strong>Phone:</strong> +254 745 247 211</li>
                <li><strong>WhatsApp:</strong> +254 745 247 211</li>
              </ul>
              
              <p>We're excited to have you join the VeyraTech Learning community. Let's build something amazing together!</p>
              
              <p>Welcome aboard! 🚀</p>
              
              <p>Best regards,<br><strong>VeyraTech Learning Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>VeyraTech</strong><br>Software Development & Solutions</p>
              <p>Nairobi, Kenya<br>hello@veyratech.co.ke | +254 745 247 211</p>
              <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} VeyraTech. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `🎉 Congratulations! You've Been Admitted to ${data.programmeName}`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Admission notification error:", error);
    return { success: false, error: "Failed to send admission email" };
  }
}

/**
 * Send assignment submission notification to mentor
 */
export async function sendAssignmentSubmissionNotification(data: {
  mentorEmail: string;
  mentorName: string;
  studentName: string;
  assignmentTitle: string;
  submissionUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Assignment Submission - VeyraTech Learning</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #0D2340 0%, #1a3a5c 100%); padding: 30px 20px; text-align: center; color: white; }
            .content { padding: 30px; }
            .button { display: inline-block; padding: 14px 28px; background-color: #FC8436; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 New Assignment Submission</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${data.mentorName}</strong>,</p>
              <p><strong>${data.studentName}</strong> has submitted an assignment that requires your review.</p>
              <p><strong>Assignment:</strong> ${data.assignmentTitle}</p>
              <div style="text-align: center;">
                <a href="${data.submissionUrl}" class="button">Review Submission</a>
              </div>
              <p>Best regards,<br>VeyraTech Learning Platform</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} VeyraTech. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: data.mentorEmail,
      subject: `New Assignment Submission from ${data.studentName}`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Assignment notification error:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
