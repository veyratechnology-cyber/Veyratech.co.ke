# Performance & Monitoring Setup Guide

## Overview
Comprehensive guide for setting up performance monitoring, error tracking, analytics, and optimization for VeyraTech.

## 1. Error Tracking with Sentry

### Installation
```bash
npm install @sentry/nextjs
```

### Configuration

**sentry.client.config.ts**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% in dev, reduce in production (0.1 = 10%)
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/veyratech\.co\.ke/,
      ],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

**sentry.server.config.ts**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  
  integrations: [
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],
});
```

**next.config.js** (Add Sentry webpack plugin)
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "veyratech",
    project: "veyratech-web",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

### Environment Variables
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx
```

### Usage
```typescript
// Capture exceptions
try {
  // risky code
} catch (error) {
  Sentry.captureException(error);
}

// Add breadcrumbs
Sentry.addBreadcrumb({
  message: 'User clicked button',
  level: 'info',
});

// Set user context
Sentry.setUser({
  email: user.email,
  id: user.id,
});
```

## 2. Google Analytics Integration

### Installation
```bash
npm install @next/third-parties
```

### Configuration

**app/layout.tsx**
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

### Track Custom Events
```typescript
// lib/analytics.ts
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

// Usage
trackEvent('consultation_booked', {
  category: 'engagement',
  label: 'Consultation Form',
  value: 1,
});

trackEvent('newsletter_subscribed', {
  category: 'conversion',
  amount: 100,
});
```

### Key Events to Track
- Page views (automatic)
- Consultation bookings
- Newsletter subscriptions
- Contact form submissions
- Pricing page views
- Case study views
- Download actions
- External link clicks

## 3. Image Optimization

### Next.js Image Component
Always use `next/image` instead of `<img>`:

```typescript
import Image from 'next/image';

// Optimized image
<Image
  src="/hero-image.jpg"
  alt="Technology consulting"
  width={1200}
  height={630}
  priority // Above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..." // Optional blur placeholder
/>

// Responsive images
<Image
  src="/logo.png"
  alt="VeyraTech Logo"
  width={200}
  height={50}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Image Optimization Best Practices
1. **Compress images before upload**
   - Use tools like TinyPNG, ImageOptim
   - Target: < 100KB for photos, < 20KB for logos

2. **Use modern formats**
   - WebP for photos (automatic with next/image)
   - SVG for logos and icons
   - PNG only when transparency needed

3. **Implement lazy loading**
   - next/image does this automatically
   - For custom images: `loading="lazy"`

4. **Serve responsive images**
   ```typescript
   // Multiple sizes
   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1920}
     height={1080}
     sizes="100vw"
     style={{ width: '100%', height: 'auto' }}
   />
   ```

### next.config.js Image Configuration
```javascript
module.exports = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['veyratech.co.ke', 'res.cloudinary.com'], // External image hosts
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};
```

## 4. Performance Budget

### next.config.js
```javascript
module.exports = {
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
        })
      );
    }
    return config;
  },
  
  // Performance budgets
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};
```

### Run Bundle Analysis
```bash
ANALYZE=true npm run build
```

### Performance Targets
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Total Bundle Size**: < 200KB (gzipped)

### Optimization Checklist
- [ ] Use dynamic imports for large components
- [ ] Implement code splitting
- [ ] Remove unused dependencies
- [ ] Use tree-shaking
- [ ] Optimize third-party scripts
- [ ] Enable compression (Gzip/Brotli)
- [ ] Use CDN for static assets
- [ ] Implement service worker/PWA

## 5. Uptime Monitoring

### Recommended Services
1. **UptimeRobot** (Free tier available)
   - Monitor homepage every 5 minutes
   - Alert via email/SMS on downtime
   - Setup: https://uptimerobot.com

2. **Vercel Analytics** (Included with Vercel)
   - Real user monitoring
   - Web Vitals tracking
   - No setup required

3. **Google Search Console**
   - Monitor crawl errors
   - Track search performance
   - Setup: https://search.google.com/search-console

### Health Check Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: false,
    redis: false,
    email: false,
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  // Check email service
  try {
    // Ping email service
    checks.email = true;
  } catch (error) {
    console.error('Email health check failed:', error);
  }

  const healthy = Object.values(checks).every(Boolean);

  return Response.json(
    {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
```

## 6. Monitoring Dashboard Setup

### Vercel Analytics
Enable in Vercel dashboard:
1. Go to project settings
2. Enable "Analytics"
3. Enable "Speed Insights"
4. View real-time performance data

### Custom Monitoring Dashboard
```typescript
// app/admin/monitoring/page.tsx
export default async function MonitoringPage() {
  // Fetch performance metrics
  const metrics = await getPerformanceMetrics();
  
  return (
    <div>
      <h1>System Monitoring</h1>
      
      {/* Error Rate */}
      <MetricCard
        title="Error Rate"
        value={metrics.errorRate}
        trend={metrics.errorRateTrend}
      />
      
      {/* Response Time */}
      <MetricCard
        title="Avg Response Time"
        value={`${metrics.responseTime}ms`}
        trend={metrics.responseTimeTrend}
      />
      
      {/* Uptime */}
      <MetricCard
        title="Uptime"
        value={`${metrics.uptime}%`}
      />
    </div>
  );
}
```

## 7. Performance Testing

### Lighthouse CI
```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Run Performance Tests
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run tests
lhci autorun
```

## 8. Caching Strategy

### Static Asset Caching (next.config.js)
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|gif|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### API Response Caching
```typescript
// Cache API responses
export async function GET(request: Request) {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

## Quick Setup Checklist

### Immediate Actions
- [ ] Sign up for Sentry (sentry.io)
- [ ] Create Google Analytics property
- [ ] Enable Vercel Analytics
- [ ] Add health check endpoint
- [ ] Configure image optimization
- [ ] Set up UptimeRobot monitoring
- [ ] Run Lighthouse audit

### Weekly Tasks
- [ ] Review error logs in Sentry
- [ ] Check analytics dashboard
- [ ] Monitor Core Web Vitals
- [ ] Review uptime reports

### Monthly Tasks
- [ ] Run bundle analyzer
- [ ] Review and optimize slow pages
- [ ] Check for outdated dependencies
- [ ] Audit third-party scripts
- [ ] Review performance trends

## Environment Variables Required

```env
# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Analytics
NEXT_PUBLIC_GA_ID=

# Monitoring
UPTIME_ROBOT_API_KEY=
```

## Resources
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Google Analytics 4](https://analytics.google.com/)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Vercel Analytics](https://vercel.com/docs/analytics)
