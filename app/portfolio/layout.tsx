import React from "react";

/**
 * Portfolio Layout
 * Standalone layout without main navigation
 * Completely separate from the public website
 */
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
