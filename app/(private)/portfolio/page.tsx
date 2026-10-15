"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Calendar,
  MapPin
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/shared";

/**
 * Private Portfolio Page
 * Accessible via secret link with password protection
 */
export default function PortfolioPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simple password protection (you can change this password)
  const PORTFOLIO_PASSWORD = process.env.NEXT_PUBLIC_PORTFOLIO_PASSWORD || "VeyraTech2024!";

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("portfolio_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PORTFOLIO_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("portfolio_auth", "true");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  // Password Protection Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              🔒 Private Portfolio Access
            </CardTitle>
            <p className="text-center text-text-secondary text-sm">
              This portfolio is private. Please enter the password to continue.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-primary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-secondary focus:border-transparent"
                  autoFocus
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Access Portfolio
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Portfolio Content
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative bg-primary-dark border-b border-border">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Profile Image Placeholder */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center text-4xl font-bold text-white">
              AG
            </div>
            
            <h1 className="text-4xl md:text-6xl font-sora font-bold text-text-primary mb-4">
              Aggrey Gisemba Ogeto
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary mb-4">
              Technology Entrepreneur & AI Strategist
            </p>
            
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Founder of VeyraTech | Building practical technology solutions that help businesses grow
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a 
                href="mailto:aggrey@veyratech.co.ke" 
                className="flex items-center gap-2 px-6 py-3 bg-primary border border-border rounded-lg hover:bg-primary-dark transition-colors text-text-primary"
              >
                <Mail size={20} />
                <span>Email Me</span>
              </a>
              <a 
                href="tel:+254745247211" 
                className="flex items-center gap-2 px-6 py-3 bg-primary border border-border rounded-lg hover:bg-primary-dark transition-colors text-text-primary"
              >
                <Phone size={20} />
                <span>Call</span>
              </a>
              <a 
                href="https://linkedin.com/in/aggrey-ogeto" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-primary border border-border rounded-lg hover:bg-primary-dark transition-colors text-text-primary"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Location & Availability */}
            <div className="flex flex-wrap justify-center gap-6 text-text-muted">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>Available for consulting</span>
              </div>
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
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-text-secondary leading-relaxed mb-4">
                I'm a technology entrepreneur passionate about helping businesses leverage technology 
                to solve real problems. With years of experience in software development, AI consulting, 
                and digital transformation, I founded VeyraTech to provide practical, no-nonsense 
                technology solutions to businesses across Africa.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                My approach is simple: listen first, understand the problem, then recommend solutions 
                that actually work. No buzzwords, no unnecessary complexity—just results that matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-12 text-center">
            What I'm Building
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* VeyraTech */}
            <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Briefcase className="text-secondary" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full">
                    Active
                  </span>
                </div>
                <CardTitle>VeyraTech</CardTitle>
                <p className="text-text-secondary">Technology & AI Consulting Firm</p>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  A technology consulting company helping businesses across Africa adopt and 
                  implement practical technology solutions. Services include AI consulting, 
                  automation, digital transformation, and technology strategy.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Target size={16} className="text-secondary" />
                    <span>Helping 50+ businesses transform digitally</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <TrendingUp size={16} className="text-secondary" />
                    <span>95% client satisfaction rate</span>
                  </div>
                </div>
                <a 
                  href="https://veyratech.co.ke" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-secondary hover:underline"
                >
                  <span>Visit Website</span>
                  <ExternalLink size={16} />
                </a>
              </CardContent>
            </Card>

            {/* Add More Projects Here */}
            <Card className="border-border hover:border-secondary/30 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Rocket className="text-secondary" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full">
                    In Development
                  </span>
                </div>
                <CardTitle>AI Automation Platform</CardTitle>
                <p className="text-text-secondary">Workflow Automation for SMEs</p>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Building an accessible AI-powered automation platform specifically designed 
                  for small and medium enterprises in Africa. Focuses on practical automation 
                  that delivers immediate value.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Code size={16} className="text-secondary" />
                    <span>Next.js, Python, OpenAI</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Calendar size={16} className="text-secondary" />
                    <span>Launch: Q1 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="section">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-12 text-center">
            Skills & Expertise
          </h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Code size={24} className="text-secondary" />
                </div>
                <h3 className="font-sora font-bold text-xl mb-3 text-text-primary">
                  Technical Skills
                </h3>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Full-Stack Development</li>
                  <li>• AI & Machine Learning</li>
                  <li>• Cloud Architecture (AWS, GCP)</li>
                  <li>• Database Design</li>
                  <li>• API Development</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Target size={24} className="text-secondary" />
                </div>
                <h3 className="font-sora font-bold text-xl mb-3 text-text-primary">
                  Business Strategy
                </h3>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Technology Strategy</li>
                  <li>• Digital Transformation</li>
                  <li>• Process Optimization</li>
                  <li>• Vendor Selection</li>
                  <li>• ROI Analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Award size={24} className="text-secondary" />
                </div>
                <h3 className="font-sora font-bold text-xl mb-3 text-text-primary">
                  Leadership
                </h3>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Team Building</li>
                  <li>• Project Management</li>
                  <li>• Client Relations</li>
                  <li>• Consulting</li>
                  <li>• Mentorship</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-text-primary mb-6">
              Let's Work Together
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              I'm always interested in discussing new projects, technology challenges, 
              and collaboration opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:aggrey@veyratech.co.ke">
                <Button variant="primary" size="lg" className="text-lg px-8">
                  <Mail size={20} />
                  Get In Touch
                </Button>
              </a>
              <a href="https://veyratech.co.ke/book-consultation" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Book a Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container-custom text-center text-text-muted text-sm">
          <p>© {new Date().getFullYear()} Aggrey Gisemba Ogeto. All rights reserved.</p>
          <p className="mt-2">This is a private portfolio. Please do not share the access link.</p>
        </div>
      </footer>
    </div>
  );
}
