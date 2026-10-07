-- Fix column names to match Prisma schema

ALTER TABLE services RENAME COLUMN "businessOutcomes" TO business_outcomes;
ALTER TABLE services RENAME COLUMN "seoTitle" TO seo_title;
ALTER TABLE services RENAME COLUMN "seoDescription" TO seo_description;
ALTER TABLE services RENAME COLUMN "displayOrder" TO display_order;
ALTER TABLE services RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE services RENAME COLUMN "updatedAt" TO updated_at;

ALTER TABLE industry_pages RENAME COLUMN "relevantServices" TO relevant_services;
ALTER TABLE industry_pages RENAME COLUMN "seoTitle" TO seo_title;
ALTER TABLE industry_pages RENAME COLUMN "seoDescription" TO seo_description;
ALTER TABLE industry_pages RENAME COLUMN "displayOrder" TO display_order;
ALTER TABLE industry_pages RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE industry_pages RENAME COLUMN "updatedAt" TO updated_at;

-- Create insights table if not exists
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  featured_image VARCHAR(500),
  author_id UUID,
  tags TEXT[],
  seo_title VARCHAR(500),
  seo_description TEXT,
  published_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'DRAFT',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
