# VeyraTech Admin Panel Features

## Overview
Complete admin panel for managing all aspects of the VeyraTech business including leads, consultations, proposals, projects, and content management.

---

## Core Management Features

### 1. Dashboard (`/admin`)
**File:** `app/admin/page.tsx`

**Function:**
- Displays real-time business metrics and statistics
- Shows total leads, new leads this month, prospects count
- Tracks pending consultations and active proposals
- Displays active projects count
- Lists recent leads with their status
- Provides quick navigation to all admin sections

**Key Metrics:**
- Total Leads
- New Leads This Month
- Total Prospects
- Pending Consultations
- Active Proposals
- Active Projects

---

### 2. Leads Management (`/admin/leads`)
**Files:** 
- `app/admin/leads/page.tsx` - Main list view
- `app/admin/leads/new/page.tsx` - Create new lead

**Function:**
- View all leads in a searchable/filterable table
- Track lead status: NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, WON, LOST
- Filter leads by status, date, company, or source
- Create new leads manually
- Update lead information
- Assign leads to different stages of the sales pipeline
- View lead history and interactions

**Lead Statuses:**
- NEW - Just received
- CONTACTED - Initial contact made
- QUALIFIED - Meets criteria for business
- PROPOSAL_SENT - Proposal submitted
- WON - Converted to client
- LOST - Did not convert

---

### 3. Prospects Management (`/admin/prospects`)
**Files:**
- `app/admin/prospects/page.tsx` - Main list view
- `app/admin/prospects/new/page.tsx` - Create new prospect

**Function:**
- Manage qualified leads that are now prospects
- Track prospect engagement and follow-ups
- View prospect details and communication history
- Update prospect status
- Convert prospects to clients/projects
- Set reminders for follow-ups

---

### 4. Consultations Management (`/admin/consultations`)
**Files:**
- `app/admin/consultations/page.tsx` - Main list view
- `app/admin/consultations/calendar/page.tsx` - Calendar view ⭐ NEW
- `app/admin/consultations/new/page.tsx` - Schedule new consultation
- `app/admin/consultations/[id]/page.tsx` - View/edit consultation
- `app/admin/consultations/ConsultationFilters.tsx` - Filter component
- `app/admin/consultations/[id]/ConsultationActions.tsx` - Action buttons

**Function:**
- View all consultation requests from website form
- Track consultation status: NEW, REVIEWING, CONTACTED, SCHEDULED, COMPLETED, CANCELLED
- Calendar view for scheduled consultations ⭐
- Filter by status, date, consultation type
- Assign consultations to team members
- Schedule meeting times
- Add meeting location (virtual/physical)
- Track consultation outcomes
- Export consultation data

**Consultation Types:**
- Technology Assessment
- AI Consulting
- Digital Transformation
- Custom Software Development
- General Inquiry

**Calendar View Features:** ⭐
- Month, week, and day views
- Drag-and-drop scheduling
- Color-coded by status
- Quick consultation details on hover

---

### 5. Contact Messages (`/admin/contact-messages`)
**File:** `app/admin/contact-messages/page.tsx`

**Function:**
- View all messages submitted via contact form
- Mark messages as read/unread
- Respond to inquiries
- Archive old messages
- Filter by date or status
- Export messages for reporting

---

## Communication Features

### 6. Email Composer (`/admin/emails`)
**Files:**
- `app/admin/emails/page.tsx` - Email interface
- `components/admin/EmailComposer.tsx` - Rich text editor

**Function:**
- Send emails to leads, prospects, or clients
- Use HTML email templates
- Personalize emails with recipient data
- Track sent emails
- Schedule emails for later
- Email templates for common scenarios:
  - Follow-up emails
  - Proposal submission
  - Meeting confirmations
  - Thank you notes

**Features:**
- Rich text editor
- Email templates
- Recipient selection from database
- CC/BCC support
- Attachment support
- Email preview before sending

---

### 7. Newsletter Management (`/admin/newsletters`) ⭐ NEW
**File:** `app/admin/newsletters/page.tsx`

**Function:**
- View all newsletter subscribers
- Track subscription status (Active/Inactive)
- View M-Pesa payment status for KSH 100 subscriptions
- Filter subscribers by status or date
- Export subscriber list
- View subscriber statistics:
  - Total subscribers
  - Active subscribers
  - Revenue from subscriptions
  - Recent subscriptions

**M-Pesa Integration:**
- Subscribers pay KSH 100 via M-Pesa
- Payment verification through Daraja API
- Automatic subscriber activation upon payment
- Payment history tracking

---

## Business Management

### 8. Proposals Management (`/admin/proposals`)
**Files:**
- `app/admin/proposals/page.tsx` - List all proposals
- `app/admin/proposals/new/page.tsx` - Create new proposal
- `app/admin/proposals/[id]/page.tsx` - Edit proposal
- `app/admin/proposals/[id]/preview/page.tsx` - Preview before sending ⭐
- `lib/proposals/generator.ts` - Professional proposal generator ⭐

**Function:**
- Create professional business proposals
- Track proposal status: DRAFT, SENT, VIEWED, ACCEPTED, REJECTED
- Generate proposals with VeyraTech branding ⭐
- Preview proposals before sending
- Send proposals via email
- Track when client views proposal
- Monitor proposal acceptance/rejection
- Version control for proposal revisions

**Proposal Features:** ⭐
- VeyraTech logo and branding
- Company details and contact information
- Customizable sections:
  - Executive Summary
  - Scope of Work
  - Timeline and Milestones
  - Pricing and Payment Terms
  - Terms and Conditions
- Professional PDF generation
- Digital signature support

---

### 9. Projects Management (`/admin/projects`)
**Files:**
- `app/admin/projects/page.tsx` - List all projects
- `app/admin/projects/new/page.tsx` - Create new project
- `app/admin/projects/[id]/page.tsx` - Project details

**Function:**
- Manage active and completed projects
- Track project status: PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
- Assign team members to projects
- Set project timelines and milestones
- Track project budget and expenses
- Monitor project progress
- Link projects to original leads/proposals
- Document project deliverables

**Project Tracking:**
- Start and end dates
- Current phase/milestone
- Budget vs actual costs
- Team member assignments
- Client communication logs
- File attachments and documentation

---

### 10. Invoice Generation (`/admin/invoices`) ⭐ NEW
**Files:**
- `app/api/admin/invoices/generate/route.ts` - Invoice generation API
- `lib/invoices/generator.ts` - Professional invoice templates ⭐

**Function:**
- Generate professional invoices for clients
- Automatic 16% VAT calculation
- VeyraTech branding and company details
- Multiple currency support (primarily KSH)
- Payment terms and conditions
- Invoice numbering system
- Due date tracking
- Payment status tracking

**Invoice Features:** ⭐
- Professional HTML templates
- Company logo and details
- Client information
- Itemized services/products
- Subtotal, VAT (16%), and total calculations
- Payment instructions
- Terms and conditions
- PDF export capability

---

## Analytics & Reporting

### 11. Analytics Dashboard (`/admin/analytics`) ⭐ ENHANCED
**Files:**
- `app/admin/analytics/page.tsx` - Main dashboard
- `app/api/admin/analytics/route.ts` - Analytics API
- `lib/analytics/tracker.ts` - Analytics utilities

**Function:**
- Comprehensive business analytics and insights
- Revenue tracking and forecasting
- Lead conversion metrics
- Client acquisition cost
- Time-based filters: 7, 30, 90, 365 days
- Visual charts and graphs using Recharts
- Export data for external analysis

**Metrics Tracked:**
- Total revenue over time
- Lead conversion rates
- Average deal size
- Sales pipeline velocity
- Consultation booking rates
- Proposal acceptance rates
- Project completion rates
- Newsletter subscriber growth

**Chart Types:**
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Area charts for cumulative data

---

## Content Management

### 12. Services Management (`/admin/services`)
**Files:**
- `app/admin/services/page.tsx` - List services
- `app/admin/services/new/page.tsx` - Add new service

**Function:**
- Manage service offerings displayed on website
- Add/edit/delete services
- Set service pricing and descriptions
- Toggle service visibility (active/inactive)
- Organize services by category
- Feature specific services on homepage
- SEO optimization for service pages

---

### 13. Industries Management (`/admin/industries`)
**Files:**
- `app/admin/industries/page.tsx` - List industries
- `app/admin/industries/new/page.tsx` - Add new industry

**Function:**
- Manage industry-specific solutions
- Create industry landing pages
- Assign case studies to industries
- Customize industry messaging
- Track industry-specific leads
- Industry-specific service packages

---

### 14. Insights/Blog Management (`/admin/insights`)
**Files:**
- `app/admin/insights/page.tsx` - List articles
- `app/admin/insights/new/page.tsx` - Create new article

**Function:**
- Create and publish blog posts/articles
- SEO optimization (meta tags, descriptions)
- Featured images
- Content categories and tags
- Publish/unpublish articles
- Schedule future publications
- Track article views and engagement
- Author management

**Content Features:**
- Rich text editor
- Image upload and management
- SEO metadata
- URL slug customization
- Social media preview
- Related articles suggestions

---

## Team & Settings

### 15. Team Management (`/admin/team`) ⭐ NEW
**File:** `app/admin/team/page.tsx`

**Function:**
- Manage team members and their access
- Role-Based Access Control (RBAC) ⭐
- Three access levels:
  - **ADMIN** - Full access to everything
  - **MANAGER** - Can view and edit most things, limited delete
  - **STAFF** - View-only access, can manage assigned tasks
- Invite new team members
- Assign roles and permissions
- Track team member activity
- Deactivate/remove team members

**RBAC Permissions:**
- Admins: Create, Read, Update, Delete everything
- Managers: Create, Read, Update (limited Delete)
- Staff: Read and Update assigned items only

---

### 16. Settings (`/admin/settings`)
**File:** `app/admin/settings/page.tsx`

**Function:**
- Configure general application settings
- Update company information
- Email settings configuration
- Notification preferences
- Integration settings (M-Pesa, Twilio, Resend)
- Backup and restore options
- Security settings

---

## Supporting Components

### Admin Sidebar
**File:** `components/admin/AdminSidebar.tsx`

**Function:**
- Navigation menu for all admin sections
- Active page highlighting
- Quick access to key features
- Responsive mobile menu
- User profile and logout

### Admin Header
**File:** `components/admin/AdminHeader.tsx`

**Function:**
- Top navigation bar
- User profile dropdown
- Logout functionality
- Notifications indicator

### Admin Layout
**File:** `app/admin/layout.tsx`

**Function:**
- Protected route - requires authentication
- Consistent layout across all admin pages
- Session management
- Automatic redirect to login if not authenticated

---

## API Endpoints

### Analytics API
- `GET /api/admin/analytics` - Fetch analytics data

### Invoice API
- `POST /api/admin/invoices/generate` - Generate invoice

### Proposal API
- `GET /api/admin/proposals` - List proposals
- `POST /api/admin/proposals/generate` - Generate proposal

### Newsletter API
- `GET /api/newsletter/status` - Check subscription status
- `POST /api/newsletter/subscribe` - Subscribe with M-Pesa

### Consultation API
- `GET /api/consultations/track` - Track consultation by email

### Cron Jobs
- `GET /api/cron/send-reminders` - Automated meeting reminders

---

## Authentication & Security

**File:** `lib/auth/config.ts`

**Features:**
- NextAuth.js integration
- Secure session management
- Role-based access control
- Password hashing with bcrypt
- Protected routes
- CSRF protection
- Rate limiting on sensitive endpoints

**Admin Access:**
- Email/password authentication
- Secure session tokens
- Automatic session expiry
- Remember me functionality
- Password reset flow

---

## Database Integration

**File:** `lib/prisma.ts`

**Features:**
- Prisma ORM for type-safe database queries
- Connection pooling optimization
- Transaction mode for better concurrency
- Error handling and reconnection logic
- Query performance optimization

---

## Summary

**Total Admin Features:** 16 core features
**New Features Added:** 7 (marked with ⭐)
**API Endpoints:** 8+ endpoints
**Components:** 20+ admin components
**Pages:** 30+ admin pages

**Key Enhancements:**
1. Newsletter management with M-Pesa
2. Consultation calendar view
3. Analytics dashboard with charts
4. Invoice generator (16% VAT)
5. Proposal generator with branding
6. Team management with RBAC
7. Enhanced email system

All features are fully integrated with the database, authenticated, and ready for production use.
