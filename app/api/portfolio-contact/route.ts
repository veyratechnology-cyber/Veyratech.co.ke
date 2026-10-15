import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "VeyraTech <noreply@veyratech.com>";

/**
 * Portfolio Contact Form API
 * Handles networking connections from portfolio page
 * Sends notifications to gisembaaggrey@gmail.com
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, role, building } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Email to Aggrey
    const aggreyEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FC8436;">New Portfolio Connection! 🤝</h2>
        <p>Someone wants to connect with you from your portfolio page:</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          ${role ? `<p><strong>Role:</strong> ${role}</p>` : ""}
          ${building ? `<p><strong>What they're working on:</strong> ${building}</p>` : ""}
        </div>

        <p style="color: #666; font-size: 14px;">
          💡 <strong>Follow-up tip:</strong> ${
            building
              ? `They mentioned working on: "${building}" - this could be a great conversation starter!`
              : "Ask them what they're currently building or working on."
          }
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          Sent from your portfolio at veyratech.co.ke/portfolio
        </p>
      </div>
    `;

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: "gisembaaggrey@gmail.com",
        subject: `🤝 New Connection: ${name}${company ? ` from ${company}` : ""}`,
        html: aggreyEmailContent,
      });
    } else {
      console.log("[PORTFOLIO] Email not configured, skipping notification");
    }

    // Confirmation email to the contact
    const contactEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FC8436;">Thanks for connecting, ${name}! 👋</h2>
        
        <p>I've received your message and will get back to you soon.</p>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li>Check out <a href="https://veyratech.co.ke" style="color: #FC8436;">VeyraTech</a></li>
          <li>Connect with me on <a href="https://linkedin.com/in/aggrey-ogeto" style="color: #FC8436;">LinkedIn</a></li>
          <li>Email me directly at <a href="mailto:gisembaaggrey@gmail.com">gisembaaggrey@gmail.com</a></li>
        </ul>

        <p style="margin-top: 30px;">Looking forward to our conversation!</p>
        
        <p><strong>Aggrey Gisemba</strong><br/>
        Founder, VeyraTech<br/>
        <a href="https://veyratech.co.ke/portfolio" style="color: #FC8436;">veyratech.co.ke/portfolio</a></p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          This is an automated confirmation from veyratech.co.ke/portfolio
        </p>
      </div>
    `;

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Thanks for connecting! - Aggrey Gisemba",
        html: contactEmailContent,
      });
    }

    // Log for WhatsApp integration (future)
    console.log("📱 WhatsApp notification needed for:", {
      name,
      phone,
      company,
      role,
      building,
    });

    return NextResponse.json({
      success: true,
      message: "Connection received! Check your email for confirmation.",
    });
  } catch (error) {
    console.error("Portfolio contact error:", error);
    return NextResponse.json(
      { error: "Failed to process connection request" },
      { status: 500 }
    );
  }
}
