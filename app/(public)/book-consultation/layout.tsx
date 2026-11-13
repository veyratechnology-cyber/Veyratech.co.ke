import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Book a 60-minute consultation with VeyraTech. Tell us about your business challenge and pick a time that suits you - online, by phone or in person.",
  openGraph: { title: "Book a Consultation | VeyraTech", description: "Book a 60-minute consultation with VeyraTech. Tell us about your business challenge and pick a time that suits you - online, by phone or in person.", url: "/book-consultation" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
