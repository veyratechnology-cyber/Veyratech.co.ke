"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, Button } from "@/components/shared";
import { PUBLIC_NAV_ITEMS, SOLUTIONS_DROPDOWN } from "@/lib/constants";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Public Website Navigation
 * VeyraTech Brand Design - Navy + Orange
 * Responsive header with mobile menu and Solutions dropdown
 */
export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setSolutionsOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border backdrop-blur-sm bg-opacity-95">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo variant="full" theme="dark" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {PUBLIC_NAV_ITEMS.map((item) => {
              // Solutions dropdown
              if (item.hasDropdown) {
                return (
                  <div key={item.href} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setSolutionsOpen(!solutionsOpen)}
                      onMouseEnter={() => setSolutionsOpen(true)}
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors hover:text-secondary",
                        isActive(item.href) || pathname.startsWith("/solutions")
                          ? "text-secondary"
                          : "text-text-secondary"
                      )}
                      aria-expanded={solutionsOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform",
                          solutionsOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {solutionsOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 w-72 bg-primary-dark border border-border rounded-lg shadow-xl py-2 z-50"
                        onMouseLeave={() => setSolutionsOpen(false)}
                      >
                        {SOLUTIONS_DROPDOWN.map((solution) => (
                          <Link
                            key={solution.href}
                            href={solution.href}
                            className="block px-4 py-3 hover:bg-primary transition-colors group"
                            onClick={() => setSolutionsOpen(false)}
                          >
                            <div className="font-medium text-text-primary group-hover:text-secondary transition-colors">
                              {solution.label}
                            </div>
                            <div className="text-sm text-text-muted mt-1">
                              {solution.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular navigation items
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-secondary",
                    isActive(item.href)
                      ? "text-secondary"
                      : "text-text-secondary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link href="/book-consultation">
              <Button variant="primary" size="md">
                Start Your Project
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-primary-dark">
          <div className="container-custom py-4 space-y-2">
            {PUBLIC_NAV_ITEMS.map((item) => {
              // Solutions dropdown in mobile
              if (item.hasDropdown) {
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                      className={cn(
                        "flex items-center justify-between w-full py-2 text-base font-medium transition-colors",
                        isActive(item.href) || pathname.startsWith("/solutions")
                          ? "text-secondary"
                          : "text-text-secondary hover:text-secondary"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        size={20}
                        className={cn(
                          "transition-transform",
                          mobileSolutionsOpen && "rotate-180"
                        )}
                      />
                    </button>
                    
                    {/* Mobile Solutions Submenu */}
                    {mobileSolutionsOpen && (
                      <div className="pl-4 mt-2 space-y-2">
                        {SOLUTIONS_DROPDOWN.map((solution) => (
                          <Link
                            key={solution.href}
                            href={solution.href}
                            className="block py-2 text-sm text-text-secondary hover:text-secondary transition-colors"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileSolutionsOpen(false);
                            }}
                          >
                            {solution.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular mobile menu items
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block py-2 text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "text-secondary"
                      : "text-text-secondary hover:text-secondary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/book-consultation" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full mt-4">
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
