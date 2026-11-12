import React from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/shared";
import { getPublishedServices } from "@/lib/db/queries";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import StructuredData from "@/components/seo/StructuredData";
import { generateServiceSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Services | VeyraTech",
  description: "Custom software development and technology consulting services including Website Development, Business Management Systems, POS Solutions, Mobile Apps, System Integration, and AI Automation.",
};

// Force dynamic rendering - disable all static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Hardcoded services as fallback
const STATIC_SERVICES = [
  { id: '1', name: 'Website Development', slug: 'website-development', description: 'Professional websites and web applications that showcase your brand and serve your business needs.' },
  { id: '2', name: 'Custom Software Development', slug: 'custom-software', description: 'Tailored software solutions built specifically for your unique business processes and requirements.' },
  { id: '3', name: 'Business Management Systems', slug: 'business-systems', description: 'Complete systems for managing operations, inventory, sales, customers, and business workflows.' },
  { id: '4', name: 'POS & Inventory Systems', slug: 'pos-inventory', description: 'Point-of-sale and inventory management solutions that streamline retail and distribution operations.' },
  { id: '5', name: 'Mobile Applications', slug: 'mobile-apps', description: 'Native and cross-platform mobile apps for iOS and Android that engage your customers.' },
  { id: '6', name: 'System Integration', slug: 'system-integration', description: 'Connect your existing systems and automate data flow between different business applications.' },
  { id: '7', name: 'AI & Automation', slug: 'ai-automation', description: 'Intelligent automation and AI-powered features that eliminate repetitive work and improve efficiency.' },
  { id: '8', name: 'Technology Consulting', slug: 'technology-consulting', description: 'Strategic guidance on technology decisions, digital transformation, and software architecture.' },
];

export default async function ServicesPage() {
  let services = STATIC_SERVICES;
  
  try {
    const dbServices = await getPublishedServices();
    if (dbServices && dbServices.length > 0) {
      services = dbServices;
    }
  } catch (error) {
    console.error('Database error, using static services:', error);
  }

  // Generate service schemas for each service
  const serviceSchemas = services.map(service => 
    generateServiceSchema({
      name: service.name,
      description: service.description,
      url: `https://veyratech.co.ke/services/${service.slug}`,
    })
  );

  return (
    <>
      {/* SEO Structured Data */}
      {serviceSchemas.map((schema, index) => (
        <StructuredData key={index} data={schema} />
      ))}

      {/* Hero Section */}
      <section className="section bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              Our Solutions
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              We build custom software solutions designed to solve real business problems and create measurable value for Kenyan businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <Card key={service.id} hover>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-sora font-bold text-text-primary mb-4">
                    {service.name}
                  </h2>
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link href={`/services/${service.slug}`}>
                    <Button variant="outline" size="sm">
                      Learn More
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-6">
              Software First. Strategy Second.
            </h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              VeyraTech believes in building practical software solutions that solve real business problems. We start by understanding your operations, then design and develop systems that fit your specific needs.
            </p>
            <div className="bg-primary-dark rounded-xl p-8 shadow-sm border border-border">
              <div className="space-y-4 text-left">
                {[
                  "Business problem",
                  "Desired outcome",
                  "Current situation",
                  "Available technology",
                  "Constraints",
                  "Security and privacy",
                  "Business value",
                  "Appropriate solution",
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-lg text-text-primary">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-secondary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Let's Discuss Your Software Needs
            </h2>
            <p className="text-xl mb-10 text-text-secondary">
              Schedule a consultation to explore how we can build a solution for your business.
            </p>
            <Button href="/book-consultation" variant="secondary" size="lg" className="bg-primary-dark text-secondary hover:bg-primary-dark">
                Start Your Project
                <ArrowRight size={20} />
              </Button>
          </div>
        </div>
      </section>
    </>
  );
}
