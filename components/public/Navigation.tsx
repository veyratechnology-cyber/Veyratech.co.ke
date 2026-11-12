"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, Button } from "@/components/shared";
import { PUBLIC_NAV_ITEMS, PRIMARY_CTA, COMPANY } from "@/lib/constants";
import { Menu, X, ArrowRight, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Public Website Navigation (VeyraTech navy + orange)
 * Home · About Us · Services · Contact  +  Book Consultation
 */
export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || mobileMenuOpen
          ? "bg-primary/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-secondary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <nav className="container-custom" aria-label="Main">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex-shrink-0" aria-label="VeyraTech home">
            <Logo variant="full" theme="dark" />
          </Link>

          {/* Desktop */}
          <ul className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      active ? "bg-white/10 text-white" : "text-text-secondary hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block">
            <Button href={PRIMARY_CTA.href} variant="primary" size="sm" className="px-5 py-2.5">
              {PRIMARY_CTA.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden -mr-2 rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </header>

      {/* Mobile menu. Rendered outside <header>: the header's backdrop-filter would
          otherwise become the containing block for this fixed panel (height 0). */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-primary-dark transition-all duration-300",
          mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
      >
        <div className="container-custom flex min-h-full flex-col py-6">
          <ul className="space-y-1">
            {PUBLIC_NAV_ITEMS.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-4 text-xl font-sora font-semibold transition-colors",
                      active ? "bg-white/5 text-secondary" : "text-text-primary hover:bg-white/5"
                    )}
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-xs font-medium text-text-muted/50">0{i + 1}</span>
                      {item.label}
                    </span>
                    <ArrowRight size={18} className="text-text-muted/40" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto space-y-4 pt-8">
            <Button href={PRIMARY_CTA.href} variant="primary" size="lg" className="w-full">
              {PRIMARY_CTA.label}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <div className="flex justify-center gap-6 text-sm text-text-muted/80">
              <a href={`tel:${COMPANY.phone}`} className="inline-flex items-center gap-2 hover:text-secondary">
                <Phone size={15} aria-hidden="true" /> {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-2 hover:text-secondary">
                <Mail size={15} aria-hidden="true" /> Email us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
