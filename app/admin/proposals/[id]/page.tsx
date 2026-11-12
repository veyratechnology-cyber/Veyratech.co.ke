import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProposalDetailClient from "./ProposalDetailClient";

export const dynamic = "force-dynamic";

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
    include: {
      lead: { select: { id: true, name: true, email: true } },
      assignedAdmin: { select: { name: true, email: true } },
    },
  });
  if (!proposal) notFound();
  return <ProposalDetailClient proposal={JSON.parse(JSON.stringify(proposal))} />;
}
