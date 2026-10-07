/**
 * Analytics Event Tracker
 * Track custom events for Google Analytics and other analytics platforms
 */

// Extend Window type for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  const { action, category, label, value, ...rest } = event;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
      ...rest,
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', { action, category, label, value });
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
    });
  }
}

/**
 * Predefined event trackers for common actions
 */
export const analytics = {
  // Consultation events
  consultationStarted: () => {
    trackEvent({
      action: 'consultation_started',
      category: 'engagement',
      label: 'Consultation Form',
    });
  },

  consultationSubmitted: (consultationType: string[]) => {
    trackEvent({
      action: 'consultation_submitted',
      category: 'conversion',
      label: consultationType.join(', '),
      value: 1,
    });
  },

  // Newsletter events
  newsletterSubscribed: (amount: number) => {
    trackEvent({
      action: 'newsletter_subscribed',
      category: 'conversion',
      label: 'Paid Newsletter',
      value: amount,
    });
  },

  // Contact events
  contactFormSubmitted: () => {
    trackEvent({
      action: 'contact_form_submitted',
      category: 'engagement',
      label: 'Contact Form',
    });
  },

  // Navigation events
  pricingViewed: (packageName: string) => {
    trackEvent({
      action: 'pricing_viewed',
      category: 'engagement',
      label: packageName,
    });
  },

  caseStudyViewed: (caseStudyId: string) => {
    trackEvent({
      action: 'case_study_viewed',
      category: 'engagement',
      label: caseStudyId,
    });
  },

  insightViewed: (insightId: string, category: string) => {
    trackEvent({
      action: 'insight_viewed',
      category: 'engagement',
      label: `${category} - ${insightId}`,
    });
  },

  // Service events
  serviceViewed: (serviceName: string) => {
    trackEvent({
      action: 'service_viewed',
      category: 'engagement',
      label: serviceName,
    });
  },

  // CTA events
  ctaClicked: (ctaName: string, location: string) => {
    trackEvent({
      action: 'cta_clicked',
      category: 'engagement',
      label: `${ctaName} - ${location}`,
    });
  },

  // External links
  externalLinkClicked: (url: string) => {
    trackEvent({
      action: 'external_link_clicked',
      category: 'engagement',
      label: url,
    });
  },

  // Downloads
  fileDownloaded: (fileName: string) => {
    trackEvent({
      action: 'file_downloaded',
      category: 'engagement',
      label: fileName,
    });
  },

  // M-Pesa payments
  mpesaPaymentInitiated: (amount: number) => {
    trackEvent({
      action: 'mpesa_payment_initiated',
      category: 'conversion',
      label: 'M-Pesa',
      value: amount,
    });
  },

  mpesaPaymentCompleted: (amount: number) => {
    trackEvent({
      action: 'mpesa_payment_completed',
      category: 'conversion',
      label: 'M-Pesa',
      value: amount,
    });
  },

  // Search
  searchPerformed: (query: string) => {
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: query,
    });
  },

  // Errors
  errorOccurred: (errorType: string, errorMessage: string) => {
    trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: `${errorType}: ${errorMessage}`,
    });
  },
};

/**
 * Track user properties
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      user_id: userId,
      ...properties,
    });
  }
}

/**
 * Track e-commerce events
 */
export function trackPurchase(transaction: {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transaction.transactionId,
      value: transaction.value,
      currency: transaction.currency || 'KSH',
      items: transaction.items,
    });
  }
}
