-- ============================================================
-- COMPLETE VEYRATECH DATABASE SCHEMA
-- PostgreSQL Database with all tables and initial data
-- Includes: CRM, Learning Module, Invoicing, and all features
-- ============================================================

-- Run this file to create the complete database from scratch
-- psql $DATABASE_URL -f COMPLETE_DATABASE_SCHEMA.sql

BEGIN;

-- ============================================================
-- ENUMS
-- ============================================================

-- Admin Status
CREATE TYPE admin_status AS ENUM ('ACTIVE', 'INACTIVE');

-- Industry
CREATE TYPE industry AS ENUM (
  'REAL_ESTATE', 'CONSTRUCTION', 'FINANCE', 'BANKING', 'INSURANCE',
  'RETAIL', 'HEALTHCARE', 'HOSPITALITY', 'EDUCATION', 'MANUFACTURING',
  'LOGISTICS_TRANSPORT', 'AGRICULTURE', 'PROFESSIONAL_SERVICES',
  'TECHNOLOGY', 'MEDIA_ENTERTAINMENT', 'ECOMMERCE', 'GOVERNMENT_NGO', 'OTHER'
);

-- Company Size
CREATE TYPE company_size AS ENUM (
  'SIZE_1_10', 'SIZE_11_50', 'SIZE_51_100', 'SIZE_101_500', 'SIZE_500_PLUS'
);

-- Service Area
CREATE TYPE service_area AS ENUM (
  'WEBSITE_DEVELOPMENT', 'CUSTOM_SOFTWARE', 'BUSINESS_SYSTEMS',
  'POS_INVENTORY', 'MOBILE_APPS', 'SYSTEM_INTEGRATION',
  'AI_AUTOMATION', 'TECHNOLOGY_CONSULTING', 'NOT_SURE'
);

-- Lead Source
CREATE TYPE lead_source AS ENUM (
  'WEBSITE', 'EMAIL', 'PHONE', 'LINKEDIN', 'REFERRAL', 'EVENT',
  'DIRECT_OUTREACH', 'OTHER'
);

-- Lead Status
CREATE TYPE lead_status AS ENUM (
  'NEW', 'CONTACTED', 'QUALIFIED', 'CONSULTATION', 'PROPOSAL',
  'NEGOTIATION', 'WON', 'LOST', 'NURTURE'
);

-- Priority
CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- Prospect Status
CREATE TYPE prospect_status AS ENUM (
  'NOT_CONTACTED', 'EMAIL_SENT', 'CALL_MADE', 'REPLIED', 'MEETING',
  'QUALIFIED', 'FOLLOW_UP', 'NOT_INTERESTED', 'CONVERTED'
);

-- Consultation Status
CREATE TYPE consultation_status AS ENUM (
  'NEW', 'REVIEWING', 'CONTACTED', 'SCHEDULED', 'COMPLETED',
  'CANCELLED', 'CONVERTED', 'NO_SHOW'
);

-- Consultation Type
CREATE TYPE consultation_type AS ENUM (
  'WEBSITE_DEVELOPMENT', 'SOFTWARE_DEVELOPMENT', 'BUSINESS_SYSTEM',
  'POS_SYSTEM', 'MOBILE_APP', 'SYSTEM_INTEGRATION', 'AI_AUTOMATION',
  'TECHNOLOGY_CONSULTING', 'DIGITAL_TRANSFORMATION', 'TECHNOLOGY_AUDIT',
  'CUSTOM_SOLUTION', 'OTHER'
);

-- Consultation Outcome
CREATE TYPE consultation_outcome AS ENUM (
  'PROPOSAL_REQUIRED', 'FOLLOW_UP_MEETING', 'ASSESSMENT_REQUIRED',
  'SEND_QUOTATION', 'IMPLEMENTATION_OPPORTUNITY', 'CLIENT_NOT_READY',
  'NOT_QUALIFIED', 'COMPLETED', 'OTHER'
);

-- Proposal Status
CREATE TYPE proposal_status AS ENUM (
  'DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED'
);

-- Project Status
CREATE TYPE project_status AS ENUM (
  'PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'
);

-- Project Stage
CREATE TYPE project_stage AS ENUM (
  'DISCOVERY', 'ASSESSMENT', 'STRATEGY', 'DESIGN', 'IMPLEMENTATION',
  'TESTING', 'DEPLOYMENT', 'OPTIMIZATION'
);

-- Insight Category
CREATE TYPE insight_category AS ENUM (
  'TECHNOLOGY_STRATEGY', 'ARTIFICIAL_INTELLIGENCE', 'AUTOMATION',
  'DIGITAL_TRANSFORMATION', 'BUSINESS_TECHNOLOGY', 'DATA',
  'CYBERSECURITY', 'CONSULTING'
);

-- Insight Status
CREATE TYPE insight_status AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- Document Type
CREATE TYPE document_type AS ENUM (
  'PROPOSAL', 'CONTRACT', 'ASSESSMENT', 'REPORT', 'PRESENTATION', 'OTHER'
);

-- Audit Action
CREATE TYPE audit_action AS ENUM (
  'ADMIN_LOGIN', 'FAILED_LOGIN', 'LEAD_CREATED', 'LEAD_UPDATED',
  'PROSPECT_CREATED', 'PROSPECT_UPDATED', 'CONSULTATION_CREATED',
  'CONSULTATION_UPDATED', 'PROPOSAL_CREATED', 'PROPOSAL_SENT',
  'PROPOSAL_ACCEPTED', 'PROJECT_CREATED', 'PROJECT_UPDATED',
  'DOCUMENT_UPLOADED', 'DOCUMENT_DELETED', 'INSIGHT_PUBLISHED',
  'SERVICE_UPDATED', 'SETTINGS_CHANGED'
);

-- Invoice Status
CREATE TYPE invoice_status AS ENUM (
  'DRAFT', 'SENT', 'VIEWED', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'
);

-- Payment Status
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- ============================================================
-- ADMIN & AUTHENTICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status admin_status DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_status ON admins(status);

-- ============================================================
-- CRM - LEADS
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    industry industry,
    company_size company_size,
    service_interest service_area,
    business_challenge TEXT,
    lead_source lead_source DEFAULT 'WEBSITE',
    status lead_status DEFAULT 'NEW',
    priority priority DEFAULT 'MEDIUM',
    assigned_admin_id TEXT REFERENCES admins(id),
    last_contact_at TIMESTAMP,
    next_follow_up_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_admin ON leads(assigned_admin_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- ============================================================
-- CRM - PROSPECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS prospects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company TEXT NOT NULL,
    industry industry,
    website TEXT,
    contact_person TEXT NOT NULL,
    job_title TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    linked_in TEXT,
    research_notes TEXT,
    problem_hypothesis TEXT,
    priority priority DEFAULT 'MEDIUM',
    contact_status prospect_status DEFAULT 'NOT_CONTACTED',
    assigned_admin_id TEXT REFERENCES admins(id),
    last_contact_at TIMESTAMP,
    next_follow_up_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prospects_email ON prospects(email);
CREATE INDEX idx_prospects_status ON prospects(contact_status);
CREATE INDEX idx_prospects_assigned_admin ON prospects(assigned_admin_id);

-- ============================================================
-- CRM - CONSULTATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    consultation_type consultation_type NOT NULL,
    preferred_date TIMESTAMP,
    preferred_time TEXT,
    meeting_type TEXT,
    business_challenge TEXT NOT NULL,
    current_solution TEXT,
    expected_outcome TEXT,
    budget_range TEXT,
    timeline TEXT,
    additional_info TEXT,
    status consultation_status DEFAULT 'NEW',
    priority priority DEFAULT 'MEDIUM',
    assigned_admin_id TEXT REFERENCES admins(id),
    lead_id TEXT REFERENCES leads(id),
    scheduled_date TIMESTAMP,
    consultation_notes TEXT,
    outcome consultation_outcome,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consultations_email ON consultations(email);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_assigned_admin ON consultations(assigned_admin_id);
CREATE INDEX idx_consultations_lead ON consultations(lead_id);

-- ============================================================
-- CRM - PROPOSALS
-- ============================================================

CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    lead_id TEXT REFERENCES leads(id),
    consultation_id TEXT REFERENCES consultations(id),
    admin_id TEXT REFERENCES admins(id),
    status proposal_status DEFAULT 'DRAFT',
    total_value DECIMAL(15, 2),
    valid_until DATE,
    content TEXT,
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    accepted_at TIMESTAMP,
    rejected_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proposals_lead ON proposals(lead_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- ============================================================
-- CRM - PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    lead_id TEXT REFERENCES leads(id),
    proposal_id TEXT REFERENCES proposals(id),
    admin_id TEXT REFERENCES admins(id),
    status project_status DEFAULT 'PLANNING',
    stage project_stage DEFAULT 'DISCOVERY',
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    budget DECIMAL(15, 2),
    progress_percentage INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_lead ON projects(lead_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_admin ON projects(admin_id);

-- ============================================================
-- CRM - ASSESSMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_id TEXT REFERENCES leads(id),
    admin_id TEXT REFERENCES admins(id),
    assessment_type TEXT NOT NULL,
    findings TEXT NOT NULL,
    recommendations TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_lead ON assessments(lead_id);

-- ============================================================
-- CRM - DOCUMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lead_id TEXT REFERENCES leads(id),
    proposal_id TEXT REFERENCES proposals(id),
    project_id TEXT REFERENCES projects(id),
    admin_id TEXT REFERENCES admins(id),
    title TEXT NOT NULL,
    document_type document_type NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_lead ON documents(lead_id);
CREATE INDEX idx_documents_project ON documents(project_id);

-- ============================================================
-- CONTENT - INSIGHTS
-- ============================================================

CREATE TABLE IF NOT EXISTS insights (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category insight_category NOT NULL,
    tags TEXT[],
    featured_image TEXT,
    status insight_status DEFAULT 'DRAFT',
    admin_id TEXT REFERENCES admins(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_insights_slug ON insights(slug);
CREATE INDEX idx_insights_status ON insights(status);
CREATE INDEX idx_insights_category ON insights(category);

-- ============================================================
-- SERVICES & INDUSTRIES
-- ============================================================

CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    features TEXT[],
    benefits TEXT[],
    typical_timeline TEXT,
    starting_price TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_active ON services(is_active);

CREATE TABLE IF NOT EXISTS industries_served (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    challenges TEXT[],
    solutions TEXT[],
    case_study_title TEXT,
    case_study_description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_industries_slug ON industries_served(slug);
CREATE INDEX idx_industries_active ON industries_served(is_active);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    admin_id TEXT REFERENCES admins(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_admin ON notifications(admin_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    admin_id TEXT REFERENCES admins(id),
    action audit_action NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================================
-- INVOICING & BILLING
-- ============================================================

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_number TEXT UNIQUE NOT NULL,
    lead_id TEXT REFERENCES leads(id),
    project_id TEXT REFERENCES projects(id),
    proposal_id TEXT REFERENCES proposals(id),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_address TEXT,
    status invoice_status DEFAULT 'DRAFT',
    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'KES',
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_lead ON invoices(lead_id);

CREATE TABLE IF NOT EXISTS invoice_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    status payment_status DEFAULT 'PENDING',
    payment_date TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================
-- LEARNING MODULE - APPLICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    country TEXT NOT NULL,
    education_level TEXT NOT NULL,
    institution TEXT NOT NULL,
    field_of_study TEXT,
    programme TEXT NOT NULL,
    motivation TEXT NOT NULL,
    previous_experience TEXT,
    learning_goals TEXT,
    referral_source TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'WAITLISTED')),
    reviewed_by TEXT REFERENCES admins(id),
    reviewed_at TIMESTAMP,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- ============================================================
-- LEARNING MODULE - PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_type TEXT NOT NULL CHECK (user_type IN ('STUDENT', 'MENTOR')),
    student_id TEXT UNIQUE,
    mentor_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    profile_image TEXT,
    bio TEXT,
    date_of_birth DATE,
    education_level TEXT,
    institution TEXT,
    field_of_study TEXT,
    linkedin_profile TEXT,
    github_profile TEXT,
    portfolio_url TEXT,
    expertise_areas TEXT[],
    availability_status TEXT DEFAULT 'AVAILABLE',
    max_mentees INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_learning_profiles_email ON learning_profiles(email);
CREATE INDEX idx_learning_profiles_student_id ON learning_profiles(student_id);
CREATE INDEX idx_learning_profiles_mentor_id ON learning_profiles(mentor_id);

-- ============================================================
-- LEARNING MODULE - PROGRAMMES
-- ============================================================

CREATE TABLE IF NOT EXISTS programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    max_students INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- LEARNING MODULE - MODULES
-- ============================================================

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration_weeks INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_modules_programme_id ON modules(programme_id);

-- ============================================================
-- LEARNING MODULE - LESSONS
-- ============================================================

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    content TEXT,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('VIDEO', 'READING', 'EXERCISE', 'QUIZ', 'PROJECT')),
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    resources JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_module_id ON lessons(module_id);

-- ============================================================
-- LEARNING MODULE - ASSIGNMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    due_date TIMESTAMP,
    max_points INTEGER DEFAULT 100,
    rubric JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_lesson_id ON assignments(lesson_id);

-- ============================================================
-- LEARNING MODULE - ENROLLMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES learning_profiles(id) ON DELETE CASCADE,
    programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, programme_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_programme_id ON enrollments(programme_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- ============================================================
-- LEARNING MODULE - MENTOR ASSIGNMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS mentor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES learning_profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES learning_profiles(id) ON DELETE CASCADE,
    programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mentor_id, student_id, programme_id)
);

CREATE INDEX idx_mentor_assignments_mentor_id ON mentor_assignments(mentor_id);
CREATE INDEX idx_mentor_assignments_student_id ON mentor_assignments(student_id);

-- ============================================================
-- LEARNING MODULE - SUBMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES learning_profiles(id) ON DELETE CASCADE,
    content TEXT,
    attachments TEXT[],
    status TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'GRADED', 'RESUBMISSION_REQUIRED')),
    grade INTEGER,
    feedback TEXT,
    graded_by UUID REFERENCES learning_profiles(id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================================
-- LEARNING MODULE - MENTORSHIP SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_assignment_id UUID NOT NULL REFERENCES mentor_assignments(id) ON DELETE CASCADE,
    session_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    topic TEXT,
    notes TEXT,
    homework TEXT,
    status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentorship_sessions_mentor_assignment_id ON mentorship_sessions(mentor_assignment_id);
CREATE INDEX idx_mentorship_sessions_session_date ON mentorship_sessions(session_date);
CREATE INDEX idx_mentorship_sessions_status ON mentorship_sessions(status);

-- ============================================================
-- INITIAL DATA - SERVICES
-- ============================================================

INSERT INTO services (id, name, slug, description, features, benefits, typical_timeline, starting_price, display_order, is_active) VALUES
('srv-web-dev', 'Website Development', 'website-development', 'Professional, responsive websites that look great and drive results', 
 ARRAY['Responsive Design', 'SEO Optimization', 'Fast Loading', 'Mobile-First', 'CMS Integration'],
 ARRAY['Professional online presence', 'Reach more customers', 'Build credibility', 'Generate leads'],
 '2-4 weeks', 'KES 50,000', 1, true),
 
('srv-custom-soft', 'Custom Software Development', 'custom-software', 'Tailored software solutions built specifically for your business needs',
 ARRAY['Custom Features', 'Scalable Architecture', 'API Integration', 'Cloud Deployment', 'Ongoing Support'],
 ARRAY['Automate workflows', 'Increase efficiency', 'Reduce costs', 'Scale easily'],
 '6-12 weeks', 'KES 200,000', 2, true),
 
('srv-business-sys', 'Business Management Systems', 'business-systems', 'Complete systems to manage operations, inventory, customers, and more',
 ARRAY['Inventory Management', 'Customer Management', 'Reporting & Analytics', 'User Roles', 'Cloud-Based'],
 ARRAY['Centralize operations', 'Real-time insights', 'Better decision making', 'Improve productivity'],
 '8-16 weeks', 'KES 300,000', 3, true),
 
('srv-pos', 'POS & Inventory Systems', 'pos-inventory', 'Modern point-of-sale and inventory management for retail businesses',
 ARRAY['Sales Processing', 'Inventory Tracking', 'Reporting', 'Multi-Location', 'Receipt Printing'],
 ARRAY['Track stock automatically', 'Prevent stockouts', 'Understand sales patterns', 'Reduce theft'],
 '4-6 weeks', 'KES 100,000', 4, true),
 
('srv-mobile', 'Mobile Applications', 'mobile-apps', 'Native and cross-platform mobile apps for iOS and Android',
 ARRAY['iOS & Android', 'Push Notifications', 'Offline Support', 'App Store Deployment', 'Analytics'],
 ARRAY['Reach mobile users', 'Increase engagement', 'Build loyalty', 'Generate revenue'],
 '10-16 weeks', 'KES 400,000', 5, true),
 
('srv-integration', 'System Integration', 'system-integration', 'Connect your existing systems and automate data flow between them',
 ARRAY['API Development', 'Data Sync', 'Workflow Automation', 'Error Handling', 'Monitoring'],
 ARRAY['Eliminate manual data entry', 'Reduce errors', 'Save time', 'Improve accuracy'],
 '4-8 weeks', 'KES 150,000', 6, true),
 
('srv-ai-auto', 'AI & Automation', 'ai-automation', 'Intelligent automation and AI features to enhance your business',
 ARRAY['Process Automation', 'AI Integration', 'Chatbots', 'Predictive Analytics', 'Machine Learning'],
 ARRAY['Work smarter', 'Reduce repetitive tasks', 'Better insights', 'Competitive advantage'],
 '6-10 weeks', 'KES 250,000', 7, true);

-- ============================================================
-- INITIAL DATA - INDUSTRIES
-- ============================================================

INSERT INTO industries_served (id, name, slug, description, challenges, solutions, display_order, is_active) VALUES
('ind-retail', 'Retail & E-commerce', 'retail', 'Technology solutions for retail stores and online businesses',
 ARRAY['Inventory management', 'Sales tracking', 'Customer loyalty', 'Online presence'],
 ARRAY['POS systems', 'E-commerce platforms', 'Inventory automation', 'Customer management'],
 1, true),
 
('ind-healthcare', 'Healthcare', 'healthcare', 'Digital solutions for clinics, hospitals, and healthcare providers',
 ARRAY['Patient management', 'Appointment scheduling', 'Record keeping', 'Compliance'],
 ARRAY['Practice management systems', 'Patient portals', 'Electronic health records'],
 2, true),
 
('ind-hospitality', 'Hospitality', 'hospitality', 'Technology for hotels, restaurants, and hospitality businesses',
 ARRAY['Booking management', 'Customer service', 'Operations efficiency', 'Online presence'],
 ARRAY['Booking systems', 'POS solutions', 'Customer management', 'Websites'],
 3, true),
 
('ind-education', 'Education', 'education', 'Learning management and school administration systems',
 ARRAY['Student management', 'Online learning', 'Parent communication', 'Administration'],
 ARRAY['Student portals', 'Learning platforms', 'School management systems'],
 4, true),
 
('ind-finance', 'Finance & Banking', 'finance', 'Secure solutions for financial services',
 ARRAY['Security', 'Compliance', 'Transaction processing', 'Reporting'],
 ARRAY['Secure platforms', 'Automated workflows', 'Reporting systems'],
 5, true),
 
('ind-real-estate', 'Real Estate', 'real-estate', 'Property management and real estate platforms',
 ARRAY['Property listings', 'Client management', 'Document handling', 'Marketing'],
 ARRAY['Property portals', 'CRM systems', 'Document management'],
 6, true);

-- ============================================================
-- INITIAL DATA - LEARNING PROGRAMMES
-- ============================================================

INSERT INTO programmes (id, name, description, duration_weeks, level, prerequisites, learning_outcomes, status, max_students) VALUES
(gen_random_uuid(), 
 'Web Development Fundamentals', 
 'Master HTML, CSS, JavaScript, and modern web development. Build real-world projects and launch your tech career.',
 12,
 'BEGINNER',
 ARRAY['Basic computer skills', 'Access to a laptop'],
 ARRAY['Build responsive websites from scratch', 'Master JavaScript and modern frameworks', 'Create interactive web applications', 'Deploy projects to production'],
 'ACTIVE',
 30),

(gen_random_uuid(),
 'Cybersecurity Fundamentals',
 'Learn security principles, ethical hacking, and system protection. Become a cybersecurity professional.',
 16,
 'BEGINNER',
 ARRAY['Basic IT knowledge', 'Understanding of networks'],
 ARRAY['Understand security principles', 'Perform security assessments', 'Implement security measures', 'Handle security incidents'],
 'ACTIVE',
 20),

(gen_random_uuid(),
 'Data Science & Analytics',
 'Python, data analysis, machine learning basics, and business intelligence.',
 14,
 'INTERMEDIATE',
 ARRAY['Basic programming knowledge', 'Mathematics fundamentals'],
 ARRAY['Analyze data with Python', 'Create visualizations', 'Build ML models', 'Make data-driven decisions'],
 'ACTIVE',
 25),

(gen_random_uuid(),
 'Mobile App Development',
 'Build iOS and Android apps with React Native. Create cross-platform mobile applications.',
 12,
 'INTERMEDIATE',
 ARRAY['JavaScript knowledge', 'Web development basics'],
 ARRAY['Build mobile apps', 'Publish to app stores', 'Handle user data', 'Integrate APIs'],
 'ACTIVE',
 20);

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Show all tables
SELECT 
    schemaname, 
    tablename,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename) as column_count
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Show all enums
SELECT 
    t.typname as enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY t.typname
ORDER BY t.typname;

-- Show record counts
SELECT 'services' as table_name, COUNT(*) as records FROM services
UNION ALL
SELECT 'industries_served', COUNT(*) FROM industries_served
UNION ALL
SELECT 'programmes', COUNT(*) FROM programmes
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;

-- Success message
SELECT '✅ Database schema created successfully!' as status;
SELECT '📊 Total tables: ' || COUNT(*) FROM pg_tables WHERE schemaname = 'public' as info;
