import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "See how VeyraTech approaches real business problems with custom software, automation and system integration.",
  openGraph: { title: "Case Studies | VeyraTech", description: "See how VeyraTech approaches real business problems with custom software, automation and system integration.", url: "/case-studies" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
