import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Talk to VeyraTech about your software project. Email, call or send a message and our Nairobi team will get back to you.",
  openGraph: { title: "Contact Us | VeyraTech", description: "Talk to VeyraTech about your software project. Email, call or send a message and our Nairobi team will get back to you.", url: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
