/**
 * Dynamic sitemap.xml
 * Static pages + solution pages + published services, industries and insights.
 */

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SOLUTIONS_DROPDOWN } from '@/lib/constants';

export const revalidate = 3600; // rebuild at most once an hour

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://veyratech.co.ke').replace(/\/$/, '');

type Freq = 'daily' | 'weekly' | 'monthly' | 'yearly';

const STATIC_PAGES: Array<{ path: string; priority: number; changeFrequency: Freq }> = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/solutions', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/book-consultation', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/industries', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/how-we-work', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/case-studies', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/support', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
];

async function safe<T>(label: string, query: () => Promise<T[]>): Promise<T[]> {
  try {
    return await query();
  } catch (error) {
    console.error(`[SITEMAP] ${label} failed:`, error instanceof Error ? error.message : error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [services, industries, insights] = await Promise.all([
    safe('services', () => prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })),
    safe('industries', () => prisma.industryPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })),
    safe('insights', () =>
      prisma.insight.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: 500,
      })
    ),
  ]);

  return [
    ...STATIC_PAGES.map((p) => ({
      url: `${baseUrl}${p.path}`,
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...SOLUTIONS_DROPDOWN.map((s) => ({
      url: `${baseUrl}${s.href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...industries.map((i) => ({
      url: `${baseUrl}/industries/${i.slug}`,
      lastModified: i.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...insights.map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: i.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
