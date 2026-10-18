import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared";
import { COMPANY, PUBLIC_NAV_ITEMS, SERVICE_AREAS } from "@/lib/constants";
import { Mail, Phone, Linkedin, Twitter } from "lucide-react";

/**
 * Public Website Footer
 * Mctaba Labs Brand Design - Navy + Orange
 * Company information and navigation links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark border-t border-border text-text-muted">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <Logo variant="full" theme="dark" className="mb-6" />
            <p className="text-text-muted mb-6">
              {COMPANY.description}
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-sora font-bold text-lg mb-4 text-text-primary">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-text-secondary hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-we-work"
                  className="text-text-secondary hover:text-secondary transition-colors"
                >
                  How We Work
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-text-secondary hover:text-secondary transition-colors"
                >
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-secondary hover:text-secondary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-text-secondary hover:text-secondary transition-colors"
                >
                  Client Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-sora font-bold text-lg mb-4 text-text-primary">Services</h3>
            <ul className="space-y-3">
              {SERVICE_AREAS.slice(0, 6).map((service) => (
                <li key={service.value}>
                  <Link
                    href="/services"
                    className="text-text-secondary hover:text-secondary transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sora font-bold text-lg mb-4 text-text-primary">Contact</h3>
            <ul className="space-y-4">
              <li>
                <div className="text-text-primary text-sm font-medium mb-1">General Inquiries</div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-secondary flex-shrink-0" />
                  <a
                    href="mailto:hello@veyratech.co.ke"
                    className="text-text-secondary hover:text-secondary transition-colors text-sm"
                  >
                    hello@veyratech.co.ke
                  </a>
                </div>
              </li>
              <li>
                <div className="text-text-primary text-sm font-medium mb-1">Consulting</div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-secondary flex-shrink-0" />
                  <a
                    href="mailto:consulting@veyratech.co.ke"
                    className="text-text-secondary hover:text-secondary transition-colors text-sm"
                  >
                    consulting@veyratech.co.ke
                  </a>
                </div>
              </li>
              <li>
                <div className="text-text-primary text-sm font-medium mb-1">Client Support</div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-secondary flex-shrink-0" />
                  <a
                    href="mailto:support@veyratech.co.ke"
                    className="text-text-secondary hover:text-secondary transition-colors text-sm"
                  >
                    support@veyratech.co.ke
                  </a>
                </div>
              </li>
              {COMPANY.phone && (
                <li>
                  <div className="text-text-primary text-sm font-medium mb-1">Phone</div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-secondary flex-shrink-0" />
                    <a
                      href={`tel:${COMPANY.phone}`}
                      className="text-text-secondary hover:text-secondary transition-colors text-sm"
                    >
                      {COMPANY.phone}
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm">
              © {currentYear} {COMPANY.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-text-muted hover:text-secondary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-text-muted hover:text-secondary transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
