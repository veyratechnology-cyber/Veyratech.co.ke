/**
 * SEO Metadata Helpers
 * Generate optimized metadata for all pages
 */

import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

const siteConfig = {
  name: 'VeyraTech',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://veyratech.co.ke',
  description: 'Technology consulting, AI strategy, and digital transformation solutions in Kenya. Expert guidance for businesses adopting AI, automation, and modern technology.',
  keywords: [
    'technology consulting Kenya',
    'AI consulting Kenya',
    'digital transformation Kenya',
    'business automation Kenya',
    'AI strategy',
    'technology advisory',
    'software consulting',
    'AI adoption',
    'business technology',
    'Nairobi tech consulting',
  ],
  twitter: '@veyratech',
  locale: 'en_KE',
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.png',
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
  } = config;

  const fullTitle = title.includes('VeyraTech') ? title : `${title} | VeyraTech`;
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  const allKeywords = [...new Set([...siteConfig.keywords, ...keywords])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: author ? [{ name: author }] : [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    
    // Open Graph
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      images: [imageUrl],
    },

    // Alternate locales
    alternates: {
      canonical: fullUrl,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
    },
  };
}

// Page-specific metadata presets
export const homeMetadata = generateMetadata({
  title: 'VeyraTech - Technology Consulting & AI Strategy in Kenya',
  description: 'Transform your business with expert technology consulting, AI strategy, and digital transformation solutions. Trusted by businesses across Kenya.',
  keywords: ['technology consulting', 'AI consulting Kenya', 'digital transformation'],
  url: '/',
});

export const servicesMetadata = generateMetadata({
  title: 'Technology Consulting Services',
  description: 'Comprehensive technology consulting services including AI adoption, business automation, digital transformation, and strategic technology advisory.',
  keywords: ['technology services', 'AI services', 'consulting services'],
  url: '/services',
});

export const consultationMetadata = generateMetadata({
  title: 'Book a Technology Consultation',
  description: 'Schedule a free consultation with our technology experts. Get personalized advice on AI adoption, automation, and digital transformation.',
  keywords: ['free consultation', 'technology advice', 'AI consultation'],
  url: '/consultation',
});

export const pricingMetadata = generateMetadata({
  title: 'Pricing - Transparent Technology Consulting Packages',
  description: 'Clear, transparent pricing for technology consulting, AI strategy, and implementation services. Packages starting from KSH 15,000.',
  keywords: ['consulting pricing', 'AI consulting cost', 'technology services cost'],
  url: '/pricing',
});

export const insightsMetadata = generateMetadata({
  title: 'Technology Insights & Articles',
  description: 'Expert insights on AI, automation, digital transformation, and technology strategy. Stay ahead with the latest tech trends in Kenya.',
  keywords: ['technology blog', 'AI articles', 'tech insights Kenya'],
  url: '/insights',
});

export const aboutMetadata = generateMetadata({
  title: 'About VeyraTech - Technology Consulting Experts',
  description: 'Learn about VeyraTech, Kenya\'s trusted technology consulting firm. Our mission is to empower businesses through strategic technology adoption.',
  keywords: ['about veyratech', 'technology consulting firm', 'AI consultants Kenya'],
  url: '/about',
});

export const contactMetadata = generateMetadata({
  title: 'Contact Us - Get in Touch',
  description: 'Contact VeyraTech for technology consulting, AI strategy, or digital transformation services. We\'re here to help your business succeed.',
  keywords: ['contact veyratech', 'technology consulting contact'],
  url: '/contact',
});

// Utility function for dynamic pages
export function generateArticleMetadata(article: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
  author?: string;
  category: string;
  image?: string;
}): Metadata {
  return generateMetadata({
    title: article.title,
    description: article.excerpt,
    keywords: [article.category.toLowerCase(), 'technology insights', 'business technology'],
    image: article.image,
    url: `/insights/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt.toISOString(),
    modifiedTime: article.updatedAt?.toISOString(),
    author: article.author || 'VeyraTech Team',
    section: article.category,
  });
}

// JSON-LD Structured Data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressLocality: 'Nairobi',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254-XXX-XXX-XXX',
      contactType: 'Customer Service',
      email: 'info@veyratech.co.ke',
      availableLanguage: ['English', 'Swahili'],
    },
    sameAs: [
      'https://www.linkedin.com/company/veyratech',
      'https://twitter.com/veyratech',
    ],
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    url: `${siteConfig.url}${service.url}`,
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${siteConfig.url}${article.url}`,
    datePublished: article.publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    image: article.image ? `${siteConfig.url}${article.image}` : undefined,
  };
}
