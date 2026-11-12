/**
 * Admin record definitions (client-safe: no Prisma import).
 *
 * One place that describes which fields of each record an admin may edit.
 * Used by:
 *  - lib/admin/crud.ts            (server: validation + Prisma update/delete)
 *  - components/admin/RecordEditor (client: renders the edit form)
 *
 * Enum option lists mirror prisma/schema.prisma.
 */

export type FieldType =
  | "text"
  | "email"
  | "url"
  | "textarea"
  | "richtext"
  | "select"
  | "number"
  | "boolean"
  | "date"
  | "tags";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  help?: string;
  max?: number;
  /** half-width on desktop */
  half?: boolean;
  /** stored as a JSON array string; edited as one item per line */
  jsonList?: boolean;
}

export interface ResourceDef {
  /** URL segment under /admin and /api/admin */
  key: ResourceKey;
  singular: string;
  plural: string;
  /** field shown as the record title */
  titleField: string;
  /** public URL for "View on site", using the record's slug */
  publicPath?: (record: Record<string, unknown>) => string | null;
  fields: FieldDef[];
}

export type ResourceKey =
  | "leads"
  | "prospects"
  | "services"
  | "industries"
  | "insights"
  | "projects"
  | "proposals"
  | "contact-messages"
  | "newsletters";

// --- enums (keep in sync with prisma/schema.prisma) -------------------------
export const ENUMS = {
  Industry: ["REAL_ESTATE", "CONSTRUCTION", "FINANCE", "BANKING", "INSURANCE", "RETAIL", "HEALTHCARE", "HOSPITALITY", "EDUCATION", "MANUFACTURING", "LOGISTICS_TRANSPORT", "AGRICULTURE", "PROFESSIONAL_SERVICES", "TECHNOLOGY", "MEDIA_ENTERTAINMENT", "ECOMMERCE", "GOVERNMENT_NGO", "OTHER"],
  CompanySize: ["SIZE_1_10", "SIZE_11_50", "SIZE_51_100", "SIZE_101_500", "SIZE_500_PLUS"],
  ServiceArea: ["TECHNOLOGY_STRATEGY", "AI_CONSULTING", "AUTOMATION", "DIGITAL_TRANSFORMATION", "SOFTWARE_SYSTEMS", "TECHNOLOGY_ADVISORY", "NOT_SURE"],
  LeadSource: ["WEBSITE", "EMAIL", "PHONE", "LINKEDIN", "REFERRAL", "EVENT", "DIRECT_OUTREACH", "OTHER"],
  LeadStatus: ["NEW", "CONTACTED", "QUALIFIED", "CONSULTATION", "PROPOSAL", "NEGOTIATION", "WON", "LOST", "NURTURE"],
  Priority: ["LOW", "MEDIUM", "HIGH", "URGENT"],
  ProspectStatus: ["NOT_CONTACTED", "EMAIL_SENT", "CALL_MADE", "REPLIED", "MEETING", "QUALIFIED", "FOLLOW_UP", "NOT_INTERESTED", "CONVERTED"],
  InsightStatus: ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"],
  InsightCategory: ["TECHNOLOGY_STRATEGY", "ARTIFICIAL_INTELLIGENCE", "AUTOMATION", "DIGITAL_TRANSFORMATION", "BUSINESS_TECHNOLOGY", "DATA", "CYBERSECURITY", "CONSULTING"],
  ProjectStatus: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
  ProjectStage: ["DISCOVERY", "ASSESSMENT", "STRATEGY", "DESIGN", "IMPLEMENTATION", "TESTING", "DEPLOYMENT", "OPTIMIZATION"],
  ProposalStatus: ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED", "EXPIRED"],
  NewsletterStatus: ["PENDING_PAYMENT", "ACTIVE", "EXPIRED", "UNSUBSCRIBED"],
} as const;

export const humanize = (v: string) =>
  v
    .replace(/^SIZE_/, "")
    .replace(/_PLUS$/, "+")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const seo: FieldDef[] = [
  { name: "seoTitle", label: "SEO title", type: "text", max: 70, help: "Shown in Google results. Aim for 50–60 characters.", half: true },
  { name: "seoDescription", label: "SEO description", type: "textarea", max: 170, help: "Aim for 140–160 characters." },
];

export const RESOURCES: Record<ResourceKey, ResourceDef> = {
  leads: {
    key: "leads",
    singular: "Lead",
    plural: "Leads",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 150, half: true },
      { name: "company", label: "Company", type: "text", max: 150, half: true },
      { name: "email", label: "Email", type: "email", required: true, max: 255, half: true },
      { name: "phone", label: "Phone", type: "text", max: 50, half: true },
      { name: "website", label: "Website", type: "url", max: 255, half: true },
      { name: "industry", label: "Industry", type: "select", options: ENUMS.Industry, half: true },
      { name: "companySize", label: "Company size", type: "select", options: ENUMS.CompanySize, half: true },
      { name: "serviceInterest", label: "Service interest", type: "select", options: ENUMS.ServiceArea, half: true },
      { name: "status", label: "Status", type: "select", options: ENUMS.LeadStatus, required: true, half: true },
      { name: "priority", label: "Priority", type: "select", options: ENUMS.Priority, required: true, half: true },
      { name: "leadSource", label: "Source", type: "select", options: ENUMS.LeadSource, required: true, half: true },
      { name: "nextFollowUpAt", label: "Next follow-up", type: "date", half: true },
      { name: "businessChallenge", label: "Business challenge", type: "textarea", max: 5000 },
      { name: "notes", label: "Internal notes", type: "textarea", max: 10000 },
    ],
  },
  prospects: {
    key: "prospects",
    singular: "Prospect",
    plural: "Prospects",
    titleField: "company",
    fields: [
      { name: "company", label: "Company", type: "text", required: true, max: 150, half: true },
      { name: "industry", label: "Industry", type: "select", options: ENUMS.Industry, half: true },
      { name: "contactPerson", label: "Contact person", type: "text", required: true, max: 150, half: true },
      { name: "jobTitle", label: "Job title", type: "text", max: 150, half: true },
      { name: "email", label: "Email", type: "email", required: true, max: 255, half: true },
      { name: "phone", label: "Phone", type: "text", max: 50, half: true },
      { name: "website", label: "Website", type: "url", max: 255, half: true },
      { name: "linkedIn", label: "LinkedIn", type: "url", max: 255, half: true },
      { name: "contactStatus", label: "Status", type: "select", options: ENUMS.ProspectStatus, required: true, half: true },
      { name: "priority", label: "Priority", type: "select", options: ENUMS.Priority, required: true, half: true },
      { name: "nextFollowUpAt", label: "Next follow-up", type: "date", half: true },
      { name: "problemHypothesis", label: "Problem hypothesis", type: "textarea", max: 5000 },
      { name: "researchNotes", label: "Research notes", type: "textarea", max: 10000 },
      { name: "notes", label: "Notes", type: "textarea", max: 10000 },
    ],
  },
  services: {
    key: "services",
    singular: "Service",
    plural: "Services",
    titleField: "name",
    publicPath: (r) => (r.slug ? `/services/${r.slug}` : null),
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 150, half: true },
      { name: "slug", label: "URL slug", type: "text", required: true, max: 120, half: true, help: "Lowercase letters, numbers and dashes." },
      { name: "description", label: "Description", type: "textarea", required: true, max: 2000 },
      { name: "problem", label: "Problems solved (one per line)", type: "textarea", jsonList: true, max: 5000 },
      { name: "solution", label: "Our solution (one per line)", type: "textarea", jsonList: true, max: 5000 },
      { name: "deliverables", label: "Deliverables (one per line)", type: "textarea", jsonList: true, max: 5000 },
      { name: "businessOutcomes", label: "Business outcomes (one per line)", type: "textarea", jsonList: true, max: 5000 },
      { name: "displayOrder", label: "Display order", type: "number", half: true },
      { name: "published", label: "Published", type: "boolean", half: true },
      ...seo,
    ],
  },
  industries: {
    key: "industries",
    singular: "Industry page",
    plural: "Industries",
    titleField: "name",
    publicPath: (r) => (r.slug ? `/industries/${r.slug}` : null),
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 150, half: true },
      { name: "slug", label: "URL slug", type: "text", required: true, max: 120, half: true },
      { name: "industry", label: "Industry", type: "select", options: ENUMS.Industry, required: true, half: true },
      { name: "displayOrder", label: "Display order", type: "number", half: true },
      { name: "description", label: "Description", type: "textarea", required: true, max: 2000 },
      { name: "challenges", label: "Challenges (one per line)", type: "textarea", jsonList: true, max: 5000 },
      { name: "solutions", label: "Solutions (one per line)", type: "textarea", jsonList: true, max: 5000 },
      { name: "relevantServices", label: "Relevant services (one per line)", type: "textarea", jsonList: true, max: 5000 },
      { name: "published", label: "Published", type: "boolean", half: true },
      ...seo,
    ],
  },
  insights: {
    key: "insights",
    singular: "Insight",
    plural: "Insights",
    titleField: "title",
    publicPath: (r) => (r.slug && r.status === "PUBLISHED" ? `/insights/${r.slug}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 200 },
      { name: "slug", label: "URL slug", type: "text", required: true, max: 160, half: true },
      { name: "category", label: "Category", type: "select", options: ENUMS.InsightCategory, required: true, half: true },
      { name: "status", label: "Status", type: "select", options: ENUMS.InsightStatus, required: true, half: true, help: "Publishing sets the publish date automatically." },
      { name: "featuredImage", label: "Featured image URL", type: "url", max: 500, half: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", max: 500 },
      { name: "content", label: "Content (HTML)", type: "richtext", required: true, max: 200000, help: "Basic HTML is allowed. Scripts and event handlers are removed on save." },
      { name: "tags", label: "Tags (comma separated)", type: "tags" },
      ...seo,
    ],
  },
  projects: {
    key: "projects",
    singular: "Project",
    plural: "Projects",
    titleField: "name",
    fields: [
      { name: "name", label: "Project name", type: "text", required: true, max: 200, half: true },
      { name: "company", label: "Client company", type: "text", required: true, max: 150, half: true },
      { name: "service", label: "Service", type: "select", options: ENUMS.ServiceArea, required: true, half: true },
      { name: "status", label: "Status", type: "select", options: ENUMS.ProjectStatus, required: true, half: true },
      { name: "currentStage", label: "Current stage", type: "select", options: ENUMS.ProjectStage, half: true },
      { name: "progress", label: "Progress (%)", type: "number", half: true },
      { name: "startDate", label: "Start date", type: "date", half: true },
      { name: "expectedCompletion", label: "Expected completion", type: "date", half: true },
      { name: "description", label: "Description", type: "textarea", required: true, max: 10000 },
      { name: "internalNotes", label: "Internal notes", type: "textarea", max: 10000 },
    ],
  },
  proposals: {
    key: "proposals",
    singular: "Proposal",
    plural: "Proposals",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 200, half: true },
      { name: "clientCompany", label: "Client company", type: "text", required: true, max: 150, half: true },
      { name: "status", label: "Status", type: "select", options: ENUMS.ProposalStatus, required: true, half: true },
      { name: "expirationDate", label: "Valid until", type: "date", half: true },
      { name: "investment", label: "Investment", type: "text", required: true, max: 200, half: true },
      { name: "timeline", label: "Timeline", type: "text", required: true, max: 200, half: true },
      { name: "problem", label: "Problem", type: "textarea", required: true, max: 10000 },
      { name: "objectives", label: "Objectives", type: "textarea", required: true, max: 10000 },
      { name: "scope", label: "Scope", type: "textarea", required: true, max: 10000 },
      { name: "deliverables", label: "Deliverables", type: "textarea", required: true, max: 10000 },
      { name: "terms", label: "Terms", type: "textarea", max: 10000 },
      { name: "notes", label: "Internal notes", type: "textarea", max: 10000 },
    ],
  },
  "contact-messages": {
    key: "contact-messages",
    singular: "Message",
    plural: "Contact messages",
    titleField: "subject",
    fields: [{ name: "isRead", label: "Read", type: "boolean" }],
  },
  newsletters: {
    key: "newsletters",
    singular: "Subscriber",
    plural: "Newsletter subscribers",
    titleField: "email",
    fields: [{ name: "status", label: "Status", type: "select", options: ENUMS.NewsletterStatus, required: true }],
  },
};
