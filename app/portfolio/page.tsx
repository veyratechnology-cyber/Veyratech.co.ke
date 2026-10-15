"use client";

import React, { useState } from "react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  Send,
  CheckCircle,
  Globe
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/shared";

/**
 * Personal Portfolio Page - Digital Business Card
 * For networking events and professional connections
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
    <div className="min-h-screen bg-primary">
      {/* Hero Section - Personal Info */}
      <section className="relative bg-gradient-to-br from-primary-dark to-primary border-b border-border">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Profile Picture Placeholder */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center text-5xl font-bold text-white shadow-xl">
              AG
            </div>
            
            <h1 className="text-4xl md:text-6xl font-sora font-bold text-text-primary mb-4">
              Aggrey Gisemba Ogeto
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary mb-4 font-medium">
              Technology Entrepreneur & Founder
            </p>
            
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Building practical technology solutions that help businesses grow. Passionate about 
              AI, automation, and digital transformation in Africa.
            </p>

            {/* Direct Contact Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a 
                href="mailto:aggrey@veyratech.co.ke" 
                className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 rounded-lg transition-colors text-white font-medium shadow-lg"
              >
                <Mail size={20} />
                <span>Email Me</span>
              </a>
              <a 
                href="tel:+254745247211" 
                className="flex items-center gap-2 px-6 py-3 bg-primary border-2 border-secondary rounded-lg hover:bg-primary-dark transition-colors text-text-primary font-medium"
              >
                <Phone size={20} />
                <span>+254 745 247 211</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://linkedin.com/in/aggrey-ogeto" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary border border-border rounded-lg hover:border-secondary transition-colors text-text-primary"
                title="Connect on LinkedIn"
              >
                <Linkedin size={20} className="text-secondary" />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://github.com/aggreyogeto" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary border border-border rounded-lg hover:border-secondary transition-colors text-text-primary"
                title="View GitHub Profile"
              >
                <Github size={20} className="text-secondary" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://veyratech.co.ke" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary border border-border rounded-lg hover:border-secondary transition-colors text-text-primary"
                title="Visit VeyraTech Website"
              >
                <Globe size={20} className="text-secondary" />
                <span>VeyraTech</span>
              </a>
            </div>

            {/* Location */}
            <div className="flex justify-center items-center gap-2 text-text-muted mt-6">
              <MapPin size={16} />
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-8 text-center">
              About Me
            </h2>
            <div className="space-y-6 text-center">
              <p className="text-lg text-text-secondary leading-relaxed">
                I'm a technology entrepreneur and the founder of <a href="https://veyratech.co.ke" className="text-secondary hover:underline font-semibold">VeyraTech</a>, 
                a technology consulting company helping African businesses leverage AI, automation, 
                and digital transformation to grow sustainably.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                With years of experience in software development, AI implementation, and business 
                strategy, I'm passionate about building practical solutions that deliver real value—no 
                buzzwords, just results that matter.
              </p>
              <div className="bg-primary-dark border border-secondary/20 rounded-lg p-6 mt-8">
                <p className="text-text-primary text-center text-xl font-sora italic">
                  "Technology should solve problems, not create them."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I'm Building */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-12 text-center">
            What I'm Building
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <Card className="border-secondary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={36} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-sora font-bold text-text-primary">
                        VeyraTech
                      </h3>
                      <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full font-medium">
                        Active
                      </span>
                    </div>
                    <p className="text-lg text-text-secondary leading-relaxed mb-4">
                      VeyraTech is my flagship project—a technology consulting company focused on helping 
                      African businesses adopt AI, implement automation, and drive digital transformation. 
                      We provide practical, no-nonsense technology solutions that deliver measurable results.
                    </p>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-text-primary">Services We Provide:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>AI Strategy & Implementation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>Business Process Automation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>Digital Transformation Consulting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>Custom Software Development</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <a 
                        href="https://veyratech.co.ke" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-secondary hover:underline font-medium"
                      >
                        <span>Visit VeyraTech Website</span>
                        <Globe size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-4">
                Let's Connect
              </h2>
              <p className="text-lg text-text-secondary">
                Interested in working together or want to discuss a project? Fill out the form below and I'll get back to you soon.
              </p>
            </div>

            {isSubmitted ? (
              <Card className="border-success/50 bg-success/5">
                <CardContent className="p-8 text-center">
                  <CheckCircle size={64} className="text-success mx-auto mb-4" />
                  <h3 className="text-2xl font-sora font-bold text-text-primary mb-2">
                    Thank You!
                  </h3>
                  <p className="text-text-secondary mb-6">
                    I've received your message and will get back to you as soon as possible.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
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
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="+254 700 000 000"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none"
                        placeholder="Tell me about your project or how we can work together..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-500 text-sm">{error}</p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-full text-lg"
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

                  {/* Alternative Contact */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-center text-text-muted text-sm mb-4">
                      Prefer direct contact?
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <a 
                        href="mailto:aggrey@veyratech.co.ke"
                        className="text-secondary hover:underline text-sm flex items-center gap-2"
                      >
                        <Mail size={16} />
                        aggrey@veyratech.co.ke
                      </a>
                      <a 
                        href="tel:+254745247211"
                        className="text-secondary hover:underline text-sm flex items-center gap-2"
                      >
                        <Phone size={16} />
                        +254 745 247 211
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-primary-dark">
        <div className="container-custom text-center text-text-muted text-sm">
          <p className="mb-4 text-text-primary font-medium">
            Aggrey Gisemba Ogeto | Founder, VeyraTech
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <a href="mailto:aggrey@veyratech.co.ke" className="hover:text-secondary transition-colors">
              <Mail size={18} />
            </a>
            <a href="https://linkedin.com/in/aggrey-ogeto" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com/aggreyogeto" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <Github size={18} />
            </a>
            <a href="https://veyratech.co.ke" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <Globe size={18} />
            </a>
          </div>
          <p>© {new Date().getFullYear()} Aggrey Gisemba Ogeto. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
