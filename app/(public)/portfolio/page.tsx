"use client";

import React from "react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase, 
  Code, 
  Rocket,
  Award,
  Target,
  TrendingUp,
  ExternalLink,
  MapPin,
  Users,
  Zap,
  Shield,
  BarChart
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/shared";

/**
 * Public Portfolio Page
 * Showcases VeyraTech and what we're building
 */
export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative bg-primary-dark border-b border-border">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
              <Rocket className="text-white" size={48} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-sora font-bold text-text-primary mb-4">
              Building VeyraTech
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary mb-4">
              Technology & AI Solutions for African Businesses
            </p>
            
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              We're building practical technology solutions that help businesses grow. 
              No buzzwords, no unnecessary complexity—just results that matter.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:aggrey@veyratech.co.ke" 
                className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 rounded-lg transition-colors text-white font-medium"
              >
                <Mail size={20} />
                <span>Get In Touch</span>
              </a>
              <a 
                href="/book-consultation" 
                className="flex items-center gap-2 px-6 py-3 bg-primary border border-border rounded-lg hover:bg-primary-dark transition-colors text-text-primary"
              >
                <Phone size={20} />
                <span>Book Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What is VeyraTech */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-8 text-center">
              What is VeyraTech?
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                <span className="text-secondary font-semibold">VeyraTech</span> is a technology 
                consulting company focused on helping African businesses leverage modern technology 
                to solve real problems and grow sustainably.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                We specialize in <strong className="text-text-primary">AI adoption</strong>, 
                <strong className="text-text-primary"> business automation</strong>, 
                <strong className="text-text-primary"> digital transformation</strong>, and 
                <strong className="text-text-primary"> technology strategy</strong>. Our approach 
                is simple: listen first, understand the problem, then recommend solutions that 
                actually work.
              </p>
              <div className="bg-primary-dark border border-secondary/20 rounded-lg p-6 mt-8">
                <p className="text-text-primary text-center text-xl font-sora">
                  "We don't sell you technology. We help you use it."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-12 text-center">
            What We Do
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* AI Consulting */}
            <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Zap size={24} className="text-secondary" />
                </div>
                <h3 className="font-sora font-bold text-xl mb-3 text-text-primary">
                  AI Adoption
                </h3>
                <p className="text-text-secondary">
                  Practical AI implementation that delivers real ROI. We help businesses 
                  understand where AI can help and where it can't.
                </p>
              </CardContent>
            </Card>

            {/* Automation */}
            <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Code size={24} className="text-secondary" />
                </div>
                <h3 className="font-sora font-bold text-xl mb-3 text-text-primary">
                  Business Automation
                </h3>
                <p className="text-text-secondary">
                  Automate repetitive tasks and workflows so your team can focus on 
                  what matters. From invoicing to customer service.
                </p>
              </CardContent>
            </Card>

            {/* Digital Transformation */}
            <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-secondary" />
                </div>
                <h3 className="font-sora font-bold text-xl mb-3 text-text-primary">
                  Digital Transformation
                </h3>
                <p className="text-text-secondary">
                  Modernize your business operations with the right technology stack. 
                  We guide you through every step.
                </p>
              </CardContent>
            </Card>

            {/* Technology Strategy */}
            <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Target size={24} className="text-secondary" />
                </div>
                <h3 className="font-sora font-bold text-xl mb-3 text-text-primary">
                  Technology Strategy
                </h3>
                <p className="text-text-secondary">
                  Make informed decisions about technology investments. We help you 
                  choose what's right for your business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="section">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-12 text-center">
            How We Work
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-sora font-bold text-text-primary mb-2">
                  Listen & Understand
                </h3>
                <p className="text-text-secondary">
                  We start by understanding your business, your challenges, and your goals. 
                  No sales pitch—just honest conversation.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-sora font-bold text-text-primary mb-2">
                  Analyze & Recommend
                </h3>
                <p className="text-text-secondary">
                  We analyze your situation and recommend practical solutions that fit your 
                  budget and timeline. If technology isn't the answer, we'll tell you.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-sora font-bold text-text-primary mb-2">
                  Implement & Support
                </h3>
                <p className="text-text-secondary">
                  We implement the solution, train your team, and provide ongoing support. 
                  You're not just buying software—you're gaining a technology partner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Projects & Vision */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-12 text-center">
            What We're Building
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* VeyraTech Platform */}
            <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Globe className="text-secondary" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full font-medium">
                    Live Now
                  </span>
                </div>
                <CardTitle>VeyraTech Platform</CardTitle>
                <p className="text-text-secondary">Client Portal & Management System</p>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Our comprehensive platform for managing consultations, proposals, and 
                  invoices. Built to streamline client interactions and project delivery.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Shield size={16} className="text-secondary" />
                    <span>Secure admin dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <BarChart size={16} className="text-secondary" />
                    <span>Invoice & proposal generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Users size={16} className="text-secondary" />
                    <span>Client consultation booking</span>
                  </div>
                </div>
                <a 
                  href="/" 
                  className="inline-flex items-center gap-2 text-secondary hover:underline"
                >
                  <span>Explore Platform</span>
                  <ExternalLink size={16} />
                </a>
              </CardContent>
            </Card>

            {/* AI Automation Platform */}
            <Card className="border-border hover:border-secondary/30 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Rocket className="text-secondary" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full font-medium">
                    Coming Soon
                  </span>
                </div>
                <CardTitle>AI Automation Tools</CardTitle>
                <p className="text-text-secondary">Accessible Automation for SMEs</p>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Building easy-to-use automation tools specifically designed for small and 
                  medium businesses in Africa. Practical AI that delivers immediate value.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Zap size={16} className="text-secondary" />
                    <span>No-code workflow builder</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Code size={16} className="text-secondary" />
                    <span>Pre-built business templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Award size={16} className="text-secondary" />
                    <span>Affordable pricing for SMEs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why VeyraTech */}
      <section className="section">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-12 text-center">
            Why Choose VeyraTech?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary mb-3">
                Results-Focused
              </h3>
              <p className="text-text-secondary">
                We measure success by your results, not by how much technology we sell you. 
                Your ROI is our priority.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary mb-3">
                Local Understanding
              </h3>
              <p className="text-text-secondary">
                We understand the African business context, challenges, and opportunities. 
                Solutions that work here.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary mb-3">
                Honest Advice
              </h3>
              <p className="text-text-secondary">
                If you don't need expensive technology, we'll tell you. We build long-term 
                partnerships, not one-time sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-6">
              Let's Talk About Your Business
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Whether you're exploring AI, considering automation, or planning a digital 
              transformation—let's have an honest conversation about what makes sense for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="/book-consultation">
                <Button variant="primary" size="lg" className="text-lg px-8">
                  <Phone size={20} />
                  Book Free Consultation
                </Button>
              </a>
              <a href="mailto:aggrey@veyratech.co.ke">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <Mail size={20} />
                  Send Email
                </Button>
              </a>
            </div>

            {/* Contact Details */}
            <div className="flex flex-wrap justify-center gap-8 text-text-muted border-t border-border pt-8">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>aggrey@veyratech.co.ke</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+254 745 247 211</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container-custom text-center text-text-muted text-sm">
          <p className="mb-2">
            <strong className="text-text-primary">VeyraTech</strong> - Practical Technology Solutions for African Businesses
          </p>
          <p>© {new Date().getFullYear()} VeyraTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
