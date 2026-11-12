import React from "react";
import { Button, Card, CardContent } from "@/components/shared";
import { SOLUTIONS_DROPDOWN } from "@/lib/constants";
import { ArrowRight, Check, Code, Smartphone, ShoppingCart, Settings, Zap, Network, Bot } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Solution content database
const SOLUTION_CONTENT: Record<string, {
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  benefits: string[];
  idealFor: string[];
  technologies: string[];
  cta: string;
}> = {
  "website-development": {
    title: "Website Development",
    description: "Professional websites and web applications that showcase your brand and serve your business needs.",
    longDescription: "We build modern, responsive websites that not only look great but also drive business results. From corporate websites to complex web applications, we create digital experiences that engage users and convert visitors into customers.",
    icon: "Code",
    features: [
      "Responsive design that works on all devices",
      "Fast loading speeds and optimized performance",
      "SEO-friendly architecture",
      "Content management system (CMS)",
      "Contact forms and lead capture",
      "Analytics and tracking integration",
      "Secure hosting and maintenance",
      "Mobile-first development"
    ],
    benefits: [
      "Professional online presence 24/7",
      "Reach more customers online",
      "Showcase products and services effectively",
      "Generate leads automatically",
      "Build credibility and trust",
      "Reduce customer service load with self-service"
    ],
    idealFor: [
      "Businesses needing an online presence",
      "Companies rebranding or modernizing",
      "Organizations requiring e-commerce",
      "Startups launching their brand",
      "Enterprises needing custom web apps"
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Node.js"],
    cta: "Get Your Website Quote"
  },
  "custom-software": {
    title: "Custom Software Development",
    description: "Tailored software solutions built specifically for your unique business processes and requirements.",
    longDescription: "Off-the-shelf software doesn't always fit. We design and develop custom software applications that match your exact workflows, integrate with your existing systems, and scale with your business growth.",
    icon: "Settings",
    features: [
      "Custom-built for your workflows",
      "Scalable architecture",
      "Cloud or on-premise deployment",
      "API integration capabilities",
      "Role-based access control",
      "Automated reporting and analytics",
      "Mobile and web versions",
      "Ongoing support and updates"
    ],
    benefits: [
      "Perfect fit for your processes",
      "Competitive advantage through unique features",
      "No monthly subscription fees",
      "Complete control over your data",
      "Integration with existing systems",
      "Automation of manual tasks"
    ],
    idealFor: [
      "Businesses with unique processes",
      "Companies outgrowing generic software",
      "Organizations requiring tight integration",
      "Enterprises with complex workflows",
      "Industries with specialized needs"
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Python", "AWS"],
    cta: "Discuss Your Software Needs"
  },
  "business-systems": {
    title: "Business Management Systems",
    description: "Complete systems for managing operations, inventory, sales, customers, and business workflows.",
    longDescription: "Streamline your entire business operation with an integrated management system. Track inventory, manage sales, handle customer relationships, and generate insights—all from one centralized platform tailored to your industry.",
    icon: "Network",
    features: [
      "Customer relationship management (CRM)",
      "Inventory and stock management",
      "Sales and order processing",
      "Financial tracking and reporting",
      "Employee and user management",
      "Multi-location support",
      "Document management",
      "Custom dashboards and reports"
    ],
    benefits: [
      "Single source of truth for business data",
      "Eliminate data entry duplication",
      "Real-time visibility into operations",
      "Better decision-making with data",
      "Improved team collaboration",
      "Reduced operational costs"
    ],
    idealFor: [
      "Growing businesses needing structure",
      "Companies managing multiple processes",
      "Organizations with multiple departments",
      "Businesses outgrowing spreadsheets",
      "Enterprises requiring custom workflows"
    ],
    technologies: ["Next.js", "Prisma", "PostgreSQL", "TypeScript", "Tailwind CSS"],
    cta: "Explore Business Systems"
  },
  "pos-inventory": {
    title: "POS & Inventory Systems",
    description: "Point-of-sale and inventory management solutions that streamline retail and distribution operations.",
    longDescription: "Modern POS and inventory management built for Kenyan businesses. Process sales quickly, track stock in real-time, manage multiple locations, and gain insights into your best-selling products—all while maintaining accurate inventory levels.",
    icon: "ShoppingCart",
    features: [
      "Fast checkout and payment processing",
      "Real-time inventory tracking",
      "Barcode scanning and printing",
      "Multi-location inventory management",
      "Supplier and purchase order management",
      "Low stock alerts and reordering",
      "Sales reporting and analytics",
      "Customer loyalty programs",
      "M-Pesa and mobile money integration"
    ],
    benefits: [
      "Faster customer checkout",
      "Prevent stockouts and overstocking",
      "Reduce inventory shrinkage",
      "Track best-selling products",
      "Multi-store visibility",
      "Accurate financial reporting"
    ],
    idealFor: [
      "Retail stores and shops",
      "Supermarkets and groceries",
      "Pharmacies and clinics",
      "Restaurants and cafes",
      "Distributors and wholesalers",
      "Hardware and electronics stores"
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "M-Pesa API", "Electron"],
    cta: "Get POS System Demo"
  },
  "mobile-apps": {
    title: "Mobile Applications",
    description: "Native and cross-platform mobile apps for iOS and Android that engage your customers.",
    longDescription: "Reach your customers where they are—on their mobile devices. We develop intuitive, high-performance mobile applications that work seamlessly on iOS and Android, providing excellent user experiences and driving customer engagement.",
    icon: "Smartphone",
    features: [
      "iOS and Android development",
      "Cross-platform or native options",
      "Push notifications",
      "Offline functionality",
      "In-app payments and mobile money",
      "Geolocation features",
      "Social media integration",
      "App store submission and support"
    ],
    benefits: [
      "Direct channel to customers",
      "Increase customer engagement",
      "Enable mobile transactions",
      "Build brand loyalty",
      "Collect valuable user data",
      "Provide on-the-go services"
    ],
    idealFor: [
      "Businesses wanting mobile presence",
      "E-commerce companies",
      "Service providers",
      "Delivery and logistics companies",
      "Financial services",
      "Healthcare providers"
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    cta: "Start Your Mobile App"
  },
  "system-integration": {
    title: "System Integration",
    description: "Connect and automate data flow between your different business applications and systems.",
    longDescription: "Stop wasting time on manual data entry between systems. We connect your existing software applications, automate data synchronization, and create seamless workflows that save time and eliminate errors.",
    icon: "Zap",
    features: [
      "API development and integration",
      "Real-time data synchronization",
      "Automated workflows",
      "Legacy system modernization",
      "Third-party service integration",
      "Custom middleware development",
      "Data transformation and mapping",
      "Error handling and monitoring"
    ],
    benefits: [
      "Eliminate duplicate data entry",
      "Reduce human errors",
      "Save hours of manual work",
      "Real-time data across systems",
      "Better data accuracy",
      "Improved operational efficiency"
    ],
    idealFor: [
      "Companies using multiple software tools",
      "Businesses with legacy systems",
      "Organizations requiring automation",
      "Enterprises with complex IT landscapes",
      "Companies scaling operations"
    ],
    technologies: ["Node.js", "Python", "REST APIs", "GraphQL", "RabbitMQ"],
    cta: "Integrate Your Systems"
  },
  "ai-automation": {
    title: "AI & Automation",
    description: "Intelligent automation and AI-powered features that eliminate repetitive work and improve efficiency.",
    longDescription: "Leverage artificial intelligence and automation to transform your operations. From chatbots and document processing to predictive analytics and intelligent recommendations, we help you work smarter, not harder.",
    icon: "Bot",
    features: [
      "Process automation and RPA",
      "AI chatbots and virtual assistants",
      "Document processing and OCR",
      "Predictive analytics",
      "Natural language processing",
      "Image and video analysis",
      "Recommendation engines",
      "Automated reporting"
    ],
    benefits: [
      "Reduce manual repetitive tasks",
      "24/7 customer support via chatbots",
      "Faster document processing",
      "Data-driven predictions",
      "Improved accuracy and consistency",
      "Scale operations without hiring"
    ],
    idealFor: [
      "Businesses with repetitive tasks",
      "Customer service operations",
      "Data-heavy industries",
      "Companies processing documents",
      "Organizations seeking efficiency",
      "Enterprises requiring scalability"
    ],
    technologies: ["Python", "TensorFlow", "OpenAI API", "LangChain", "AWS AI Services"],
    cta: "Explore AI Solutions"
  }
};

// Generate static params for all solution pages
export async function generateStaticParams() {
  return SOLUTIONS_DROPDOWN.map((solution) => ({
    slug: solution.href.replace("/solutions/", ""),
  }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const solution = SOLUTION_CONTENT[params.slug];
  
  if (!solution) {
    return {
      title: "Solution Not Found",
    };
  }

  return {
    title: `${solution.title}`,
    description: solution.description,
    keywords: [`${solution.title} Kenya`, "custom software", "business solutions", ...solution.technologies],
  };
}

// Icon mapping
const IconMap: Record<string, any> = {
  Code,
  Settings,
  Network,
  ShoppingCart,
  Smartphone,
  Zap,
  Bot
};

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const solution = SOLUTION_CONTENT[params.slug];

  if (!solution) {
    notFound();
  }

  const IconComponent = IconMap[solution.icon] || Code;

  return (
    <>
      {/* Hero Section */}
      <section className="section bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-6">
              <IconComponent size={40} className="text-secondary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              {solution.title}
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              {solution.description}
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-text-secondary leading-relaxed">
              {solution.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-center mb-12">
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solution.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="text-secondary flex-shrink-0 mt-1" size={20} />
                  <span className="text-text-secondary">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Ideal For */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Benefits */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-sora font-bold mb-6 text-text-primary">
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {solution.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ArrowRight className="text-secondary flex-shrink-0 mt-1" size={18} />
                      <span className="text-text-secondary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Ideal For */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-sora font-bold mb-6 text-text-primary">
                  Ideal For
                </h3>
                <ul className="space-y-3">
                  {solution.idealFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="text-secondary flex-shrink-0 mt-1" size={18} />
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-sora font-bold mb-6">
              Technologies We Use
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {solution.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-dark border border-border rounded-lg text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-secondary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Let's discuss how {solution.title.toLowerCase()} can transform your business operations.
            </p>
            <Button href="/book-consultation" variant="secondary" size="lg" className="bg-primary-dark text-secondary hover:bg-primary">
                {solution.cta}
                <ArrowRight size={20} />
              </Button>
          </div>
        </div>
      </section>
    </>
  );
}
