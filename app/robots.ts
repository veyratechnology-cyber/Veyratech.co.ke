import { MetadataRoute } from 'next'

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://veyratech.co.ke').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin-login', '/api/', '/book-consultation/success'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
