import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://veyratech.co.ke'),
  title: {
    default: 'VeyraTech | Custom Software Development & Business Solutions Kenya',
    template: '%s | VeyraTech'
  },
  description: 'VeyraTech delivers custom software development, website development, business management systems, POS solutions, and mobile applications in Kenya. Transform your business with expert software solutions.',
  keywords: [
    'software development Kenya',
    'custom software Kenya',
    'website development Kenya',
    'business management systems Kenya',
    'POS systems Kenya',
    'inventory management software Kenya',
    'mobile app development Kenya',
    'CRM development Kenya',
    'VeyraTech',
    'enterprise software',
    'system integration Kenya',
    'software solutions Nairobi',
    'business automation Kenya',
    'custom web applications',
    'technology consulting Kenya',
    'AI automation Kenya',
    'cloud solutions Kenya',
    'digital transformation Kenya'
  ],
  authors: [{ name: 'VeyraTech' }],
  creator: 'VeyraTech',
  publisher: 'VeyraTech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://veyratech.co.ke',
    siteName: 'VeyraTech',
    title: 'VeyraTech | Custom Software Development & Business Solutions Kenya',
    description: 'Transform your business with custom software development, business management systems, POS solutions, and mobile applications in Kenya.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VeyraTech - Software Development Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeyraTech | Software Development Kenya',
    description: 'Custom software development and business solutions in Kenya',
    images: ['/og-image.png'],
  },
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
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: '8q8QM4KIH_uXEQnS1Zgk4icbTRr9xX7GpA4PEFOngyU',
    other: {
      'msvalidate.01': '3F5EEB75E04C36C1E3134FE591300BBE',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VeyraTech',
    alternateName: 'Veyra Technology',
    url: 'https://veyratech.co.ke',
    logo: 'https://veyratech.co.ke/logo.png',
    description: 'Custom software development company in Kenya specializing in website development, business management systems, POS solutions, mobile applications, and system integration',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressRegion: 'Nairobi',
      addressLocality: 'Nairobi',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@veyratech.co.ke',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
      areaServed: 'KE',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    serviceType: [
      'Custom Software Development',
      'Website Development',
      'Business Management Systems',
      'POS & Inventory Systems',
      'Mobile Application Development',
      'System Integration',
      'AI & Automation',
      'Technology Consulting',
    ],
    knowsAbout: [
      'Software Development',
      'Web Development',
      'Mobile Development',
      'Business Systems',
      'System Integration',
      'Business Technology',
      'AI Automation',
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        {/* Analytics */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        )}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
