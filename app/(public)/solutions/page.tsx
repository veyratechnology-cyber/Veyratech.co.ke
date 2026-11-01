import React from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/shared";
import { SOLUTIONS_DROPDOWN } from "@/lib/constants";
import { ArrowRight, Code, Smartphone, ShoppingCart, Settings, Zap, Network, Bot } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Solutions | VeyraTech",
  description: "Explore our software development solutions including Website Development, Custom Software, Business Systems, POS, Mobile Apps, System Integration, and AI Automation.",
  keywords: ["software solutions Kenya", "custom software", "website development", "mobile apps", "business systems"],
};

// Icon mapping for each solution
const SolutionIcons: Record<string, any> = {
  "/solutions/website-development": Code,
  "/solutions/custom-software": Settings,
  "/solutions/business-systems": Network,
  "/solutions/pos-inventory": ShoppingCart,
  "/solutions/mobile-apps": Smartphone,
  "/solutions/system-integration": Zap,
  "/solutions/ai-automation": Bot,
};

export default function SolutionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              Software Solutions
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Custom software development services designed to transform your business operations and drive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SOLUTIONS_DROPDOWN.map((solution) => {
              const IconComponent = SolutionIcons[solution.href] || Code;
              
              return (
                <Card key={solution.href} hover className="flex flex-col">
                  <CardContent className="p-8 flex flex-col flex-grow">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-6">
                      <IconComponent size={32} className="text-secondary" />
                    </div>
                    <h2 className="text-2xl font-sora font-bold text-text-primary mb-4">
                      {solution.label}
                    </h2>
                    <p className="text-text-secondary mb-6 leading-relaxed flex-grow">
                      {solution.description}
                    </p>
                    <Link href={solution.href}>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Custom Software Section */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-center mb-12">
              Why Choose Custom Software?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-sora font-bold text-text-primary mb-4">
                  Perfect Fit for Your Business
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Unlike off-the-shelf software, custom solutions are built specifically for your workflows, processes, and requirements. No compromises, no unnecessary features—just what you need.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-sora font-bold text-text-primary mb-4">
                  Competitive Advantage
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Custom software gives you unique capabilities that your competitors don't have. Automate your specific processes and operate more efficiently than businesses using generic tools.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-sora font-bold text-text-primary mb-4">
                  Scalability & Control
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Your software grows with your business. Add features as needed, integrate with new systems, and maintain complete control over your data and operations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-sora font-bold text-text-primary mb-4">
                  Long-Term Cost Savings
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  While initial investment may be higher, custom software eliminates recurring subscription fees and reduces the need for manual workarounds and multiple tools.
                </p>
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
              Let's Build Your Solution
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Schedule a consultation to discuss your software needs and explore how we can help.
            </p>
            <Link href="/book-consultation">
              <Button variant="secondary" size="lg" className="bg-primary-dark text-secondary hover:bg-primary">
                Start Your Project
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
