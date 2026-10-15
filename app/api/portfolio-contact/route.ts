import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  building?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, company, role, building } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Send notification email to Aggrey with all networking details
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0D2340 0%, #FC8436 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">🤝 New Portfolio Connection</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #0D2340; margin-top: 0;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600; width: 120px;">Name:</td>
                <td style="padding: 10px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #FC8436; text-decoration: none;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Phone:</td>
                <td style="padding: 10px 0;"><a href="tel:${phone}" style="color: #FC8436; text-decoration: none;">${phone}</a></td>
              </tr>
              ` : ''}
              ${company ? `
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Company:</td>
                <td style="padding: 10px 0; color: #333;">${company}</td>
              </tr>
              ` : ''}
              ${role ? `
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Role:</td>
                <td style="padding: 10px 0; color: #333;">${role}</td>
              </tr>
              ` : ''}
              ${building ? `
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Working On:</td>
                <td style="padding: 10px 0; color: #333;">${building}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="margin-top: 20px; padding: 20px; background: #fff3e0; border-left: 4px solid #FC8436; border-radius: 4px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong style="color: #FC8436;">💡 Quick Action:</strong> 
              This person connected through your portfolio page. Consider following up within 24 hours to make a strong impression!
            </p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>Received via veyratech.co.ke/portfolio</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: "aggrey@veyratech.co.ke",
      subject: `🤝 New Connection: ${name}${company ? ` from ${company}` : ''}`,
      html: emailContent,
      replyTo: email,
    });

    // Send confirmation email to the contact
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0D2340 0%, #FC8436 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Thanks for Connecting!</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <div style="background: white; padding: 25px; border-radius: 8px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Great to connect! I've received your info and will get back to you within 24 hours.
            </p>

            <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #0D2340; font-size: 15px; margin: 0; line-height: 1.6;">
                <strong>In the meantime:</strong><br/>
                Check out <a href="https://veyratech.co.ke" style="color: #FC8436; text-decoration: none;">VeyraTech</a> 
                to learn more about what we're building, or connect with me on 
                <a href="https://linkedin.com/in/aggrey-ogeto" style="color: #FC8436; text-decoration: none;">LinkedIn</a>.
              </p>
            </div>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Looking forward to chatting!
            </p>

            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
              Best,<br/>
              <strong style="color: #0D2340;">Aggrey Gisemba Ogeto</strong><br/>
              <span style="color: #FC8436;">Founder, VeyraTech</span>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:aggrey@veyratech.co.ke" style="color: #FC8436; text-decoration: none; font-size: 14px;">aggrey@veyratech.co.ke</a>
            <span style="color: #ccc; margin: 0 10px;">|</span>
            <a href="tel:+254745247211" style="color: #FC8436; text-decoration: none; font-size: 14px;">+254 745 247 211</a>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Thanks for connecting - Aggrey Ogeto",
      html: confirmationContent,
    });

    return NextResponse.json(
      { success: true, message: "Connection received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Portfolio contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
