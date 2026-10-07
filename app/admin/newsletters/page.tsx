"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/shared';
import { Mail, Download, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  phoneNumber?: string;
  status: string;
  subscriptionDate: string;
  lastEmailSent?: string;
}

export default function NewslettersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      // Fetch from your API endpoint
      const response = await fetch('/api/admin/newsletters');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers || []);
        calculateStats(data.subscribers || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subs: Subscriber[]) => {
    setStats({
      total: subs.length,
      active: subs.filter(s => s.status === 'ACTIVE').length,
      pending: subs.filter(s => s.status === 'PENDING_PAYMENT').length,
      cancelled: subs.filter(s => s.status === 'CANCELLED').length,
    });
  };

  const exportSubscribers = () => {
    const csv = [
      ['Email', 'Phone', 'Status', 'Subscription Date'].join(','),
      ...subscribers.map(s => 
        [s.email, s.phoneNumber || '', s.status, new Date(s.subscriptionDate).toLocaleDateString()].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sora font-bold text-text-primary mb-2">
            Newsletter Subscribers
          </h1>
          <p className="text-text-secondary">
            Manage your newsletter subscription list
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchSubscribers}>
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </Button>
          <Button onClick={exportSubscribers}>
            <Download size={18} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Total Subscribers</p>
                <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Pending Payment</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Cancelled</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-secondary font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-semibold">Subscribed</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-semibold">Last Email</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-text-secondary">
                      <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No subscribers yet</p>
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-border hover:bg-background-light">
                      <td className="py-3 px-4 text-text-primary">{subscriber.email}</td>
                      <td className="py-3 px-4 text-text-secondary">{subscriber.phoneNumber || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            subscriber.status === 'ACTIVE'
                              ? 'success'
                              : subscriber.status === 'PENDING_PAYMENT'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {subscriber.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">
                        {new Date(subscriber.subscriptionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-text-secondary">
                        {subscriber.lastEmailSent
                          ? new Date(subscriber.lastEmailSent).toLocaleDateString()
                          : 'Never'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
