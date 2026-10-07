import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/shared';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Phone,
  Calendar,
  Activity,
  Settings,
  MoreVertical,
} from 'lucide-react';

export const metadata = {
  title: 'Team Management | VeyraTech Admin',
};

// Mock data - in production, fetch from database
const teamMembers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@veyratech.co.ke',
    role: 'OWNER',
    status: 'ACTIVE',
    department: 'Management',
    jobTitle: 'Founder & CEO',
    phone: '+254 712 345 678',
    joinedAt: new Date('2024-01-01'),
    lastActiveAt: new Date(),
  },
];

const roleColors: Record<string, string> = {
  OWNER: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  MANAGER: 'bg-green-100 text-green-700',
  TEAM_MEMBER: 'bg-gray-100 text-gray-700',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INVITED: 'bg-yellow-100 text-yellow-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  INACTIVE: 'bg-gray-100 text-gray-700',
};

export default function TeamManagementPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sora font-bold text-text-primary mb-2">
            Team Management
          </h1>
          <p className="text-text-secondary">
            Manage team members, roles, and permissions
          </p>
        </div>
        
        <Button variant="primary">
          <UserPlus size={18} />
          Invite Team Member
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="text-blue-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {teamMembers.length}
            </div>
            <div className="text-sm text-text-secondary">Total Members</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Activity className="text-green-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {teamMembers.filter((m) => m.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-text-secondary">Active Members</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Shield className="text-purple-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {teamMembers.filter((m) => ['OWNER', 'ADMIN'].includes(m.role)).length}
            </div>
            <div className="text-sm text-text-secondary">Admins</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Mail className="text-yellow-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {teamMembers.filter((m) => m.status === 'INVITED').length}
            </div>
            <div className="text-sm text-text-secondary">Pending Invites</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-6 border border-border rounded-lg hover:bg-primary-dark/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary font-bold text-lg">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {member.name}
                        </h3>
                        <Badge className={roleColors[member.role]}>
                          {member.role}
                        </Badge>
                        <Badge className={statusColors[member.status]}>
                          {member.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-secondary">
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            {member.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          Joined {member.joinedAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity size={14} />
                          Last active {getRelativeTime(member.lastActiveAt)}
                        </div>
                      </div>

                      {member.department && (
                        <div className="mt-2 text-sm">
                          <span className="text-text-muted">{member.department}</span>
                          {member.jobTitle && (
                            <>
                              <span className="text-text-muted mx-2">•</span>
                              <span className="text-text-secondary">{member.jobTitle}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings size={16} />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={roleColors.OWNER}>OWNER</Badge>
              </div>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Full system access</li>
                <li>• Manage team members</li>
                <li>• Billing & settings</li>
                <li>• Cannot be removed</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={roleColors.ADMIN}>ADMIN</Badge>
              </div>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Manage all resources</li>
                <li>• Send emails & invoices</li>
                <li>• View analytics</li>
                <li>• Cannot manage team</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={roleColors.MANAGER}>MANAGER</Badge>
              </div>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Manage leads & prospects</li>
                <li>• Schedule consultations</li>
                <li>• Create proposals</li>
                <li>• Limited analytics</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={roleColors.TEAM_MEMBER}>TEAM MEMBER</Badge>
              </div>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• View assigned resources</li>
                <li>• Add notes & updates</li>
                <li>• Limited permissions</li>
                <li>• No admin access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card className="border-secondary/30 bg-secondary/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            📋 Team Management Setup Required
          </h3>
          <p className="text-text-secondary mb-4">
            To enable full team management functionality, you need to run the database migration.
            See <code className="px-2 py-1 bg-primary-dark rounded">TEAM_MANAGEMENT_SETUP.md</code> for instructions.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              View Setup Guide
            </Button>
            <Button variant="primary" size="sm">
              Run Migration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
