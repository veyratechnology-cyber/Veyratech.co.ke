"use client";

import React, { useState } from 'react';
import { Button } from '@/components/shared';
import { Loader2, CheckCircle, XCircle, Smartphone } from 'lucide-react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !phone) {
      setStatus('error');
      setMessage('Please provide both email and phone number');
      return;
    }

    setLoading(true);
    setStatus('processing');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phoneNumber: phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('processing');
        setMessage('Check your phone! Enter your M-Pesa PIN to complete payment of KSH 100.');
        setSubscriptionId(data.subscriptionId);

        // Poll for payment status
        pollPaymentStatus(data.subscriptionId);
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (subId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 1 minute (30 attempts x 2 seconds)

    const interval = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(`/api/newsletter/status?subscriptionId=${subId}`);
        const data = await response.json();

        if (data.success && data.subscription) {
          const { status: subStatus, paymentStatus } = data.subscription;

          if (paymentStatus === 'COMPLETED' && subStatus === 'ACTIVE') {
            clearInterval(interval);
            setStatus('success');
            setMessage('🎉 Payment successful! Welcome to VeyraTech Insights!');
            setEmail('');
            setPhone('');
          } else if (paymentStatus === 'FAILED') {
            clearInterval(interval);
            setStatus('error');
            setMessage('Payment failed. Please try again.');
          }
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setStatus('error');
          setMessage('Payment timeout. If you completed payment, you\'ll receive confirmation shortly.');
        }
      } catch (error) {
        console.error('Poll error:', error);
      }
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-border bg-primary-dark text-white placeholder:text-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
            disabled={loading || status === 'processing'}
            required
          />
        </div>

        {/* Phone Input */}
        <div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="M-Pesa Phone (e.g., 0712345678)"
            className="w-full px-4 py-3 rounded-lg border border-border bg-primary-dark text-white placeholder:text-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
            disabled={loading || status === 'processing'}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || status === 'processing'}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </>
            ) : status === 'processing' ? (
              <>
                <Smartphone size={18} />
                Awaiting Payment...
              </>
            ) : (
              <>
                Subscribe - KSH 100
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {message && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              status === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : status === 'error'
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : status === 'error' ? (
              <XCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <Smartphone size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message}</p>
          </div>
        )}
      </form>

      {/* Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-primary-dark border border-border">
          <h4 className="font-semibold text-white mb-2 text-sm">What You Get</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>✓ Weekly expert insights</li>
            <li>✓ Exclusive tech trends</li>
            <li>✓ Actionable strategies</li>
            <li>✓ 1 year access</li>
          </ul>
        </div>
        
        <div className="p-4 rounded-lg bg-primary-dark border border-border">
          <h4 className="font-semibold text-white mb-2 text-sm">Payment Info</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>💳 One-time KSH 100</li>
            <li>📱 M-Pesa STK Push</li>
            <li>🔒 Secure payment</li>
            <li>✉️ Instant confirmation</li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        By subscribing, you agree to receive emails from VeyraTech. Unsubscribe anytime.
      </p>
    </div>
  );
}
