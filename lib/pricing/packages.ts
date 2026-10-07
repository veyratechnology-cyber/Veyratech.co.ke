/**
 * Pricing Packages for VeyraTech
 * All prices in Kenyan Shillings (KSH)
 */

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  billing: string;
  features: readonly string[];
  cta: string;
  highlight?: string;
  icon: string;
}

export const packages: {
  consultation: readonly PricingPackage[];
  ai: readonly PricingPackage[];
  support: readonly PricingPackage[];
} = {
  consultation: [
    {
      id: 'consultation-starter',
      name: 'Starter Consultation',
      description: 'Perfect for exploring initial ideas',
      price: 15000,
      billing: 'One-time',
      icon: '💡',
      features: [
        '45-minute video consultation',
        'Problem assessment and opportunity analysis',
        'Technology recommendations',
        'Preliminary roadmap',
        'Email follow-up summary',
      ],
      cta: 'Book Consultation',
    },
    {
      id: 'consultation-comprehensive',
      name: 'Comprehensive Package',
      description: 'In-depth analysis and strategy',
      price: 45000,
      billing: 'One-time',
      icon: '🎯',
      features: [
        '2-hour deep-dive consultation',
        'Detailed technical assessment',
        'Custom solution architecture',
        '2-week implementation roadmap',
        'Technology stack recommendations',
        'ROI projections and cost analysis',
        '2 weeks of email support',
      ],
      cta: 'Get Started',
      highlight: 'Most Popular',
    },
    {
      id: 'consultation-enterprise',
      name: 'Enterprise Advisory',
      description: 'Complete transformation strategy',
      price: 150000,
      billing: 'One-time',
      icon: '🏢',
      features: [
        'Full-day on-site consultation',
        'Comprehensive digital transformation audit',
        'Multi-department stakeholder workshops',
        'Custom enterprise solution design',
        '90-day transformation roadmap',
        'Vendor and technology evaluation',
        'Executive presentation deck',
        '1 month of advisory support',
      ],
      cta: 'Contact Us',
    },
  ],

  ai: [
    {
      id: 'ai-starter',
      name: 'AI Pilot',
      description: 'Test AI in your workflow',
      price: 75000,
      billing: 'One-time project',
      icon: '🤖',
      features: [
        'Single-use-case AI implementation',
        'Data preparation and model selection',
        'POC development and testing',
        'Performance metrics dashboard',
        '1 month of model monitoring',
      ],
      cta: 'Start Pilot',
    },
    {
      id: 'ai-professional',
      name: 'AI Solution',
      description: 'Production-ready AI system',
      price: 250000,
      billing: 'Per solution',
      icon: '⚡',
      features: [
        'Multi-use-case AI platform',
        'Custom model training and deployment',
        'API integration with existing systems',
        'Real-time analytics and monitoring',
        'Automated retraining pipeline',
        'User training and documentation',
        '3 months of support and optimization',
      ],
      cta: 'Build Solution',
      highlight: 'Best Value',
    },
    {
      id: 'ai-enterprise',
      name: 'AI Transformation',
      description: 'Enterprise-wide AI strategy',
      price: 800000,
      billing: 'Full transformation',
      icon: '🚀',
      features: [
        'Company-wide AI readiness assessment',
        'Multi-department AI implementations',
        'Custom ML infrastructure setup',
        'Edge computing and MLOps pipeline',
        'Data governance and ethics framework',
        'Team upskilling program',
        '6 months of managed AI services',
        'Quarterly strategy reviews',
      ],
      cta: 'Transform Business',
    },
  ],

  support: [
    {
      id: 'support-basic',
      name: 'Basic Support',
      description: 'Essential maintenance and support',
      price: 50000,
      billing: 'Per month',
      icon: '🛠️',
      features: [
        '8×5 email support (business hours)',
        'Monthly system health checks',
        'Security updates and patches',
        'Bug fixes and minor improvements',
        '48-hour response time',
        'Quarterly performance reports',
      ],
      cta: 'Get Support',
    },
    {
      id: 'support-professional',
      name: 'Professional Support',
      description: 'Priority support with proactive monitoring',
      price: 125000,
      billing: 'Per month',
      icon: '⚙️',
      features: [
        '24×7 priority email and phone support',
        'Proactive monitoring and alerts',
        'Weekly system optimization',
        'Feature enhancements included',
        '4-hour response time for critical issues',
        'Dedicated support engineer',
        'Monthly strategy calls',
        'On-demand training sessions',
      ],
      cta: 'Go Professional',
      highlight: 'Recommended',
    },
    {
      id: 'support-enterprise',
      name: 'Enterprise Support',
      description: 'Full managed services and innovation',
      price: 350000,
      billing: 'Per month',
      icon: '🏆',
      features: [
        '24×7 dedicated support team',
        'Real-time monitoring with auto-scaling',
        'Continuous feature development',
        'Unlimited optimization and improvements',
        '1-hour response time guarantee',
        'On-site support available',
        'Quarterly innovation workshops',
        'Custom SLA agreements',
        'Priority access to new technologies',
      ],
      cta: 'Contact Sales',
    },
  ],
};
