"use client";

import React from 'react';
import { Card, CardContent, Button } from '@/components/shared';
import { ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

const caseStudies = [
  {
    id: 1,
    title: "E-Commerce Platform Transformation",
    client: "Leading Fashion Retailer",
    industry: "Retail",
    challenge: "Outdated system causing 40% cart abandonment rate and slow checkout process",
    solution: "Implemented AI-powered product recommendations and streamlined checkout with M-Pesa integration",
    results: [
      { metric: "Cart Abandonment", value: "40% → 15%", icon: TrendingUp },
      { metric: "Conversion Rate", value: "+85%", icon: Users },
      { metric: "Revenue Growth", value: "+120%", icon: DollarSign },
    ],
    image: "/case-studies/ecommerce.jpg",
    tags: ["E-commerce", "AI", "M-Pesa Integration"],
  },
  {
    id: 2,
    title: "Healthcare System Digitization",
    client: "Multi-Clinic Healthcare Provider",
    industry: "Healthcare",
    challenge: "Manual patient records causing inefficiencies and compliance risks",
    solution: "Custom EMR system with automated appointment scheduling and patient portal",
    results: [
      { metric: "Admin Time", value: "-60%", icon: TrendingUp },
      { metric: "Patient Satisfaction", value: "+95%", icon: Users },
      { metric: "Operational Cost", value: "-35%", icon: DollarSign },
    ],
    image: "/case-studies/healthcare.jpg",
    tags: ["Healthcare", "EMR", "Automation"],
  },
  {
    id: 3,
    title: "Logistics AI Optimization",
    client: "National Delivery Service",
    industry: "Logistics",
    challenge: "High fuel costs and inefficient routing leading to delayed deliveries",
    solution: "AI-powered route optimization and real-time tracking system",
    results: [
      { metric: "Fuel Costs", value: "-45%", icon: DollarSign },
      { metric: "On-Time Delivery", value: "+80%", icon: TrendingUp },
      { metric: "Customer Complaints", value: "-70%", icon: Users },
    ],
    image: "/case-studies/logistics.jpg",
    tags: ["AI", "Logistics", "Optimization"],
  },
  {
    id: 4,
    title: "Manufacturing Process Automation",
    client: "Industrial Equipment Manufacturer",
    industry: "Manufacturing",
    challenge: "Manual quality control causing 15% defect rate and production delays",
    solution: "Computer vision AI for quality control and IoT-enabled production monitoring",
    results: [
      { metric: "Defect Rate", value: "15% → 2%", icon: TrendingUp },
      { metric: "Production Speed", value: "+50%", icon: Users },
      { metric: "Cost Savings", value: "KSH 12M/year", icon: DollarSign },
    ],
    image: "/case-studies/manufacturing.jpg",
    tags: ["AI", "Computer Vision", "IoT"],
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-sora font-bold text-text-primary mb-6">
          Success Stories
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          Real results from real businesses. See how we've helped companies transform through technology.
        </p>
      </div>

      {/* Case Studies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <Card key={study.id} className="overflow-hidden">
              <div className={`grid md:grid-cols-2 gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Image */}
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-text-secondary text-sm">{study.industry}</p>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-8">
                  <div className="mb-4">
                    <span className="text-primary text-sm font-semibold">{study.client}</span>
                    <h2 className="text-3xl font-sora font-bold text-text-primary mt-2 mb-4">
                      {study.title}
                    </h2>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Challenge & Solution */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-2">Challenge</h3>
                      <p className="text-text-secondary">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-2">Solution</h3>
                      <p className="text-text-secondary">{study.solution}</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="text-center p-4 bg-background-dark rounded-lg">
                        <result.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-primary mb-1">
                          {result.value}
                        </div>
                        <div className="text-xs text-text-secondary">{result.metric}</div>
                      </div>
                    ))}
                  </div>

                  <Link href="/book-consultation">
                    <Button className="w-full group">
                      Achieve Similar Results
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-12">
            <h2 className="text-3xl font-sora font-bold text-text-primary mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Let's discuss how we can help transform your business through technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-consultation">
                <Button size="lg" className="w-full sm:w-auto">
                  Book Free Consultation
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Our Services
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
