import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, ShieldCheck, Clock } from "lucide-react";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team | VeyraTech Admin" };

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
      _count: { select: { leads: true, consultations: true, proposals: true, projects: true } },
    },
  });

  const active = admins.filter((a) => a.status === "ACTIVE").length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = admins.filter((a) => a.lastLoginAt && a.lastLoginAt.getTime() > weekAgo).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-sora font-bold text-text-primary">Team</h1>
        <p className="text-text-secondary">People who can sign in to this admin panel.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Users, label: "Admins", value: admins.length },
          { icon: ShieldCheck, label: "Active", value: active },
          { icon: Clock, label: "Signed in this week", value: recent },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-primary-dark p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-sm text-text-muted">{label}</p>
              <p className="text-2xl font-bold text-text-primary">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <TeamClient currentAdminId={session?.user?.id ?? ""} admins={JSON.parse(JSON.stringify(admins))} />
    </div>
  );
}
