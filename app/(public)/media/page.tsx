import React from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/shared";
import { ArrowRight, Award, Newspaper, Users, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import StructuredData from "@/components/seo/StructuredData";
import { generateOrganizationSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Media & Press | VeyraTech - Technology Consulting Leader in Kenya",
  description: "Learn about VeyraTech's impact in Kenya's technology sector. Press releases, media coverage, awards, and company news from VeyraTech.",
  keywords: ["VeyraTech media", "VeyraTech press", "VeyraTech news", "technology consulting Kenya news"],
};

export default function MediaPage() {
  const organizationSchema = generateOrganizationSchema();

  const pressReleases = [
    {
      date: "2026-08-15",
      title: "VeyraTech Launches Enhanced AI Consulting Services for Kenyan SMEs",
      excerpt: "VeyraTech announces expanded AI consulting services designed specifically for small and medium enterprises in Kenya, making AI adoption accessible and affordable.",
      link: "#",
    },
    {
      date: "2026-07-10",
      title: "VeyraTech Helps Local Businesses Achieve 40% Efficiency Gains",
      excerpt: "Case study reveals how VeyraTech's business automation solutions helped Kenyan companies save an average of 15 hours per week in manual processes.",
      link: "#",
    },
  ];

  const mediaStats = [
    { icon: Award, label: "Client Success Rate", value: "98%" },
    { icon: Users, label: "Businesses Served", value: "50+" },
    { icon: TrendingUp, label: "Average ROI", value: "3x" },
    { icon: Newspaper, label: "Years of Experience", value: "5+" },
  ];

  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData data={organizationSchema} />

      {/* Hero Section */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6 text-text-primary">
              VeyraTech in the News
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Press releases, media coverage, and company updates from VeyraTech
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-sora font-bold text-center mb-12 text-text-primary">
              VeyraTech by the Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {mediaStats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                      <stat.icon className="text-secondary" size={32} />
                    </div>
                    <div className="text-3xl font-sora font-bold text-secondary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About VeyraTech */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-sora font-bold mb-6 text-text-primary">
              About VeyraTech
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-text-primary leading-relaxed mb-4">
                VeyraTech is a leading technology consulting firm based in Nairobi, Kenya, 
                specializing in AI strategy, digital transformation, and business automation. 
                Founded with a mission to make technology accessible and practical for businesses 
                of all sizes, VeyraTech has become a trusted partner for organizations across 
                East Africa.
              </p>
              <p className="text-lg text-text-primary leading-relaxed mb-4">
                Unlike traditional consulting firms that prioritize billable hours over outcomes, 
                VeyraTech takes a results-first approach. The company focuses on delivering 
                measurable business value through practical technology solutions that align with 
                client budgets and capabilities.
              </p>
              <p className="text-lg text-text-primary leading-relaxed">
                With expertise spanning AI consulting, cloud solutions, custom software development, 
                and business process automation, VeyraTech serves clients in industries including 
                professional services, financial services, healthcare, manufacturing, and retail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-sora font-bold mb-8 text-text-primary">
              Recent Press Releases
            </h2>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <Card key={index} hover>
                  <CardContent className="p-6">
                    <div className="text-sm text-text-muted mb-2">
                      {new Date(release.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-xl font-sora font-semibold mb-3 text-text-primary">
                      {release.title}
                    </h3>
                    <p className="text-text-secondary mb-4">
                      {release.excerpt}
                    </p>
                    <Link href={release.link}>
                      <Button variant="outline" size="sm">
                        Read More
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="section bg-primary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-sora font-bold mb-4 text-text-primary">
                  Media & Press Inquiries
                </h2>
                <p className="text-lg text-text-secondary mb-6">
                  For press inquiries, interviews, or partnership opportunities, please contact our media relations team.
                </p>
                <div className="space-y-3 mb-8">
                  <p className="text-text-primary">
                    <strong>Email:</strong>{" "}
                    <a href="mailto:press@veyratech.co.ke" className="text-secondary hover:underline">
                      press@veyratech.co.ke
                    </a>
                  </p>
                  <p className="text-text-primary">
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+254745247211" className="text-secondary hover:underline">
                      +254 745 247 211
                    </a>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/about">
                    <Button variant="primary">
                      About VeyraTech
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="section bg-primary-dark">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-sora font-bold mb-6 text-text-primary">
              Brand Assets & Media Kit
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Download our logo, brand guidelines, and official company information for media use.
            </p>
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-text-primary">Company Logo</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      High-resolution VeyraTech logo in various formats
                    </p>
                    <Button variant="outline" size="sm">
                      Download Logo
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-text-primary">Brand Guidelines</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Official brand colors, fonts, and usage guidelines
                    </p>
                    <Button variant="outline" size="sm">
                      View Guidelines
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-text-primary">Fact Sheet</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Quick facts about VeyraTech and our services
                    </p>
                    <Button variant="outline" size="sm">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
