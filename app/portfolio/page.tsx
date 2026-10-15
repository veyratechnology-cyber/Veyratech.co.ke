"use client";

import React, { useState, useEffect } from "react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  Send,
  CheckCircle,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  Code2,
  Brain,
  Zap,
  Users
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/shared";
import Image from "next/image";

/**
 * Premium Personal Portfolio - Aggrey Gisemba Ogeto
 * Elite digital business card with custom journey
 */
export default function PortfolioPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    building: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/portfolio-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", company: "", role: "", building: "" });
      } else {
        setError("Failed to send message. Please try email instead.");
      }
    } catch (err) {
      setError("Failed to send message. Please try email instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Subtle Background Accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary rounded-full filter blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-primary border-b border-border py-4' : 'py-6'
      }`}>
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white">
              AG
            </div>
            <span className="font-sora font-bold text-text-primary hidden sm:block">Aggrey Ogeto</span>
          </div>
          <a 
            href="mailto:aggrey@veyratech.co.ke"
            className="px-6 py-2.5 bg-secondary hover:bg-secondary-hover rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <span>Connect With Me</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      {/* Hero Section - Mobile First: Picture on Top */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 bg-primary">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            {/* Profile Picture - Top on Mobile */}
            <div className="relative w-full max-w-sm mx-auto mb-8">
              <div className="relative bg-primary-dark rounded-2xl p-2 border border-border overflow-hidden">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-primary-dark">
                  {/* Placeholder - Replace with actual image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-8xl font-bold text-secondary">
                      AG
                    </div>
                  </div>
                  {/* When you have the image, replace above div with: */}
                  {/* <Image 
                    src="/images/profile.jpg" 
                    alt="Aggrey Gisemba Ogeto" 
                    fill
                    className="object-cover"
                  /> */}
                </div>
              </div>
              
              {/* Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-secondary rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">veyratech.co.ke</span>
              </div>
            </div>

            {/* Content Below Picture */}
            <div className="text-center space-y-6 mt-12">
              {/* Title */}
              <div className="space-y-2">
                <p className="text-secondary text-sm font-medium uppercase tracking-wider">
                  Founder · Builder · Technology
                </p>
                <h1 className="text-5xl md:text-6xl font-sora font-bold text-text-primary">
                  Aggrey Gisemba
                </h1>
              </div>

              {/* Subtitle */}
              <h2 className="text-2xl md:text-3xl text-text-secondary font-light">
                Founder of VeyraTech
              </h2>

              {/* Description */}
              <p className="text-lg text-text-muted leading-relaxed max-w-xl mx-auto">
                Building technology and consulting solutions for a smarter tomorrow.
              </p>

              {/* Location */}
              <div className="flex items-center justify-center gap-2 text-text-muted">
                <MapPin size={18} className="text-secondary" />
                <span>Kenya</span>
              </div>

              {/* Main CTA Buttons */}
              <div className="space-y-4 pt-6">
                <a href="#contact">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="w-full max-w-md mx-auto text-lg"
                  >
                    Connect with me 🔗
                  </Button>
                </a>
                
                <button 
                  className="w-full max-w-md mx-auto px-6 py-3 bg-primary-dark hover:bg-primary border border-border rounded-lg text-text-primary font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  ↓ Save my contact
                </button>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center pt-4">
                <a 
                  href="https://linkedin.com/in/aggrey-ogeto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-primary-dark hover:bg-secondary border border-border hover:border-secondary flex items-center justify-center text-text-muted hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://github.com/aggreyogeto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-primary-dark hover:bg-secondary border border-border hover:border-secondary flex items-center justify-center text-text-muted hover:text-white transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="mailto:gisembaaggrey@gmail.com"
                  className="w-12 h-12 rounded-lg bg-primary-dark hover:bg-secondary border border-border hover:border-secondary flex items-center justify-center text-text-muted hover:text-white transition-colors duration-200"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto border-t border-border mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-1">2+</div>
                  <div className="text-sm text-text-muted">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-1">34+</div>
                  <div className="text-sm text-text-muted">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-1">100%</div>
                  <div className="text-sm text-text-muted">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight size={24} className="text-text-muted rotate-90" />
        </div>
      </section>

      {/* Expertise Section */}
      <section id="about" className="section relative bg-primary-dark">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sora font-bold text-text-primary mb-4">
              My Focus Areas
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Where technology meets real business impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* AI Strategy */}
            <div className="group relative bg-primary rounded-xl p-6 border border-border hover:border-secondary transition-colors duration-200">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Brain className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary mb-3">
                AI Strategy
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Helping businesses understand and implement AI in practical, meaningful ways
              </p>
            </div>

            {/* Automation */}
            <div className="group relative bg-primary rounded-xl p-6 border border-border hover:border-secondary transition-colors duration-200">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Zap className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary mb-3">
                Automation
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Streamline operations and eliminate repetitive tasks with smart automation
              </p>
            </div>

            {/* Development */}
            <div className="group relative bg-primary rounded-xl p-6 border border-border hover:border-secondary transition-colors duration-200">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Code2 className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary mb-3">
                Development
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Custom software solutions built with cutting-edge technologies
              </p>
            </div>

            {/* Consulting */}
            <div className="group relative bg-primary rounded-xl p-6 border border-border hover:border-secondary transition-colors duration-200">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary mb-3">
                Consulting
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Working with businesses to chart their technology journey and transformation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VeyraTech Showcase */}
      <section id="veyratech" className="section relative bg-primary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-sora font-bold text-text-primary mb-4">
              The Company I Built
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Practical technology solutions for African businesses
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-primary-dark rounded-2xl p-8 md:p-12 border border-border">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Briefcase size={36} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-3xl md:text-4xl font-sora font-bold text-white">
                      VeyraTech
                    </h3>
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm rounded-full font-medium">
                      Live & Operating
                    </span>
                  </div>
                  <p className="text-xl text-white/70 mb-2">Practical Technology Solutions for African Businesses</p>
                </div>
              </div>

              <p className="text-lg text-white/60 leading-relaxed mb-6">
                VeyraTech bridges the gap between complex technology and real business needs 
                in Africa. We focus on practical solutions—AI, automation, and digital tools that businesses 
                can actually use and benefit from.
              </p>

              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Our vision is simple: make technology accessible, understandable, and valuable for African 
                businesses. No buzzwords, no unnecessary complexity—just solutions that work.
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-white">What We Do:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                    <div>
                      <p className="text-white font-medium">AI Consultation Platform</p>
                      <p className="text-white/50 text-sm">Helping businesses understand where AI fits</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Automation Tools</p>
                      <p className="text-white/50 text-sm">Streamlining business operations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Digital Transformation</p>
                      <p className="text-white/50 text-sm">Guiding businesses through tech adoption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Technology Education</p>
                      <p className="text-white/50 text-sm">Making tech concepts accessible</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://veyratech.co.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-hover rounded-xl text-white font-medium transition-all duration-300 shadow-secondary-lg"
                >
                  <span>Visit VeyraTech</span>
                  <ArrowRight size={18} />
                </a>
                <a 
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300"
                >
                  <span>Let's Discuss</span>
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="section relative">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-medium mb-6">
                <Mail size={16} />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-sora font-bold text-white mb-4">
                Let's Connect
              </h2>
              <p className="text-xl text-white/50">
                Interested in what I'm building? Let's chat about technology, business, or opportunities to collaborate.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-success/10 border border-success/20 rounded-2xl p-12 text-center">
                <CheckCircle size={64} className="text-success mx-auto mb-6" />
                <h3 className="text-3xl font-sora font-bold text-text-primary mb-4">
                  Message Received!
                </h3>
                <p className="text-text-secondary mb-8 text-lg">
                  Thank you for reaching out. I'll get back to you within 24 hours.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="bg-primary-dark rounded-2xl p-8 md:p-12 border border-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="Your Company"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
                        Your Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="CEO, Developer, etc."
                      />
                    </div>
                  </div>

                  {/* What you're working on */}
                  <div>
                    <label htmlFor="building" className="block text-sm font-medium text-text-primary mb-2">
                      What you're working on
                    </label>
                    <input
                      type="text"
                      id="building"
                      name="building"
                      value={formData.building}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="Tell me about your project or business"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary-hover text-white border-0 shadow-secondary-lg text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Connecting...</>
                    ) : (
                      <>
                        <Send size={20} />
                        Connect With Me
                      </>
                    )}
                  </Button>
                </form>

                {/* Direct Contact */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-center text-white/40 text-sm mb-4">
                    Or reach out directly
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <a 
                      href="mailto:gisembaaggrey@gmail.com"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                      <Mail size={16} />
                      <span className="text-sm">gisembaaggrey@gmail.com</span>
                    </a>
                    <a 
                      href="tel:+254745247211"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                      <Phone size={16} />
                      <span className="text-sm">+254 745 247 211</span>
                    </a>
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin size={16} />
                      <span className="text-sm">Nairobi, Kenya</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-12 bg-primary-dark">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-text-primary font-medium mb-1">Aggrey Gisemba Ogeto</p>
              <p className="text-text-muted text-sm">Founder, VeyraTech</p>
            </div>
            
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/aggrey-ogeto" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-primary hover:bg-secondary border border-border hover:border-secondary flex items-center justify-center text-text-muted hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/aggreyogeto" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-primary hover:bg-secondary border border-border hover:border-secondary flex items-center justify-center text-text-muted hover:text-white transition-colors">
                <Github size={18} />
              </a>
              <a href="https://veyratech.co.ke" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-primary hover:bg-secondary border border-border hover:border-secondary flex items-center justify-center text-text-muted hover:text-white transition-colors">
                <Globe size={18} />
              </a>
              <a href="mailto:aggrey@veyratech.co.ke" className="w-10 h-10 rounded-lg bg-primary hover:bg-secondary border border-border hover:border-secondary flex items-center justify-center text-text-muted hover:text-white transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-border">
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} Aggrey Gisemba Ogeto. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
