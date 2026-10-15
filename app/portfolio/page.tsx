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
    message: ""
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
        setFormData({ name: "", email: "", phone: "", message: "" });
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'py-6'
      }`}>
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-blue-500 flex items-center justify-center font-bold text-white">
              AG
            </div>
            <span className="font-sora font-bold text-white hidden sm:block">Aggrey Ogeto</span>
          </div>
          <a 
            href="mailto:aggrey@veyratech.co.ke"
            className="px-6 py-2.5 bg-gradient-to-r from-secondary to-blue-500 hover:from-secondary/90 hover:to-blue-500/90 rounded-full text-white font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-secondary/20"
          >
            <span>Get In Touch</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      {/* Hero Section with Profile Picture */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Profile Image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  {/* Animated Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary via-blue-500 to-purple-500 rounded-3xl animate-spin-slow blur-xl opacity-30"></div>
                  
                  {/* Profile Picture Container */}
                  <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-2 border border-white/10">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/20 to-blue-500/20">
                      {/* Placeholder - Replace with actual image */}
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-8xl font-bold bg-gradient-to-r from-secondary to-blue-500 bg-clip-text text-transparent">
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

                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-secondary to-blue-500 rounded-2xl p-4 shadow-2xl shadow-secondary/30 animate-float">
                    <Award className="text-white" size={32} />
                  </div>
                </div>
              </div>

              {/* Right: Intro Content */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-medium mb-6">
                  <Sparkles size={16} />
                  <span>Available for Consulting</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-sora font-bold text-white mb-6 leading-tight">
                  Aggrey Gisemba
                  <br />
                  <span className="bg-gradient-to-r from-secondary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Ogeto
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-white/60 mb-6 font-light">
                  Technology Entrepreneur
                </p>
                
                <p className="text-lg text-white/50 mb-8 leading-relaxed max-w-xl">
                  Building the future of technology in Africa. Founder of VeyraTech, 
                  helping businesses leverage AI and automation to achieve extraordinary results.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8 max-w-xl">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white mb-1">5+</div>
                    <div className="text-sm text-white/50">Years Experience</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white mb-1">50+</div>
                    <div className="text-sm text-white/50">Projects Delivered</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                    <div className="text-sm text-white/50">Client Satisfaction</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <a href="#contact">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="bg-gradient-to-r from-secondary to-blue-500 hover:from-secondary/90 hover:to-blue-500/90 text-white border-0 shadow-lg shadow-secondary/30"
                    >
                      <Send size={20} />
                      <span>Start a Project</span>
                    </Button>
                  </a>
                  <a 
                    href="#about"
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-white font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 mt-8 justify-center lg:justify-start">
                  <a 
                    href="https://linkedin.com/in/aggrey-ogeto" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href="https://github.com/aggreyogeto" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Github size={20} />
                  </a>
                  <a 
                    href="https://veyratech.co.ke" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Globe size={20} />
                  </a>
                  <a 
                    href="mailto:aggrey@veyratech.co.ke"
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="about" className="section relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>What I Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-sora font-bold text-white mb-4">
              Expertise & Services
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Transforming businesses through strategic technology implementation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* AI Strategy */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-secondary/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Brain className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-white mb-3">
                AI Strategy
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Practical AI implementation that delivers measurable ROI for your business
              </p>
            </div>

            {/* Automation */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-blue-400" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-white mb-3">
                Automation
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Streamline operations and eliminate repetitive tasks with smart automation
              </p>
            </div>

            {/* Development */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code2 className="text-purple-400" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-white mb-3">
                Development
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Custom software solutions built with cutting-edge technologies
              </p>
            </div>

            {/* Consulting */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-green-400" size={28} />
              </div>
              <h3 className="text-xl font-sora font-bold text-white mb-3">
                Consulting
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Strategic guidance to navigate your digital transformation journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VeyraTech Showcase */}
      <section className="section relative bg-gradient-to-br from-secondary/5 to-blue-500/5">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/30">
                  <Briefcase size={36} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-3xl md:text-4xl font-sora font-bold text-white">
                      VeyraTech
                    </h3>
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-xl text-white/70 mb-2">Technology & AI Solutions for African Businesses</p>
                </div>
              </div>

              <p className="text-lg text-white/60 leading-relaxed mb-8">
                VeyraTech is my flagship venture—a technology consulting company dedicated to helping 
                African businesses harness the power of AI, automation, and digital transformation. 
                We deliver practical, no-nonsense solutions that drive real, measurable results.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">AI Strategy</div>
                  <div className="text-sm text-white/50">Implementation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Automation</div>
                  <div className="text-sm text-white/50">Solutions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Digital</div>
                  <div className="text-sm text-white/50">Transformation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Custom</div>
                  <div className="text-sm text-white/50">Development</div>
                </div>
              </div>

              <a 
                href="https://veyratech.co.ke" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-blue-500 hover:from-secondary/90 hover:to-blue-500/90 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-secondary/20"
              >
                <span>Visit VeyraTech</span>
                <ArrowRight size={18} />
              </a>
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
                Let's Work Together
              </h2>
              <p className="text-xl text-white/50">
                Have a project in mind? Let's discuss how we can bring it to life.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-xl rounded-3xl p-12 border border-green-500/20 text-center">
                <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
                <h3 className="text-3xl font-sora font-bold text-white mb-4">
                  Message Received!
                </h3>
                <p className="text-white/60 mb-8 text-lg">
                  Thank you for reaching out. I'll get back to you within 24 hours.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none"
                      placeholder="Tell me about your project..."
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
                    className="w-full bg-gradient-to-r from-secondary to-blue-500 hover:from-secondary/90 hover:to-blue-500/90 text-white border-0 shadow-lg shadow-secondary/30 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
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
                      href="mailto:aggrey@veyratech.co.ke"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                      <Mail size={16} />
                      <span className="text-sm">aggrey@veyratech.co.ke</span>
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
      <footer className="relative border-t border-white/5 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-white font-medium mb-1">Aggrey Gisemba Ogeto</p>
              <p className="text-white/40 text-sm">Technology Entrepreneur | Founder, VeyraTech</p>
            </div>
            
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/aggrey-ogeto" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/aggreyogeto" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                <Github size={18} />
              </a>
              <a href="https://veyratech.co.ke" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                <Globe size={18} />
              </a>
              <a href="mailto:aggrey@veyratech.co.ke" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-white/5">
            <p className="text-white/30 text-sm">
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
