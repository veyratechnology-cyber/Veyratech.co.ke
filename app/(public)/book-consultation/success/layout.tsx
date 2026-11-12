import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your VeyraTech consultation request has been received.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
