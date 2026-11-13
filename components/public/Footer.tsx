import React from "react";
import Link from "next/link";
import { Logo, Button } from "@/components/shared";
import { COMPANY, SOLUTIONS_DROPDOWN } from "@/lib/constants";
import { Mail, Phone, Linkedin, Twitter, ArrowRight } from "lucide-react";

// Same profiles as the structured data in lib/seo/structured-data.ts
const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/company/veyratech", label: "VeyraTech on LinkedIn", icon: Linkedin },
  { href: "https://twitter.com/veyratech", label: "VeyraTech on X (Twitter)", icon: Twitter },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/support", label: "Client Support" },
];

const CONTACT_EMAILS = [
  { label: "General inquiries", email: "hello@veyratech.co.ke" },
  { label: "Consulting", email: "consulting@veyratech.co.ke" },
  { label: "Client support", email: "support@veyratech.co.ke" },
];

const linkClass = "text-text-secondary/80 transition-colors hover:text-secondary";

/**
 * Public Website Footer (VeyraTech navy + orange)
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#04070D] text-text-muted">
      {/* Contact band */}
      <div className="border-b border-white/5">
        <div className="container-custom flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <div>
            <p className="font-sora text-2xl font-bold text-text-primary">Have a project in mind?</p>
            <p className="mt-1 text-text-secondary/80">Tell us what&apos;s slowing your business down and we&apos;ll show you how to fix it.</p>
          </div>
          <Button href="/book-consultation" variant="primary" className="flex-shrink-0">
            Book a Consultation Today
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="container-custom py-14">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="full" theme="dark" className="mb-6" />
            <p className="max-w-sm text-sm leading-relaxed text-text-muted/80">{COMPANY.description}</p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text-secondary transition-colors hover:border-secondary/60 hover:text-secondary"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Company">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Solutions">
            {SOLUTIONS_DROPDOWN.slice(0, 6).map((solution) => (
              <li key={solution.href}>
                <Link href={solution.href} className={linkClass}>
                  {solution.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            {CONTACT_EMAILS.map(({ label, email }) => (
              <li key={email}>
                <span className="block text-xs font-medium uppercase tracking-wider text-text-muted/60">{label}</span>
                <a href={`mailto:${email}`} className={`${linkClass} mt-1 inline-flex items-center gap-2 text-sm`}>
                  <Mail size={15} className="flex-shrink-0 text-secondary" aria-hidden="true" />
                  {email}
                </a>
              </li>
            ))}
            {COMPANY.phone && (
              <li>
                <span className="block text-xs font-medium uppercase tracking-wider text-text-muted/60">Phone</span>
                <a href={`tel:${COMPANY.phone}`} className={`${linkClass} mt-1 inline-flex items-center gap-2 text-sm`}>
                  <Phone size={15} className="flex-shrink-0 text-secondary" aria-hidden="true" />
                  {COMPANY.phone}
                </a>
              </li>
            )}
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm md:flex-row">
          <p className="text-text-muted/70">
            © {currentYear} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-text-muted/70 transition-colors hover:text-secondary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-text-muted/70 transition-colors hover:text-secondary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 font-sora text-sm font-semibold uppercase tracking-[0.14em] text-text-primary">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

export default Footer;
