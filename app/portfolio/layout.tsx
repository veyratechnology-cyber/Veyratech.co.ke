import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Aggrey Gisemba Ogeto | Founder & CEO, VeyraTech" },
  description: "Aggrey Gisemba Ogeto, Founder & CEO of VeyraTech - building technology and consulting solutions in AI strategy, automation and software development.",
};

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
