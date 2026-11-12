import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Support",
  description: "Get help with a VeyraTech project or system. Contact our support team and we will respond as quickly as possible.",
  openGraph: { title: "Client Support | VeyraTech", description: "Get help with a VeyraTech project or system. Contact our support team and we will respond as quickly as possible.", url: "/support" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
