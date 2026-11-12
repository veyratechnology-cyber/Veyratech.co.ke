import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description: "Book a free consultation with VeyraTech. Tell us about your business challenge and pick a time that suits you - online, by phone or in person.",
  openGraph: { title: "Book a Free Consultation | VeyraTech", description: "Book a free consultation with VeyraTech. Tell us about your business challenge and pick a time that suits you - online, by phone or in person.", url: "/book-consultation" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
