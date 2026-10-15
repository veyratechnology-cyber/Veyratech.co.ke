import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Send notification email to Aggrey
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Portfolio Contact Message</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>

        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
        
        <p style="color: #6b7280; font-size: 14px;">
          This message was sent through your portfolio contact form at veyratech.co.ke/portfolio
        </p>
      </div>
    `;

    await sendEmail({
      to: "aggrey@veyratech.co.ke",
      subject: `Portfolio Contact from ${name}`,
      html: emailContent,
      replyTo: email,
    });

    // Send confirmation email to the sender
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Reaching Out!</h2>
        
        <p>Hi ${name},</p>
        
        <p>Thank you for your message. I've received it and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <p>If you need immediate assistance, feel free to reach me directly at:</p>
        <ul>
          <li>Email: <a href="mailto:aggrey@veyratech.co.ke">aggrey@veyratech.co.ke</a></li>
          <li>Phone: <a href="tel:+254745247211">+254 745 247 211</a></li>
        </ul>
        
        <p>Best regards,<br/>
        <strong>Aggrey Gisemba Ogeto</strong><br/>
        Founder, VeyraTech</p>
        
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
        
        <p style="color: #6b7280; font-size: 14px;">
          VeyraTech | Practical Technology Solutions for African Businesses<br/>
          <a href="https://veyratech.co.ke">veyratech.co.ke</a>
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Thanks for reaching out - VeyraTech",
      html: confirmationContent,
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
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
