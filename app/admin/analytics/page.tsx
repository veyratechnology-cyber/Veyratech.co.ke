"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Target,
  Briefcase,
  FileText,
  Activity,
} from 'lucide-react';

const COLORS = ['#FC8436', '#1F1F1F', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30'); // Days

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${range}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-text-secondary">Loading analytics...</p>
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
            Analytics Dashboard
          </h1>
          <p className="text-text-secondary">
            Comprehensive insights into your business performance
          </p>
        </div>
        
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-primary-dark text-white"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`KSH ${analytics.revenue.total.toLocaleString()}`}
          subtitle={`${analytics.revenue.activeSubscriptions} active subs`}
          icon={<DollarSign size={24} />}
          color="text-green-600"
          bgColor="bg-green-100"
          trend={`+${analytics.revenue.conversionRate}%`}
        />
        
        <MetricCard
          title="Consultations"
          value={analytics.consultations.total}
          subtitle={`${analytics.consultations.completed} completed`}
          icon={<Calendar size={24} />}
          color="text-purple-600"
          bgColor="bg-purple-100"
          trend={`${analytics.consultations.conversionRate}% conversion`}
        />
        
        <MetricCard
          title="Leads"
          value={analytics.leads.total}
          subtitle={`${analytics.leads.qualified} qualified`}
          icon={<Users size={24} />}
          color="text-blue-600"
          bgColor="bg-blue-100"
          trend={`${analytics.leads.conversionRate}% won`}
        />
        
        <MetricCard
          title="Active Projects"
          value={analytics.projects.active}
          subtitle={`${analytics.projects.completed} completed recently`}
          icon={<Briefcase size={24} />}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenue.byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  stroke="#888"
                  tick={{ fill: '#888' }}
                />
                <YAxis stroke="#888" tick={{ fill: '#888' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F1F1F',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Revenue (KSH)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultation Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.consultations.byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  stroke="#888"
                  tick={{ fill: '#888' }}
                />
                <YAxis stroke="#888" tick={{ fill: '#888' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F1F1F',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#FC8436" name="Consultations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultation Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.consultations.byStatus}
                  dataKey="_count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.status}: ${entry._count}`}
                >
                  {analytics.consultations.byStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F1F1F',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={analytics.leads.bySource}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" tick={{ fill: '#888' }} />
                <YAxis 
                  type="category" 
                  dataKey="leadSource" 
                  stroke="#888"
                  tick={{ fill: '#888' }}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F1F1F',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="_count" fill="#3B82F6" name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proposal Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Active Proposals</span>
                  <span className="text-2xl font-bold text-text-primary">
                    {analytics.proposals.active}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Accepted</span>
                  <span className="text-2xl font-bold text-green-600">
                    {analytics.proposals.accepted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Acceptance Rate</span>
                  <span className="text-2xl font-bold text-secondary">
                    {analytics.proposals.acceptanceRate}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Total Subscriptions</span>
                  <span className="text-2xl font-bold text-text-primary">
                    {analytics.revenue.totalSubscriptions}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Active Now</span>
                  <span className="text-2xl font-bold text-green-600">
                    {analytics.revenue.activeSubscriptions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Pending Payment</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {analytics.revenue.pendingPayments}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prospect Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary">Total Prospects</span>
                    <span className="text-2xl font-bold text-text-primary">
                      {analytics.prospects.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Contact Rate</span>
                    <span className="text-2xl font-bold text-secondary">
                      {analytics.prospects.contactedRate}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: string;
}

function MetricCard({ title, value, subtitle, icon, color, bgColor, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${bgColor} ${color} p-3 rounded-lg`}>
            {icon}
          </div>
          {trend && (
            <span className="text-sm font-semibold text-green-500">
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-text-secondary mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-text-primary mb-1">
          {value}
        </p>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
