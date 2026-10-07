/**
 * Invoice Generator for VeyraTech
 * Generates professional invoices with KSH pricing and 16% VAT
 */

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientAddress?: string;
  items: InvoiceItem[];
  notes?: string;
}

const VAT_RATE = 0.16; // 16% VAT for Kenya

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export function calculateTotals(items: InvoiceItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return { subtotal, vat, total };
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const { subtotal, vat, total } = calculateTotals(data.items);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber} - VeyraTech</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1F1F1F;
      padding: 40px 20px;
      background: #F9FAFB;
    }
    .invoice {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 3px solid #FC8436;
    }
    .company-info h1 {
      font-size: 36px;
      color: #FC8436;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .company-info .tagline {
      color: #666;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .company-info p { 
      color: #666; 
      font-size: 13px;
      line-height: 1.8;
    }
    .invoice-info { 
      text-align: right;
      min-width: 200px;
    }
    .invoice-info h2 {
      font-size: 24px;
      color: #1F1F1F;
      margin-bottom: 16px;
      font-weight: 700;
    }
    .invoice-info .invoice-number {
      font-size: 18px;
      color: #FC8436;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .invoice-info p { 
      color: #666; 
      margin-bottom: 4px;
      font-size: 13px;
    }
    .client-info {
      margin-bottom: 40px;
      padding: 24px;
      background: linear-gradient(135deg, #FFF5F0 0%, #F9FAFB 100%);
      border-radius: 8px;
      border-left: 4px solid #FC8436;
    }
    .client-info h3 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      color: #FC8436;
      font-weight: 600;
    }
    .client-info p { 
      color: #333; 
      margin-bottom: 6px;
      font-size: 14px;
    }
    .client-info strong {
      font-size: 16px;
      color: #1F1F1F;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    th {
      background: linear-gradient(135deg, #FC8436 0%, #E5702A 100%);
      padding: 16px 12px;
      text-align: left;
      font-weight: 600;
      color: white;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    th:first-child {
      border-radius: 8px 0 0 0;
    }
    th:last-child {
      border-radius: 0 8px 0 0;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #E5E7EB;
      color: #666;
      font-size: 14px;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover {
      background: #FAFAFA;
    }
    .text-right { text-align: right; }
    .item-description {
      color: #1F1F1F;
      font-weight: 500;
    }
    .totals {
      margin-left: auto;
      width: 350px;
      margin-top: 30px;
      background: #F9FAFB;
      padding: 24px;
      border-radius: 8px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 15px;
    }
    .totals-row:not(:last-child) {
      border-bottom: 1px solid #E5E7EB;
    }
    .totals-row span:first-child {
      color: #666;
    }
    .totals-row span:last-child {
      color: #1F1F1F;
      font-weight: 600;
    }
    .totals-row.vat {
      color: #666;
      font-size: 14px;
    }
    .totals-row.final {
      border-top: 3px solid #FC8436;
      border-bottom: none;
      font-size: 20px;
      font-weight: 700;
      padding-top: 20px;
      margin-top: 8px;
    }
    .totals-row.final span:first-child {
      color: #1F1F1F;
    }
    .totals-row.final span:last-child {
      color: #FC8436;
    }
    .notes {
      margin-top: 50px;
      padding: 24px;
      background: #FFF5F0;
      border-radius: 8px;
      border-left: 4px solid #FC8436;
    }
    .notes h3 {
      font-size: 14px;
      margin-bottom: 12px;
      color: #FC8436;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .notes p { 
      color: #666; 
      font-size: 14px;
      line-height: 1.8;
    }
    .payment-terms {
      margin-top: 30px;
      padding: 20px;
      background: #F0F9FF;
      border-radius: 8px;
      border-left: 4px solid #3B82F6;
    }
    .payment-terms h3 {
      font-size: 14px;
      color: #3B82F6;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .payment-terms ul {
      list-style: none;
      padding: 0;
    }
    .payment-terms li {
      color: #666;
      font-size: 13px;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    .payment-terms li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #3B82F6;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #E5E7EB;
      text-align: center;
    }
    .footer-thanks {
      font-size: 18px;
      color: #1F1F1F;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .footer p {
      color: #999;
      font-size: 12px;
      line-height: 1.8;
    }
    .footer-contact {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #E5E7EB;
    }
    @media print {
      body { background: white; padding: 0; }
      .invoice { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <!-- VeyraTech Logo -->
        <svg width="160" height="45" viewBox="0 0 160 45" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 12px;">
          <rect x="0" y="7" width="36" height="28" fill="#FC8436" rx="4"/>
          <path d="M 7 17 L 18 30 L 29 17" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="44" y="28" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FC8436">VeyraTech</text>
        </svg>
        <p class="tagline">Technology Consulting & AI Strategy</p>
        <p><strong>Location:</strong> Nairobi, Kenya</p>
        <p><strong>Phone:</strong> +254 745 247 211</p>
        <p><strong>Email:</strong> info@veyratech.co.ke</p>
        <p><strong>Website:</strong> www.veyratech.co.ke</p>
      </div>
      <div class="invoice-info">
        <h2>INVOICE</h2>
        <p class="invoice-number">${data.invoiceNumber}</p>
        <p><strong>Date:</strong> ${data.date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        })}</p>
        <p><strong>Due:</strong> ${new Date(data.date.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        })}</p>
      </div>
    </div>

    <!-- Client Info -->
    <div class="client-info">
      <h3>Bill To</h3>
      <p><strong>${data.clientName}</strong></p>
      ${data.clientCompany ? `<p>${data.clientCompany}</p>` : ''}
      <p>${data.clientEmail}</p>
      ${data.clientAddress ? `<p>${data.clientAddress}</p>` : ''}
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Unit Price (KSH)</th>
          <th class="text-right">Total (KSH)</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td class="item-description">${item.description}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${item.unitPrice.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="text-right">${item.total.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span>KSH ${subtotal.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="totals-row vat">
        <span>VAT (16%):</span>
        <span>KSH ${vat.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="totals-row final">
        <span>Total Due:</span>
        <span>KSH ${total.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>

    <!-- Payment Terms -->
    <div class="payment-terms">
      <h3>Payment Information</h3>
      <ul>
        <li>Payment is due within 30 days of invoice date</li>
        <li>M-Pesa: Send to +254 745 247 211</li>
        <li>Bank Transfer: Contact us for bank details</li>
        <li>All payments subject to 16% VAT (included above)</li>
      </ul>
    </div>

    <!-- Notes -->
    ${data.notes ? `
      <div class="notes">
        <h3>Additional Notes</h3>
        <p>${data.notes}</p>
      </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p class="footer-thanks">Thank you for your business!</p>
      <div class="footer-contact">
        <p><strong>VeyraTech</strong> • Technology Consulting & AI Strategy</p>
        <p>Nairobi, Kenya • +254 745 247 211 • info@veyratech.co.ke</p>
        <p>www.veyratech.co.ke</p>
      </div>
      <p style="margin-top: 20px; color: #999;">
        This is a computer-generated invoice and is valid without a signature.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
