import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RecordEditor from "@/components/admin/RecordEditor";
import { Mail, Phone, FileText, CalendarClock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lead | VeyraTech Admin" };

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    select: {
      email: true,
      phone: true,
      consultations: { select: { id: true, status: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5 },
      proposals: { select: { id: true, title: true, status: true }, orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  const aside = lead ? (
    <>
      <div className="rounded-2xl border border-white/10 bg-primary-dark p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Quick actions</h2>
        <div className="space-y-2">
          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-white/5">
            <Mail size={16} className="text-secondary" /> Email {lead.email}
          </a>
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-white/5">
              <Phone size={16} className="text-secondary" /> Call {lead.phone}
            </a>
          )}
          <Link href="/admin/proposals/new" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-white/5">
            <FileText size={16} className="text-secondary" /> Create proposal
          </Link>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-primary-dark p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Consultations</h2>
        {lead.consultations.length === 0 ? (
          <p className="text-sm text-text-muted">None yet</p>
        ) : (
          <ul className="space-y-2">
            {lead.consultations.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/consultations/${c.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                  <span className="flex items-center gap-2 text-text-primary">
                    <CalendarClock size={15} className="text-secondary" />
                    {new Date(c.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <span className="text-xs text-text-muted">{c.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {lead.proposals.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-primary-dark p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Proposals</h2>
          <ul className="space-y-2">
            {lead.proposals.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/proposals/${p.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                  <span className="truncate text-text-primary">{p.title}</span>
                  <span className="ml-2 text-xs text-text-muted">{p.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  ) : null;

  return <RecordEditor resource="leads" id={params.id} aside={aside} />;
}
