/**
 * Enhanced Structured Data (JSON-LD) for SEO
 * Comprehensive schemas for better search engine understanding
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://veyratech.co.ke';

// Organization Schema - Main company information
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/#organization`,
    name: 'VeyraTech',
    alternateName: 'Veyra Technology Solutions',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 250,
      height: 60,
    },
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
    },
    description: 'Leading technology consulting firm in Kenya providing AI strategy, digital transformation, business automation, and software development services.',
    slogan: 'Technology & AI Consulting',
    
    // Contact Information
    telephone: '+254-745-247-211',
    email: 'hello@veyratech.co.ke',
    
    // Address
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressRegion: 'Nairobi',
      addressLocality: 'Nairobi',
    },
    
    // Geographic Area Served
    areaServed: [
      {
        '@type': 'Country',
        name: 'Kenya',
      },
      {
        '@type': 'City',
        name: 'Nairobi',
      },
    ],
    
    // Services Offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Technology Consulting Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Consulting',
            description: 'AI strategy, implementation, and adoption consulting services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Digital Transformation',
            description: 'End-to-end digital transformation consulting and implementation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Automation',
            description: 'Process automation and workflow optimization services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Technology Strategy',
            description: 'Strategic technology planning and advisory services',
          },
        },
      ],
    },
    
    // Social Media Profiles
    sameAs: [
      'https://www.linkedin.com/company/veyratech',
      'https://twitter.com/veyratech',
      'https://www.facebook.com/veyratech',
    ],
    
    // Aggregate Rating (if you have reviews)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '24',
      bestRating: '5',
      worstRating: '1',
    },
    
    // Price Range
    priceRange: 'KSH 15,000 - KSH 500,000',
    
    // Business Hours
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  };
}

// Local Business Schema - For better local SEO in Kenya
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: 'VeyraTech',
    url: baseUrl,
    telephone: '+254-745-247-211',
    email: 'hello@veyratech.co.ke',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi',
      postalCode: '',
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.2921,
      longitude: 36.8219,
    },
    priceRange: 'KSH 15,000 - KSH 500,000',
    servesCuisine: false,
  };
}

// WebSite Schema - For site-wide search
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'VeyraTech',
    description: 'Technology Consulting & AI Strategy in Kenya',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Service Schema - For individual services
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  price?: { min: number; max: number; currency: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    serviceType: service.name,
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    url: `${baseUrl}${service.url}`,
    ...(service.price && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: service.price.currency,
        lowPrice: service.price.min,
        highPrice: service.price.max,
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString().split('T')[0],
      },
    }),
  };
}

// Article/Blog Post Schema
export function getArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: Date;
  modifiedAt?: Date;
  author: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? `${baseUrl}${article.image}` : `${baseUrl}/og-image.png`,
    datePublished: article.publishedAt.toISOString(),
    dateModified: (article.modifiedAt || article.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
      url: `${baseUrl}/about`,
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${article.url}`,
    },
    articleSection: article.category,
  };
}

// FAQ Schema - For FAQ pages
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb Schema
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

// Consultation/Service Schema - For booking pages
export function getConsultationServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Technology Consultation',
    description: 'Book a consultation with VeyraTech technology experts',
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    serviceType: 'Consulting',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: '15000',
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/book-consultation`,
    },
  };
}

// Product/Service Catalog Schema
export function getProductCatalogSchema(services: Array<{
  name: string;
  description: string;
  price: number;
  currency: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'VeyraTech Services',
    description: 'Technology consulting services and packages',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: service.name,
        description: service.description,
        offers: {
          '@type': 'Offer',
          price: service.price,
          priceCurrency: service.currency,
        },
      },
    })),
  };
}

// Review Schema - For case studies/testimonials
export function getReviewSchema(review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@id': `${baseUrl}/#organization`,
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished.toISOString(),
  };
}

// Video Schema - If you have video content
export function getVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: Date;
  duration: string; // ISO 8601 format, e.g., "PT1M30S" for 1 min 30 sec
  contentUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate.toISOString(),
    duration: video.duration,
    contentUrl: video.contentUrl,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  };
}

// Export aliases for convenience
export const generateOrganizationSchema = getOrganizationSchema;
export const generateWebSiteSchema = getWebSiteSchema;
export const generateLocalBusinessSchema = getLocalBusinessSchema;
export const generateServiceSchema = getServiceSchema;
export const generateArticleSchema = getArticleSchema;
export const generateFAQSchema = getFAQSchema;
export const generateBreadcrumbSchema = getBreadcrumbSchema;
export const generateConsultationServiceSchema = getConsultationServiceSchema;
export const generateProductCatalogSchema = getProductCatalogSchema;
export const generateReviewSchema = getReviewSchema;
export const generateVideoSchema = getVideoSchema;
export const generateHomePageSchemas = getHomePageSchemas;


// Aggregate all main schemas for homepage
export function getHomePageSchemas() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getLocalBusinessSchema(),
    ],
  };
}
