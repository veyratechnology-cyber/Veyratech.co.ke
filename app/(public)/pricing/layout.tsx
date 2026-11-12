import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Packages",
  description: "Transparent pricing in Kenyan Shillings for consultations, AI solutions and ongoing support packages from VeyraTech.",
  openGraph: { title: "Pricing & Packages | VeyraTech", description: "Transparent pricing in Kenyan Shillings for consultations, AI solutions and ongoing support packages from VeyraTech.", url: "/pricing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
