import React from 'react';
import EmailComposer from '@/components/admin/EmailComposer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import { Mail, Send, Users } from 'lucide-react';

export const metadata = {
  title: 'Send Email | VeyraTech Admin',
};

export default function EmailsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-sora font-bold text-text-primary mb-2">
          Send Email
        </h1>
        <p className="text-text-secondary">
          Send professional emails to clients, leads, and prospects
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Mail className="text-secondary" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-muted">Email Templates</p>
                <p className="text-2xl font-bold text-text-primary">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Send className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-muted">Quick Send</p>
                <p className="text-xl font-semibold text-text-primary">Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-muted">Recipients</p>
                <p className="text-xl font-semibold text-text-primary">Unlimited</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Composer */}
      <EmailComposer />

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Email Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-text-primary mb-2 text-sm">
                ✅ Best Practices
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Personalize with recipient's name</li>
                <li>• Keep subject lines clear and concise</li>
                <li>• Include a clear call-to-action</li>
                <li>• Proofread before sending</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-2 text-sm">
                💡 Email Types
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• <strong>Custom:</strong> General business communication</li>
                <li>• <strong>Proposal:</strong> Send project proposals</li>
                <li>• <strong>Follow-up:</strong> Check in after meetings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
