/**
 * Dynamic Sitemap Generation
 * Generate sitemap.xml for search engines
 */

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://veyratech.co.ke';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consultation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic service pages
  let services: MetadataRoute.Sitemap = [];
  try {
    const servicePages = await prisma.service.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    services = servicePages.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('[SITEMAP] Error fetching services:', error);
  }

  // Dynamic industry pages
  let industries: MetadataRoute.Sitemap = [];
  try {
    const industryPages = await prisma.industryPage.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    industries = industryPages.map((industry) => ({
      url: `${baseUrl}/industries/${industry.slug}`,
      lastModified: industry.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('[SITEMAP] Error fetching industries:', error);
  }

  // Dynamic insight/blog posts
  let insights: MetadataRoute.Sitemap = [];
  try {
    const insightPosts = await prisma.insight.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 100, // Limit to recent posts
    });

    insights = insightPosts.map((insight) => ({
      url: `${baseUrl}/insights/${insight.slug}`,
      lastModified: insight.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('[SITEMAP] Error fetching insights:', error);
  }

  return [...staticPages, ...services, ...industries, ...insights];
}
