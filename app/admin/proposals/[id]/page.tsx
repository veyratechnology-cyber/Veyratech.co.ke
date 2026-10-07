"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@/components/shared";
import { ArrowLeft, Send, Eye, Download } from "lucide-react";
import { PROPOSAL_STATUSES } from "@/lib/constants";

interface ProposalData {
  id: string;
  title: string;
  clientCompany: string;
  status: string;
  problem: string;
  objectives: string;
  scope: string;
  deliverables: string;
  timeline: string;
  investment: string;
  terms: string | null;
  createdAt: Date;
  sentAt: Date | null;
  viewedAt: Date | null;
  expirationDate: Date | null;
  lead: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignedAdmin: {
    name: string;
    email: string;
  } | null;
}

async function getProposalData(id: string): Promise<ProposalData> {
  const { prisma } = await import("@/lib/prisma");
  const { notFound } = await import("next/navigation");
  
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedAdmin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!proposal) {
    notFound();
  }

  return proposal as ProposalData;
}

export default async function ProposalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const initialProposal = await getProposalData(params.id);

  return <ProposalDetailClient proposal={initialProposal} />;
}

function ProposalDetailClient({ proposal: initialProposal }: { proposal: ProposalData }) {
  const router = useRouter();
  const [proposal, setProposal] = useState(initialProposal);
  const [isSending, setIsSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const getStatusColor = (status: string) => {
    const statusConfig = PROPOSAL_STATUSES.find((s) => s.value === status);
    return statusConfig?.color || "default";
  };

  const handleSendProposal = async () => {
    if (!proposal.lead?.email) {
      setSendMessage({ type: 'error', text: 'No client email available' });
      return;
    }

    if (!confirm(`Send proposal to ${proposal.lead.email}?`)) {
      return;
    }

    setIsSending(true);
    setSendMessage(null);

    try {
      const response = await fetch(`/api/admin/proposals/${proposal.id}/send`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSendMessage({ 
          type: 'success', 
          text: `Proposal sent successfully to ${proposal.lead.email}!` 
        });
        // Update local state
        setProposal({ ...proposal, status: 'SENT', sentAt: new Date() });
        // Refresh page data
        router.refresh();
      } else {
        setSendMessage({ 
          type: 'error', 
          text: data.error || 'Failed to send proposal' 
        });
      }
    } catch (error: any) {
      console.error('Send proposal error:', error);
      setSendMessage({ 
        type: 'error', 
        text: 'An error occurred while sending the proposal' 
      });
    } finally {
      setIsSending(false);
    }
  };

  const handlePreview = () => {
    window.open(`/api/admin/proposals/${proposal.id}/preview`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/proposals">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-sora font-bold text-text-primary">
              {proposal.title}
            </h1>
            <p className="text-text-secondary">{proposal.clientCompany}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusColor(proposal.status) as any}>
            {proposal.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSendProposal}
            disabled={isSending || !proposal.lead?.email}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90"
          >
            <Send size={16} />
            {isSending ? 'Sending...' : 'Send Proposal'}
          </Button>
        </div>
      </div>

      {/* Send Message Alert */}
      {sendMessage && (
        <div className={`p-4 rounded-lg ${
          sendMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {sendMessage.text}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary whitespace-pre-wrap">
                {proposal.problem}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary whitespace-pre-wrap">
                {proposal.objectives}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary whitespace-pre-wrap">
                {proposal.scope}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary whitespace-pre-wrap">
                {proposal.deliverables}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary whitespace-pre-wrap">
                {proposal.timeline}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary whitespace-pre-wrap">
                {proposal.investment}
              </p>
            </CardContent>
          </Card>

          {proposal.terms && (
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-primary whitespace-pre-wrap">
                  {proposal.terms}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  Created
                </label>
                <p className="text-text-primary">
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </p>
              </div>
              {proposal.sentAt && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Sent
                  </label>
                  <p className="text-text-primary">
                    {new Date(proposal.sentAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {proposal.viewedAt && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Viewed
                  </label>
                  <p className="text-text-primary">
                    {new Date(proposal.viewedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {proposal.expirationDate && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Expires
                  </label>
                  <p className="text-text-primary">
                    {new Date(proposal.expirationDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment */}
          {proposal.assignedAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-primary font-medium">
                  {proposal.assignedAdmin.name}
                </p>
                <p className="text-sm text-text-muted">
                  {proposal.assignedAdmin.email}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Linked Lead */}
          {proposal.lead && (
            <Card>
              <CardHeader>
                <CardTitle>Linked Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/admin/leads/${proposal.lead.id}`}
                  className="text-secondary hover:underline"
                >
                  {proposal.lead.name}
                </Link>
                <p className="text-sm text-text-muted">{proposal.lead.email}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
