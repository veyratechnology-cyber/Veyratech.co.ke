"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, Button } from "@/components/shared";
import { PUBLIC_NAV_ITEMS, SOLUTIONS_DROPDOWN } from "@/lib/constants";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Public Website Navigation (VeyraTech navy + orange)
 * - Translucent header that gains a border/shadow once the page scrolls
 * - Accessible Solutions dropdown (hover, click, keyboard, Escape)
 * - Full-height mobile menu with scroll lock
 */
export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSolutionsOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    setSolutionsOpen(false);
    setMobileMenuOpen(false);
    setMobileSolutionsOpen(false);
  }, [pathname]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSolutionsOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setSolutionsOpen(false), 150);
  };

  const solutionsActive = pathname.startsWith("/solutions");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || mobileMenuOpen
          ? "bg-primary/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]"
          : "bg-primary/60 backdrop-blur-md border-b border-transparent"
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

          {/* Desktop navigation */}
          <ul className="hidden xl:flex items-center gap-1">
            {PUBLIC_NAV_ITEMS.map((item) => {
              if (item.hasDropdown) {
                return (
                  <li
                    key={item.href}
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={openDropdown}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      type="button"
                      onClick={() => setSolutionsOpen((v) => !v)}
                      className={cn(
                        "relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        solutionsActive || solutionsOpen ? "text-white" : "text-text-secondary hover:text-white"
                      )}
                      aria-expanded={solutionsOpen}
                      aria-haspopup="true"
                      aria-controls="solutions-menu"
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={cn("transition-transform duration-200", solutionsOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                      {solutionsActive && <ActiveDot />}
                    </button>

                    <div
                      id="solutions-menu"
                      className={cn(
                        "absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3 transition-all duration-200",
                        solutionsOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0 pointer-events-none"
                      )}
                    >
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-primary-dark/95 p-2 shadow-2xl backdrop-blur-xl">
                        {SOLUTIONS_DROPDOWN.map((solution) => (
                          <Link
                            key={solution.href}
                            href={solution.href}
                            className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                            onClick={() => setSolutionsOpen(false)}
                            tabIndex={solutionsOpen ? 0 : -1}
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary/60 transition-colors group-hover:bg-secondary" />
                            <span>
                              <span className="block text-sm font-semibold text-text-primary transition-colors group-hover:text-secondary">
                                {solution.label}
                              </span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-text-muted/80">
                                {solution.description}
                              </span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          href="/solutions"
                          className="mt-1 flex items-center justify-between rounded-xl border-t border-white/5 px-3 py-3 text-sm font-medium text-secondary hover:bg-secondary/10"
                          tabIndex={solutionsOpen ? 0 : -1}
                        >
                          View all solutions <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              }

              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "text-white" : "text-text-secondary hover:text-white"
                    )}
                  >
                    {item.label}
                    {active && <ActiveDot />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden xl:block">
            <Button href="/book-consultation" variant="primary" size="sm" className="px-5 py-2.5">
              Start Your Project
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="xl:hidden -mr-2 rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "xl:hidden fixed inset-x-0 top-20 bottom-0 overflow-y-auto border-t border-white/10 bg-primary-dark backdrop-blur-xl transition-all duration-300",
          mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
      >
        <div className="container-custom flex min-h-full flex-col py-6">
          <ul className="space-y-1">
            {PUBLIC_NAV_ITEMS.map((item) => {
              if (item.hasDropdown) {
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => setMobileSolutionsOpen((v) => !v)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-medium transition-colors",
                        solutionsActive ? "bg-white/5 text-secondary" : "text-text-primary hover:bg-white/5"
                      )}
                      aria-expanded={mobileSolutionsOpen}
                    >
                      {item.label}
                      <ChevronDown
                        size={20}
                        className={cn("transition-transform", mobileSolutionsOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    {mobileSolutionsOpen && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {SOLUTIONS_DROPDOWN.map((solution) => (
                          <li key={solution.href}>
                            <Link
                              href={solution.href}
                              className="block rounded-lg px-3 py-2.5 text-[15px] text-text-secondary transition-colors hover:bg-white/5 hover:text-secondary"
                            >
                              {solution.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-lg font-medium transition-colors",
                      active ? "bg-white/5 text-secondary" : "text-text-primary hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-8">
            <Button href="/book-consultation" variant="primary" size="lg" className="w-full">
              Start Your Project
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <p className="mt-3 text-center text-sm text-text-muted/70">
              Free first consultation · Reply within 24 hours
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function ActiveDot() {
  return (
    <span
      aria-hidden="true"
      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-secondary shadow-[0_0_8px_rgba(252,132,54,0.9)]"
    />
  );
}

export default Navigation;
