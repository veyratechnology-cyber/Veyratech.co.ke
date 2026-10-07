"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, Button, LoadingSpinner } from '@/components/shared';
import { ArrowLeft, Send, Download, Eye, Printer } from 'lucide-react';
import Link from 'next/link';

export default function ProposalPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [proposalHtml, setProposalHtml] = useState('');
  const [proposalNumber, setProposalNumber] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    generateProposal();
  }, [proposalId]);

  const generateProposal = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setProposalHtml(data.html);
        setProposalNumber(data.proposalNumber);
      } else {
        alert('Failed to generate proposal');
      }
    } catch (error) {
      console.error('Error generating proposal:', error);
      alert('Failed to generate proposal');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(proposalHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([proposalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal-${proposalNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    if (!confirm('Send this proposal to the client via email?')) return;
    
    setSending(true);
    try {
      // TODO: Implement email sending
      alert('Email sending feature will be implemented soon!');
    } catch (error) {
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Generating proposal..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/proposals/${proposalId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-sora font-bold text-text-primary">
              Proposal Preview
            </h1>
            <p className="text-text-secondary">
              {proposalNumber}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download size={18} />
            Download HTML
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSendEmail}
            disabled={sending}
          >
            <Send size={18} />
            {sending ? 'Sending...' : 'Send to Client'}
          </Button>
        </div>
      </div>

      {/* Preview Card */}
      <Card>
        <CardContent className="p-0">
          <div 
            className="proposal-preview"
            dangerouslySetInnerHTML={{ __html: proposalHtml }}
            style={{
              background: 'white',
              minHeight: '297mm', // A4 height
            }}
          />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-secondary/30 bg-secondary/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            📝 Proposal Features
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>✅ <strong>Professional branding</strong> - VeyraTech logo and company details included</li>
            <li>✅ <strong>Print-ready</strong> - Optimized for A4 printing</li>
            <li>✅ <strong>Client-ready</strong> - Professional layout with executive summary</li>
            <li>✅ <strong>Unique proposal number</strong> - Generated automatically</li>
            <li>✅ <strong>Valid until date</strong> - Creates urgency (30 days default)</li>
            <li>✅ <strong>Call-to-action</strong> - Easy for clients to respond</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
