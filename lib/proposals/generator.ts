/**
 * Professional Proposal Generator
 * Generate branded proposals with VeyraTech logo and company details
 */

interface ProposalSection {
  title: string;
  content: string;
}

interface ProposalData {
  // Client Information
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAddress?: string;
  
  // Proposal Details
  proposalNumber: string;
  proposalDate: Date;
  validUntil: Date;
  title: string;
  
  // Content Sections
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string;
  scope: string;
  deliverables: string[];
  timeline: string;
  investment: string;
  
  // Optional Sections
  methodology?: string;
  team?: string;
  caseStudies?: string;
  terms?: string;
  nextSteps?: string;
}

// VeyraTech Company Information
const COMPANY_INFO = {
  name: 'VeyraTech',
  tagline: 'Technology Consulting & AI Strategy',
  website: 'www.veyratech.co.ke',
  email: 'info@veyratech.co.ke',
  phone: '+254 XXX XXX XXX', // Update with actual phone
  address: 'Nairobi, Kenya',
  // Logo will be embedded as base64 or external URL
  logo: '/logo.png', // Path to logo
  color: {
    primary: '#FC8436',
    secondary: '#1F1F1F',
    accent: '#FFFFFF',
  },
};

/**
 * Generate proposal number
 */
export function generateProposalNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PROP-${year}${month}-${random}`;
}

/**
 * Generate professional proposal HTML
 */
export function generateProposalHTML(data: ProposalData): string {
  const deliverablesList = data.deliverables
    .map((item, index) => `<li><strong>Deliverable ${index + 1}:</strong> ${item}</li>`)
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal - ${data.proposalNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1F1F1F;
      background: #FFFFFF;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
    }
    
    /* Header with Logo */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 30px;
      border-bottom: 4px solid ${COMPANY_INFO.color.primary};
      margin-bottom: 40px;
    }
    
    .logo-section {
      flex: 1;
    }
    
    .logo {
      width: 180px;
      height: auto;
      margin-bottom: 10px;
    }
    
    .company-name {
      font-size: 32px;
      font-weight: bold;
      color: ${COMPANY_INFO.color.primary};
      margin-bottom: 5px;
    }
    
    .company-tagline {
      font-size: 14px;
      color: #666;
      font-style: italic;
    }
    
    .company-details {
      text-align: right;
      font-size: 13px;
      color: #666;
      line-height: 1.8;
    }
    
    .company-details strong {
      color: #1F1F1F;
    }
    
    /* Proposal Title Section */
    .proposal-title-section {
      background: linear-gradient(135deg, ${COMPANY_INFO.color.primary} 0%, ${COMPANY_INFO.color.secondary} 100%);
      color: white;
      padding: 40px;
      border-radius: 8px;
      margin-bottom: 40px;
      text-align: center;
    }
    
    .proposal-label {
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    
    .proposal-title {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    
    .proposal-meta {
      display: flex;
      justify-content: center;
      gap: 30px;
      font-size: 14px;
      opacity: 0.95;
    }
    
    /* Client Information */
    .client-info {
      background: #F9FAFB;
      padding: 30px;
      border-left: 4px solid ${COMPANY_INFO.color.primary};
      margin-bottom: 40px;
      border-radius: 4px;
    }
    
    .client-info h2 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .client-info .client-name {
      font-size: 24px;
      font-weight: bold;
      color: #1F1F1F;
      margin-bottom: 5px;
    }
    
    .client-info .client-company {
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .client-info .contact-details {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
    }
    
    /* Content Sections */
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: ${COMPANY_INFO.color.secondary};
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${COMPANY_INFO.color.primary};
    }
    
    .section-content {
      font-size: 15px;
      line-height: 1.8;
      color: #333;
      text-align: justify;
    }
    
    .section-content p {
      margin-bottom: 12px;
    }
    
    /* Deliverables List */
    .deliverables-list {
      list-style: none;
      padding: 0;
    }
    
    .deliverables-list li {
      padding: 15px;
      margin-bottom: 10px;
      background: #F9FAFB;
      border-left: 3px solid ${COMPANY_INFO.color.primary};
      border-radius: 4px;
    }
    
    /* Investment Highlight */
    .investment-box {
      background: linear-gradient(135deg, ${COMPANY_INFO.color.primary} 0%, #E07530 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
    }
    
    .investment-box h3 {
      font-size: 18px;
      margin-bottom: 15px;
      opacity: 0.95;
    }
    
    .investment-box .amount {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .investment-box .details {
      font-size: 14px;
      opacity: 0.9;
    }
    
    /* Timeline */
    .timeline {
      background: #F9FAFB;
      padding: 25px;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
    }
    
    /* Terms Box */
    .terms-box {
      background: #FEF3C7;
      border: 1px solid #F59E0B;
      border-left: 4px solid #F59E0B;
      padding: 20px;
      border-radius: 4px;
      margin: 30px 0;
    }
    
    .terms-box h4 {
      color: #92400E;
      margin-bottom: 10px;
    }
    
    /* Call to Action */
    .cta-section {
      background: ${COMPANY_INFO.color.secondary};
      color: white;
      padding: 40px;
      text-align: center;
      border-radius: 8px;
      margin: 40px 0;
    }
    
    .cta-section h3 {
      font-size: 28px;
      margin-bottom: 15px;
    }
    
    .cta-section p {
      font-size: 16px;
      margin-bottom: 25px;
      opacity: 0.95;
    }
    
    .cta-button {
      display: inline-block;
      background: ${COMPANY_INFO.color.primary};
      color: white;
      padding: 15px 40px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      transition: background 0.3s;
    }
    
    /* Footer */
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #E5E7EB;
      text-align: center;
      font-size: 13px;
      color: #666;
    }
    
    .footer .company-name-footer {
      font-weight: bold;
      color: ${COMPANY_INFO.color.primary};
      font-size: 16px;
      margin-bottom: 10px;
    }
    
    .footer-links {
      margin-top: 15px;
    }
    
    .footer-links a {
      color: ${COMPANY_INFO.color.primary};
      text-decoration: none;
      margin: 0 10px;
    }
    
    /* Print Styles */
    @media print {
      body {
        background: white;
      }
      
      .container {
        padding: 0;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .cta-button {
        display: none;
      }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 15px;
      }
      
      .header {
        flex-direction: column;
      }
      
      .company-details {
        text-align: left;
        margin-top: 20px;
      }
      
      .proposal-meta {
        flex-direction: column;
        gap: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header with Logo & Company Details -->
    <div class="header">
      <div class="logo-section">
        <!-- VeyraTech Logo -->
        <svg width="180" height="50" viewBox="0 0 180 50" xmlns="http://www.w3.org/2000/svg" class="logo">
          <rect x="0" y="10" width="40" height="30" fill="${COMPANY_INFO.color.primary}" rx="4"/>
          <path d="M 8 20 L 20 35 L 32 20" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="50" y="32" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${COMPANY_INFO.color.primary}">${COMPANY_INFO.name}</text>
        </svg>
        <div class="company-tagline">${COMPANY_INFO.tagline}</div>
      </div>
      
      <div class="company-details">
        <strong>VeyraTech Limited</strong><br>
        ${COMPANY_INFO.address}<br>
        <strong>Email:</strong> ${COMPANY_INFO.email}<br>
        <strong>Phone:</strong> ${COMPANY_INFO.phone}<br>
        <strong>Web:</strong> ${COMPANY_INFO.website}
      </div>
    </div>
    
    <!-- Proposal Title Section -->
    <div class="proposal-title-section">
      <div class="proposal-label">Technology Consulting Proposal</div>
      <div class="proposal-title">${data.title}</div>
      <div class="proposal-meta">
        <div><strong>Proposal #:</strong> ${data.proposalNumber}</div>
        <div><strong>Date:</strong> ${data.proposalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div><strong>Valid Until:</strong> ${data.validUntil.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </div>
    
    <!-- Client Information -->
    <div class="client-info">
      <h2>Prepared For</h2>
      <div class="client-name">${data.clientName}</div>
      <div class="client-company">${data.clientCompany}</div>
      <div class="contact-details">
        <strong>Email:</strong> ${data.clientEmail}<br>
        ${data.clientAddress ? `<strong>Address:</strong> ${data.clientAddress}` : ''}
      </div>
    </div>
    
    <!-- Executive Summary -->
    <div class="section">
      <h2 class="section-title">Executive Summary</h2>
      <div class="section-content">
        ${data.executiveSummary}
      </div>
    </div>
    
    <!-- Problem Statement -->
    <div class="section">
      <h2 class="section-title">Understanding Your Challenge</h2>
      <div class="section-content">
        ${data.problemStatement}
      </div>
    </div>
    
    <!-- Proposed Solution -->
    <div class="section">
      <h2 class="section-title">Our Proposed Solution</h2>
      <div class="section-content">
        ${data.proposedSolution}
      </div>
    </div>
    
    ${data.methodology ? `
    <!-- Methodology -->
    <div class="section">
      <h2 class="section-title">Our Methodology</h2>
      <div class="section-content">
        ${data.methodology}
      </div>
    </div>
    ` : ''}
    
    <!-- Scope of Work -->
    <div class="section">
      <h2 class="section-title">Scope of Work</h2>
      <div class="section-content">
        ${data.scope}
      </div>
    </div>
    
    <!-- Deliverables -->
    <div class="section">
      <h2 class="section-title">Deliverables</h2>
      <ul class="deliverables-list">
        ${deliverablesList}
      </ul>
    </div>
    
    <!-- Timeline -->
    <div class="section">
      <h2 class="section-title">Project Timeline</h2>
      <div class="timeline">
        ${data.timeline}
      </div>
    </div>
    
    ${data.team ? `
    <!-- Team -->
    <div class="section">
      <h2 class="section-title">Your Team</h2>
      <div class="section-content">
        ${data.team}
      </div>
    </div>
    ` : ''}
    
    ${data.caseStudies ? `
    <!-- Case Studies -->
    <div class="section">
      <h2 class="section-title">Relevant Experience</h2>
      <div class="section-content">
        ${data.caseStudies}
      </div>
    </div>
    ` : ''}
    
    <!-- Investment -->
    <div class="section">
      <h2 class="section-title">Investment</h2>
      <div class="investment-box">
        <h3>Total Project Investment</h3>
        <div class="amount">${data.investment}</div>
        <div class="details">Payment terms and detailed breakdown available upon request</div>
      </div>
    </div>
    
    ${data.terms ? `
    <!-- Terms & Conditions -->
    <div class="section">
      <div class="terms-box">
        <h4>Important Terms & Conditions</h4>
        <div class="section-content">
          ${data.terms}
        </div>
      </div>
    </div>
    ` : ''}
    
    ${data.nextSteps ? `
    <!-- Next Steps -->
    <div class="section">
      <h2 class="section-title">Next Steps</h2>
      <div class="section-content">
        ${data.nextSteps}
      </div>
    </div>
    ` : ''}
    
    <!-- Call to Action -->
    <div class="cta-section">
      <h3>Ready to Transform Your Business?</h3>
      <p>Let's schedule a call to discuss this proposal in detail and answer any questions you may have.</p>
      <a href="mailto:${COMPANY_INFO.email}?subject=Proposal%20${data.proposalNumber}%20Discussion" class="cta-button">
        Let's Talk
      </a>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="company-name-footer">${COMPANY_INFO.name}</div>
      <p>Empowering businesses through strategic technology adoption</p>
      <div class="footer-links">
        <a href="https://${COMPANY_INFO.website}">Website</a> |
        <a href="mailto:${COMPANY_INFO.email}">Email</a> |
        <a href="tel:${COMPANY_INFO.phone}">Call Us</a>
      </div>
      <p style="margin-top: 20px; font-size: 12px;">
        This proposal is confidential and intended solely for ${data.clientCompany}.<br>
        © ${new Date().getFullYear()} ${COMPANY_INFO.name}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate proposal from existing proposal data in database
 */
export function generateProposalFromDB(proposal: any): ProposalData {
  const proposalDate = new Date();
  const validUntil = proposal.expirationDate 
    ? new Date(proposal.expirationDate) 
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return {
    clientName: proposal.lead?.name || 'Valued Client',
    clientCompany: proposal.clientCompany,
    clientEmail: proposal.lead?.email || '',
    proposalNumber: generateProposalNumber(),
    proposalDate,
    validUntil,
    title: proposal.title,
    executiveSummary: `We are pleased to present this proposal for ${proposal.clientCompany}. After careful analysis of your requirements, we have developed a comprehensive solution that addresses your technology challenges and business objectives.`,
    problemStatement: proposal.problem,
    proposedSolution: proposal.objectives,
    scope: proposal.scope,
    deliverables: proposal.deliverables.split('\n').filter((d: string) => d.trim()),
    timeline: proposal.timeline,
    investment: proposal.investment,
    terms: proposal.terms || undefined,
  };
}
