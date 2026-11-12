import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "VeyraTech admin sign in.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
