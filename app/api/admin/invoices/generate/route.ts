/**
 * API endpoint to generate and send invoices
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateInvoiceHTML, generateInvoiceNumber, InvoiceData } from '@/lib/invoices/generator';
import { sendEmail, wrapEmailTemplate } from '@/lib/email/resend-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      clientName,
      clientEmail,
      clientCompany,
      clientAddress,
      items,
      notes,
      sendToClient = false,
    } = body;

    // Validate required fields
    if (!clientName || !clientEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: clientName, clientEmail, and items are required' },
        { status: 400 }
      );
    }

    // Generate invoice data
    const invoiceData: InvoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      date: new Date(),
      clientName,
      clientEmail,
      clientCompany,
      clientAddress,
      items,
      notes,
    };

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(invoiceData);

    // If sendToClient is true, send via email
    if (sendToClient) {
      const emailContent = `
        <h2>Your Invoice from VeyraTech</h2>
        <p>Dear ${clientName},</p>
        <p>Thank you for choosing VeyraTech for your technology consulting needs. Please find your invoice attached to this email.</p>
        <div class="info-box">
          <p><strong>Invoice Summary:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</li>
            <li><strong>Date:</strong> ${invoiceData.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</li>
            <li><strong>Due Date:</strong> ${new Date(invoiceData.date.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</li>
          </ul>
        </div>
        <p>You can view and download the invoice attached to this email, or access it online from your client portal.</p>
        <div class="divider"></div>
        <h3>Payment Information</h3>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>M-Pesa:</strong> Send payment to +254 745 247 211</li>
          <li><strong>Bank Transfer:</strong> Contact us for bank details</li>
          <li><strong>Payment Due:</strong> Within 30 days of invoice date</li>
        </ul>
        <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
        <p style="margin-top: 30px;">Best regards,<br><strong>The VeyraTech Team</strong></p>
      `;

      const emailResult = await sendEmail({
        to: clientEmail,
        subject: `Invoice ${invoiceData.invoiceNumber} from VeyraTech`,
        html: wrapEmailTemplate(emailContent, `Invoice ${invoiceData.invoiceNumber}`),
        attachments: [
          {
            filename: `VeyraTech_Invoice_${invoiceData.invoiceNumber}.html`,
            content: invoiceHTML,
          },
        ],
      });

      if (!emailResult.success) {
        return NextResponse.json(
          { error: `Failed to send email: ${emailResult.error}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Invoice generated and sent successfully',
        invoiceNumber: invoiceData.invoiceNumber,
        emailId: emailResult.id,
        invoiceHTML,
      });
    }

    // Just return the generated invoice HTML
    return NextResponse.json({
      success: true,
      message: 'Invoice generated successfully',
      invoiceNumber: invoiceData.invoiceNumber,
      invoiceHTML,
    });
  } catch (error: any) {
    console.error('[GENERATE_INVOICE_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
