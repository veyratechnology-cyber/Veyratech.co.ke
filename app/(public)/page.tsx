import React from "react";
import Link from "next/link";
import { Button } from "@/components/shared";
import { METHODOLOGY } from "@/lib/constants";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Code,
  TrendingUp,
  Shield,
  Target,
  Workflow,
  ShoppingCart,
  Package,
  Users,
  Smartphone,
  BarChart3,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";
import StructuredData from "@/components/seo/StructuredData";
import { generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "VeyraTech | Custom Software Development That Transforms Business Operations",
  description: "We build custom software solutions for Kenyan businesses—from websites and mobile apps to complete business management systems. Transform your operations with technology that actually works.",
  keywords: ["custom software development Kenya", "website development", "business management systems", "POS systems", "mobile app development", "system integration", "software solutions Nairobi"],
};

const PAIN_POINTS = [
  "Manual data entry eating up hours every day",
  "Different departments using different systems",
  "Simple reports take days to compile",
  "Legacy software nobody knows how to update",
  "Confused about where AI actually fits",
];

const OUR_APPROACH = [
  "Listen to your team's actual workflow",
  "Identify root causes, not just symptoms",
  "Recommend solutions that fit your budget",
  "Focus on quick wins that build momentum",
  "Explain everything in plain English",
];

const SERVICES = [
  {
    icon: TrendingUp,
    title: "Technology Strategy",
    description: "Build practical roadmaps that align with your business goals and budget.",
    features: ["Technology Assessment", "Digital Roadmap", "Vendor Selection"],
  },
  {
    icon: Lightbulb,
    title: "AI Consulting",
    description: "Cut through the hype. Find where AI creates real, measurable value.",
    features: ["AI Readiness Assessment", "Use Case Identification", "Implementation Support"],
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description: "Eliminate repetitive work. Free your team for higher-value activities.",
    features: ["Process Automation", "Workflow Optimization", "Integration Services"],
  },
  {
    icon: Shield,
    title: "Digital Transformation",
    description: "Modernize operations without disrupting your business.",
    features: ["System Integration", "Cloud Migration", "Change Management"],
  },
  {
    icon: Code,
    title: "Custom Software",
    description: "Build solutions when off-the-shelf doesn't fit your unique needs.",
    features: ["Web Applications", "Mobile Apps", "API Development"],
  },
  {
    icon: Target,
    title: "Technology Advisory",
    description: "Get expert guidance for major technology decisions.",
    features: ["Architecture Review", "Technology Selection", "Strategic Planning"],
  },
];

const AI_PRINCIPLES = [
  {
    title: "We Start With Your Problem, Not the Tech",
    description: "We'll never recommend AI just because it's trendy. We start by understanding what's actually costing you time and money.",
  },
  {
    title: "Responsible Adoption (Without the Corporate-Speak)",
    description: "We help you implement AI thoughtfully—considering privacy, ethics, and whether your team will actually use it.",
  },
  {
    title: "AI Should Make Your Team's Lives Easier",
    description: "The goal isn't to replace humans with robots. It's to free your team from boring tasks so they can do more interesting work.",
  },
  {
    title: "Show Me the ROI",
    description: "We focus on AI applications where you can clearly measure the return. If we can't explain how it'll save you time or money, we won't recommend it.",
  },
];

export default function HomePage() {
  return (
    <>
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateWebSiteSchema()} />
      <StructuredData data={generateLocalBusinessSchema()} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-glow" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />

        <div className="container-custom relative py-16 md:py-24 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-rise text-center lg:text-left">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(252,132,54,0.9)]" />
                Software for Kenyan businesses
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl xl:text-7xl">
                Custom software that{" "}
                <span className="relative whitespace-nowrap text-secondary">
                  transforms
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" aria-hidden="true" preserveAspectRatio="none">
                    <path d="M2 10C60 2, 140 2, 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                your business
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary/90 md:text-xl lg:mx-0">
                From websites and mobile apps to complete business management systems—we build software
                solutions that streamline operations and drive growth.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button href="/book-consultation" variant="primary" size="lg">
                  Start Your Project
                  <ArrowRight size={20} aria-hidden="true" />
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  View Solutions
                </Button>
              </div>

              <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-text-muted/80 lg:justify-start">
                {["Free first consultation", "No pressure, no sales pitch", "Plain-English advice"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Problem vs. approach */}
      <section className="section border-y border-white/5 bg-primary-dark">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">The problem</span>
            <h2 className="section-heading mt-5">Running a business without the right software?</h2>
            <p className="section-lead">Here&apos;s what we see businesses struggling with every day.</p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-3xl border border-white/10 md:grid-cols-2">
            <div className="bg-white/[0.02] p-8 md:p-10">
              <h3 className="flex items-center gap-3 text-xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                  <XCircle className="text-red-400" size={20} aria-hidden="true" />
                </span>
                The pain points
              </h3>
              <ul className="mt-7 space-y-4">
                {PAIN_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-text-secondary/90">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400/70" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative border-t border-white/10 bg-gradient-to-br from-secondary/[0.08] to-transparent p-8 md:border-l md:border-t-0 md:p-10">
              <h3 className="flex items-center gap-3 text-xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="text-success" size={20} aria-hidden="true" />
                </span>
                Our solution
              </h3>
              <ul className="mt-7 space-y-4">
                {OUR_APPROACH.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-text-primary/90">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-success" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button href="/book-consultation" variant="primary" size="lg">
              Let&apos;s Solve Your Challenges
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
            <p className="mt-4 text-sm text-text-muted/70">First consultation is always free · No pressure, no sales pitch</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container-custom">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">What we do</span>
              <h2 className="section-heading mt-5">Practical technology solutions</h2>
              <p className="section-lead">No fluff, no complexity. Just real solutions for real business problems.</p>
            </div>
            <Button href="/services" variant="secondary" className="flex-shrink-0">
              View All Services
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, description, features }) => (
              <Link
                key={title}
                href="/services"
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-primary-dark/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:bg-primary-dark hover:shadow-[0_20px_40px_-20px_rgba(252,132,54,0.35)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-secondary/20 transition-colors group-hover:bg-secondary group-hover:text-white">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-text-secondary/85">{description}</p>
                <ul className="mt-6 space-y-2 border-t border-white/5 pt-5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-text-muted/80">
                      <CheckCircle2 size={15} className="flex-shrink-0 text-success/80" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary opacity-80 transition-opacity group-hover:opacity-100">
                  Learn more
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI philosophy */}
      <section className="section border-y border-white/5 bg-primary-dark">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">About AI</span>
              <h2 className="section-heading mt-5">Let&apos;s cut through the hype</h2>
              <p className="section-lead">
                Yes, AI is revolutionary. No, it won&apos;t magically solve all your problems. And definitely no, you
                don&apos;t need to &quot;AI-ify&quot; everything in your business just because everyone else is talking about it.
              </p>
              <blockquote className="mt-8 rounded-2xl border-l-4 border-secondary bg-secondary/[0.07] p-6 text-text-secondary">
                <strong className="text-secondary">Here&apos;s our take:</strong> AI is incredibly powerful when applied to
                the right problems. Customer service chatbots? Great if you actually get repetitive questions.
                Predictive analytics? Awesome if you have clean data and know what to predict. AI-powered everything?
                That&apos;s usually a waste of money.
              </blockquote>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {AI_PRINCIPLES.map((principle, index) => (
                <div key={principle.title} className="panel p-6 transition-colors hover:border-secondary/30">
                  <span className="font-sora text-sm font-semibold text-secondary">0{index + 1}</span>
                  <h3 className="mt-3 text-lg leading-snug">{principle.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-text-secondary/85">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="section">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">How we work</span>
            <h2 className="section-heading mt-5">Our methodology</h2>
            <p className="section-lead">
              A structured approach to solving technology problems and delivering business value.
            </p>
          </div>

          <ol className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {METHODOLOGY.slice(0, 4).map((stage) => (
              <li key={stage.number} className="panel flex flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="font-sora text-4xl font-bold text-white/10">{stage.number}</span>
                  <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
                    {stage.phase}
                  </span>
                </div>
                <h3 className="mt-6 text-xl leading-snug">{stage.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary/85">{stage.description}</p>
                {stage.deliverables?.length ? (
                  <ul className="mt-auto space-y-1.5 border-t border-white/5 pt-5 text-sm text-text-muted/80">
                    {stage.deliverables.map((d: string) => (
                      <li key={d} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-secondary" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Button href="/how-we-work" variant="secondary" size="lg">
              Learn About Our Process
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* Real talk */}
      <section className="section pt-0">
        <div className="container-custom">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-primary-dark p-8 md:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" aria-hidden="true" />
            <span className="eyebrow">Real talk</span>
            <h2 className="mt-5 text-3xl md:text-4xl">Let&apos;s talk about the elephant in the room</h2>
            <div className="mt-8 grid gap-6 text-lg leading-relaxed text-text-secondary/90 md:grid-cols-2 md:gap-10">
              <p>
                <strong className="text-text-primary">Here&apos;s the truth:</strong> Most technology consulting firms
                will try to sell you a $500K enterprise solution when you really just need a $5K workflow improvement.
              </p>
              <p>
                We started VeyraTech because we were tired of seeing businesses get burned by consultants who
                prioritize billable hours over actual results. We&apos;ve been on both sides—we&apos;ve worked in corporate
                environments, we&apos;ve run operations, and we know what it&apos;s like when technology makes your life
                harder instead of easier.
              </p>
              <p className="md:col-span-2">
                <strong className="text-text-primary">So here&apos;s our promise:</strong> We&apos;ll tell you if you
                don&apos;t need us. We&apos;ll recommend the simplest solution that solves your problem. And we&apos;ll
                never use &quot;synergy&quot; in a sentence unironically.
              </p>
            </div>
            <p className="mt-8 border-t border-white/10 pt-8 font-sora text-xl font-semibold text-secondary">
              Good technology should be invisible. It should just make your work easier and your business run better.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="secondary">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section pt-0">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-gradient-to-br from-secondary/20 via-primary-dark to-primary-dark px-6 py-16 text-center md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl">
              <span className="eyebrow">
                <Clock size={14} aria-hidden="true" />
                Ready to get started?
              </span>
              <h2 className="mt-6 text-4xl md:text-5xl">Let&apos;s talk about your business</h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary/90 md:text-xl">
                Book a free consultation. No sales pitch. No jargon. Just an honest conversation about your challenges
                and how we can help.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/book-consultation" variant="primary" size="lg">
                  Book Free Consultation
                  <ArrowRight size={20} aria-hidden="true" />
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Send Us a Message
                </Button>
              </div>
              <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-text-muted/80">
                {["Free consultation", "No pressure", "No obligation"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Decorative hero visual: the business modules VeyraTech connects into one
 * system. Purely illustrative (no figures or claims), hidden from screen readers.
 */
function HeroIllustration() {
  const modules = [
    { icon: ShoppingCart, label: "Sales & POS" },
    { icon: Package, label: "Inventory" },
    { icon: Users, label: "Customers (CRM)" },
    { icon: Smartphone, label: "M-Pesa payments" },
    { icon: BarChart3, label: "Reports" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2rem] bg-secondary/10 blur-3xl" />
      <div className="relative rounded-3xl border border-white/10 bg-primary-dark/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="text-xs font-medium text-text-muted/70">your-business.app</span>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white">
            <Workflow size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">One connected system</p>
            <p className="text-xs text-text-muted/80">Every department, same data</p>
          </div>
        </div>

        <div className="relative mt-4 pl-6">
          <span className="absolute bottom-6 left-[11px] top-0 w-px bg-gradient-to-b from-secondary/60 to-white/5" />
        <ul className="space-y-2.5">
          {modules.map(({ icon: Icon, label }) => (
            <li key={label} className="relative flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
              <span className="absolute -left-[19px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-secondary/80 ring-4 ring-primary-dark" />
              <Icon size={18} className="text-secondary" />
              <span className="flex-1 text-sm text-text-primary">{label}</span>
              <span className="flex items-center gap-1.5 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Synced
              </span>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}
