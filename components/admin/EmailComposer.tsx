"use client";

import React, { useState } from 'react';
import { Button, Input, Select, Textarea } from '@/components/shared';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface EmailComposerProps {
  recipientEmail?: string;
  recipientName?: string;
  recipientCompany?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EmailComposer({
  recipientEmail: initialEmail = '',
  recipientName: initialName = '',
  recipientCompany = '',
  onSuccess,
  onCancel,
}: EmailComposerProps) {
  const [emailType, setEmailType] = useState<'custom' | 'proposal' | 'followup'>('custom');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Common fields
  const [recipientEmail, setRecipientEmail] = useState(initialEmail);
  const [recipientName, setRecipientName] = useState(initialName);

  // Custom email fields
  const [subject, setSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [includeCallToAction, setIncludeCallToAction] = useState(false);
  const [callToActionText, setCallToActionText] = useState('');
  const [callToActionUrl, setCallToActionUrl] = useState('');

  // Proposal fields
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalSummary, setProposalSummary] = useState('');
  const [proposalUrl, setProposalUrl] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  // Follow-up fields
  const [lastInteraction, setLastInteraction] = useState('');
  const [followUpMessage, setFollowUpMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const payload: any = {
        to: recipientEmail,
        type: emailType,
        recipientName,
      };

      if (emailType === 'custom') {
        payload.subject = subject;
        payload.message = emailMessage;
        payload.includeCallToAction = includeCallToAction;
        if (includeCallToAction) {
          payload.callToActionText = callToActionText;
          payload.callToActionUrl = callToActionUrl;
        }
      } else if (emailType === 'proposal') {
        payload.clientCompany = recipientCompany;
        payload.proposalTitle = proposalTitle;
        payload.proposalSummary = proposalSummary;
        payload.proposalUrl = proposalUrl;
        if (expirationDate) {
          payload.expirationDate = expirationDate;
        }
      } else if (emailType === 'followup') {
        payload.lastInteraction = lastInteraction;
        payload.message = followUpMessage;
        if (includeCallToAction) {
          payload.callToActionText = callToActionText;
          payload.callToActionUrl = callToActionUrl;
        }
      }

      const response = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Email sent successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send email');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while sending the email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-dark rounded-lg border border-border p-6">
      <h2 className="text-2xl font-sora font-bold text-text-primary mb-6">
        Compose Email
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Type Selection */}
        <Select
          label="Email Type"
          value={emailType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEmailType(e.target.value as any)}
          options={[
            { value: 'custom', label: 'Custom Email' },
            { value: 'proposal', label: 'Proposal Email' },
            { value: 'followup', label: 'Follow-up Email' },
          ]}
          required
        />

        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Recipient Email"
            type="email"
            value={recipientEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientEmail(e.target.value)}
            placeholder="client@company.com"
            required
          />
          <Input
            label="Recipient Name"
            type="text"
            value={recipientName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Custom Email Fields */}
        {emailType === 'custom' && (
          <>
            <Input
              label="Subject"
              type="text"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              placeholder="Your subject line"
              required
            />
            <Textarea
              label="Message"
              value={emailMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              required
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeCTA"
                checked={includeCallToAction}
                onChange={(e) => setIncludeCallToAction(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-primary-dark text-secondary focus:ring-2 focus:ring-secondary"
              />
              <label htmlFor="includeCTA" className="text-sm text-text-primary">
                Include Call-to-Action Button
              </label>
            </div>

            {includeCallToAction && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <Input
                  label="Button Text"
                  type="text"
                  value={callToActionText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCallToActionText(e.target.value)}
                  placeholder="Book a Call"
                />
                <Input
                  label="Button URL"
                  type="url"
                  value={callToActionUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCallToActionUrl(e.target.value)}
                  placeholder="https://veyratech.co.ke/book-consultation"
                />
              </div>
            )}
          </>
        )}

        {/* Proposal Email Fields */}
        {emailType === 'proposal' && (
          <>
            <Input
              label="Proposal Title"
              type="text"
              value={proposalTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProposalTitle(e.target.value)}
              placeholder="Digital Transformation Strategy"
              required
            />
            <Textarea
              label="Proposal Summary"
              value={proposalSummary}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProposalSummary(e.target.value)}
              placeholder="Brief overview of the proposal..."
              rows={4}
              required
            />
            <Input
              label="Proposal URL"
              type="url"
              value={proposalUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProposalUrl(e.target.value)}
              placeholder="https://veyratech.co.ke/proposals/xyz"
              required
            />
            <Input
              label="Expiration Date (Optional)"
              type="date"
              value={expirationDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpirationDate(e.target.value)}
            />
          </>
        )}

        {/* Follow-up Email Fields */}
        {emailType === 'followup' && (
          <>
            <Input
              label="Last Interaction"
              type="text"
              value={lastInteraction}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastInteraction(e.target.value)}
              placeholder="our consultation call last week"
              required
            />
            <Textarea
              label="Follow-up Message"
              value={followUpMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFollowUpMessage(e.target.value)}
              placeholder="I wanted to check in about..."
              rows={6}
              required
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeFollowupCTA"
                checked={includeCallToAction}
                onChange={(e) => setIncludeCallToAction(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-primary-dark text-secondary focus:ring-2 focus:ring-secondary"
              />
              <label htmlFor="includeFollowupCTA" className="text-sm text-text-primary">
                Include Call-to-Action Button
              </label>
            </div>

            {includeCallToAction && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <Input
                  label="Button Text"
                  type="text"
                  value={callToActionText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCallToActionText(e.target.value)}
                  placeholder="Schedule a Call"
                />
                <Input
                  label="Button URL"
                  type="url"
                  value={callToActionUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCallToActionUrl(e.target.value)}
                  placeholder="https://calendly.com/veyratech"
                />
              </div>
            )}
          </>
        )}

        {/* Status Messages */}
        {message && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              status === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0" />
            ) : (
              <XCircle size={20} className="flex-shrink-0" />
            )}
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Email
              </>
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
