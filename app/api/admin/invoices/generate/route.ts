import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { generateInvoiceHTML, generateInvoiceNumber } from '@/lib/invoices/generator';

/**
 * POST /api/admin/invoices/generate
 * Generate an invoice for a project or consultation
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      clientName,
      clientEmail,
      clientCompany,
      clientAddress,
      items,
      notes,
    } = data;

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML({
      invoiceNumber,
      date: new Date(),
      clientName,
      clientEmail,
      clientCompany,
      clientAddress,
      items,
      notes,
    });

    return NextResponse.json({
      success: true,
      invoiceNumber,
      html: invoiceHTML,
    });
  } catch (error: any) {
    console.error('[API] Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error.message },
      { status: 500 }
    );
  }
}
