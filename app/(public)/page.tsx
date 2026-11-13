import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Code,
  TrendingUp,
  Shield,
  Workflow,
  Mail,
  Phone,
  CalendarCheck,
  MessageSquare,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/shared";
import { COMPANY, METHODOLOGY } from "@/lib/constants";
import StructuredData from "@/components/seo/StructuredData";
import { generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema } from "@/lib/seo/structured-data";
import HeroVisual from "@/components/public/hero/HeroVisual";
import QuickContactForm from "@/components/public/QuickContactForm";

export const metadata: Metadata = {
  title: { absolute: "VeyraTech | Custom Software Development in Kenya" },
  description: "We build custom software solutions for Kenyan businesses—from websites and mobile apps to complete business management systems. Transform your operations with technology that actually works.",
  keywords: ["custom software development Kenya", "website development", "business management systems", "POS systems", "mobile app development", "system integration", "software solutions Nairobi"],
};

const CAPABILITIES = [
  "Websites",
  "Mobile Apps",
  "POS Systems",
  "Inventory",
  "CRM",
  "M-Pesa Integration",
  "Business Automation",
  "AI Solutions",
  "Cloud & Hosting",
];

const VALUES = [
  { title: "We listen first", text: "We learn your team's actual workflow before suggesting anything." },
  { title: "Root causes, not symptoms", text: "We fix what's really slowing you down, not just what's visible." },
  { title: "Fits your budget", text: "The simplest solution that solves the problem — no oversized systems." },
  { title: "Plain English", text: "No jargon. You'll always understand what we're building and why." },
];

const SERVICES = [
  { icon: Code, title: "Custom Software", description: "Business management systems, POS, inventory and CRM built around how you work.", href: "/solutions/custom-software" },
  { icon: Sparkles, title: "Websites & Mobile Apps", description: "Fast, professional websites and apps that win customers and take payments.", href: "/solutions/website-development" },
  { icon: Workflow, title: "Business Automation", description: "Eliminate repetitive work. Free your team for higher-value activities.", href: "/services" },
  { icon: Lightbulb, title: "AI Consulting", description: "Cut through the hype. Find where AI creates real, measurable value.", href: "/services" },
  { icon: Shield, title: "Digital Transformation", description: "Modernize operations, connect systems and move to the cloud without disruption.", href: "/services" },
  { icon: TrendingUp, title: "Technology Strategy", description: "Practical roadmaps and expert advice for big technology decisions.", href: "/services" },
];

const BOOKING_BENEFITS = [
  "A clear picture of what's slowing your business down",
  "Practical options that fit your budget",
  "An honest answer — including if you don't need us",
];

export default function HomePage() {
  return (
    <>
      <StructuredData data={generateWebSiteSchema()} />
      <StructuredData data={generateLocalBusinessSchema()} />

      {/* ================================================================ */}
      {/* HOME / HERO                                                       */}
      {/* ================================================================ */}
      <section id="home" className="relative -mt-20 overflow-hidden pt-20">
        <div className="pointer-events-none absolute inset-0 bg-glow" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />

        <div className="container-custom relative pb-10 pt-12 md:pt-16 lg:pb-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
            <div className="animate-rise text-center lg:text-left">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(252,132,54,0.9)]" />
                Software for Kenyan businesses
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl xl:text-[4.5rem]">
                Custom software that{" "}
                <span className="relative whitespace-nowrap text-secondary">
                  transforms
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" aria-hidden="true" preserveAspectRatio="none">
                    <path d="M2 10C60 2, 140 2, 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                your business
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-text-secondary/90 md:text-xl lg:mx-0">
                From websites and mobile apps to complete business management systems — we build software that
                connects your operations and helps you grow.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button href="/book-consultation" variant="primary" size="lg">
                  Book a Consultation Today
                  <ArrowRight size={20} aria-hidden="true" />
                </Button>
                <Button href="#services" variant="secondary" size="lg">
                  Explore Services
                </Button>
              </div>

              <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-text-muted/80 lg:justify-start">
                {["60-minute expert session", "No sales pitch", "Plain-English advice"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <HeroVisual />
          </div>
        </div>

        {/* Capability strip */}
        <div className="relative border-y border-white/5 bg-primary-dark/60 py-5 backdrop-blur-sm">
          <div className="container-custom">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-text-muted/70">
              {CAPABILITIES.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-secondary" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ABOUT US                                                          */}
      {/* ================================================================ */}
      <section id="about" className="section scroll-mt-20">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="eyebrow">About us</span>
              <h2 className="section-heading mt-5">Technology that makes your work easier — not harder</h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-text-secondary/90">
                <p>
                  Most technology firms will try to sell you a $500K enterprise solution when you really just need a
                  $5K workflow improvement. We started VeyraTech because we were tired of seeing businesses get burned
                  by consultants who prioritize billable hours over results.
                </p>
                <p>
                  <strong className="text-text-primary">Our promise:</strong> we&apos;ll tell you if you don&apos;t need
                  us, and we&apos;ll always recommend the simplest solution that solves your problem.
                </p>
              </div>
              <Button href="/about" variant="secondary" className="mt-8">
                More About Us
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <div key={v.title} className="panel p-6 transition-colors hover:border-secondary/30">
                  <span className="font-sora text-sm font-semibold text-secondary">0{i + 1}</span>
                  <h3 className="mt-3 text-lg">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-text-secondary/85">{v.text}</p>
                </div>
              ))}
              <blockquote className="sm:col-span-2 rounded-2xl border-l-4 border-secondary bg-secondary/[0.07] p-6 font-sora text-lg font-semibold leading-snug text-text-primary">
                &ldquo;Good technology should be invisible. It should just make your work easier and your business run
                better.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SERVICES                                                          */}
      {/* ================================================================ */}
      <section id="services" className="section scroll-mt-20 border-y border-white/5 bg-primary-dark">
        <div className="container-custom">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">Services</span>
              <h2 className="section-heading mt-5">What we build for you</h2>
              <p className="section-lead">No fluff, no complexity. Real solutions for real business problems.</p>
            </div>
            <Button href="/services" variant="secondary" className="flex-shrink-0">
              All Services
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, description, href }) => (
              <Link
                key={title}
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-primary/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-[0_20px_40px_-20px_rgba(252,132,54,0.35)]"
              >
                <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-secondary/0 blur-2xl transition-colors duration-500 group-hover:bg-secondary/15" aria-hidden="true" />
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-secondary/20 transition-colors group-hover:bg-secondary group-hover:text-white">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl">{title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-text-secondary/85">{description}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                  Learn more
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-20">
            <h3 className="text-center text-2xl md:text-3xl">How it works</h3>
            <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {METHODOLOGY.slice(0, 4).map((stage, i, arr) => (
                <li key={stage.number} className="relative">
                  {i < arr.length - 1 && (
                    <span className="absolute left-[calc(50%+2rem)] right-[calc(-50%+2rem)] top-7 hidden h-px bg-gradient-to-r from-secondary/50 to-white/5 xl:block" aria-hidden="true" />
                  )}
                  <div className="text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-secondary/40 bg-secondary/10 font-sora text-lg font-bold text-secondary">
                      {stage.number}
                    </span>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-secondary/80">{stage.phase}</p>
                    <h4 className="mt-2 text-lg">{stage.title}</h4>
                    <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-text-secondary/80">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* BOOK CONSULTATION                                                 */}
      {/* ================================================================ */}
      <section id="book" className="section scroll-mt-20">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl border border-secondary/25 bg-gradient-to-br from-secondary/20 via-primary-dark to-primary-dark">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
            <div className="relative grid gap-10 p-8 md:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="eyebrow">
                  <CalendarCheck size={14} aria-hidden="true" />
                  Book a consultation
                </span>
                <h2 className="mt-6 text-4xl md:text-5xl">Let&apos;s talk about your business</h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary/90">
                  An honest conversation about your challenges and how technology can help. No sales pitch, no jargon.
                </p>
                <ul className="mt-8 space-y-3">
                  {BOOKING_BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-text-primary/90">
                      <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-success" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-primary/70 p-7 backdrop-blur">
                <div className="space-y-4">
                  {[
                    { icon: CalendarCheck, title: "Pick a time", text: "Choose a date that suits you" },
                    { icon: MessageSquare, title: "Tell us your challenge", text: "A few details so we come prepared" },
                    { icon: Clock, title: "Meet online or in person", text: "Google Meet, phone, or at your office" },
                  ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-center gap-4">
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold text-text-primary">{title}</p>
                        <p className="text-sm text-text-muted/80">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button href="/book-consultation" variant="primary" size="lg" className="mt-7 w-full">
                  Book a Consultation Today
                  <ArrowRight size={20} aria-hidden="true" />
                </Button>
                <p className="mt-3 text-center text-xs text-text-muted/60">60 minutes · KSH 15,000 (excl. VAT) · pay after we confirm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CONTACT                                                           */}
      {/* ================================================================ */}
      <section id="contact" className="section scroll-mt-20 pt-0">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <span className="eyebrow">Contact</span>
              <h2 className="section-heading mt-5">Prefer to send a message?</h2>
              <p className="section-lead">Tell us what you&apos;re working on and we&apos;ll get back to you.</p>

              <ul className="mt-10 space-y-4">
                <li>
                  <a href={`mailto:${COMPANY.email}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 p-5 transition-colors hover:border-secondary/40">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Mail size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm text-text-muted/70">Email</span>
                      <span className="font-semibold text-text-primary group-hover:text-secondary">{COMPANY.email}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${COMPANY.phone}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 p-5 transition-colors hover:border-secondary/40">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Phone size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm text-text-muted/70">Phone</span>
                      <span className="font-semibold text-text-primary group-hover:text-secondary">{COMPANY.phone}</span>
                    </span>
                  </a>
                </li>
              </ul>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
                Full contact page <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-primary-dark p-6 md:p-8">
              <QuickContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
