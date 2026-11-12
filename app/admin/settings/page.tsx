import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { COMPANY } from "@/lib/constants";
import { getNotificationServicesStatus } from "@/lib/notifications/index";
import { isGoogleCalendarConfigured } from "@/lib/google-calendar";
import { validateMpesaConfig } from "@/lib/mpesa";
import { CheckCircle2, XCircle } from "lucide-react";
import SettingsForms from "./SettingsForms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings | VeyraTech Admin" };

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-primary-dark p-6">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StatusRow({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <li className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-muted">{detail}</p>
      </div>
      <span className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-medium ${ok ? "text-success" : "text-text-muted"}`}>
        {ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
        {ok ? "Configured" : "Not configured"}
      </span>
    </li>
  );
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const admin = session?.user?.id
    ? await prisma.admin.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, lastLoginAt: true } })
    : null;

  const notify = getNotificationServicesStatus();
  const integrations = [
    { label: "Email (Resend)", ok: notify.email, detail: "Booking confirmations, contact notifications, proposals and invoices. Env: RESEND_API_KEY" },
    { label: "SMS (Twilio)", ok: notify.sms, detail: "SMS confirmations and reminders. Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER" },
    { label: "WhatsApp (Twilio)", ok: notify.whatsapp, detail: "WhatsApp alerts to the admin number. Env: TWILIO_WHATSAPP_NUMBER, ADMIN_WHATSAPP_NUMBER" },
    { label: "M-Pesa (Daraja)", ok: validateMpesaConfig(), detail: "STK push payments for bookings. Env: MPESA_* (set MPESA_CALLBACK_SECRET too)" },
    { label: "Google Calendar", ok: isGoogleCalendarConfigured(), detail: "Creates Google Meet links for booked consultations." },
    { label: "Reminder cron", ok: !!process.env.CRON_SECRET, detail: "Daily meeting reminders via Vercel Cron. Env: CRON_SECRET" },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-sora font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Your account and the status of connected services.</p>
      </div>

      <SettingsForms name={admin?.name ?? ""} email={admin?.email ?? ""} />

      <Section title="Integrations & notifications" description="Live status, read from the server's environment variables. Change these in Vercel → Project → Settings → Environment Variables, then redeploy.">
        <ul>
          {integrations.map((i) => (
            <StatusRow key={i.label} {...i} />
          ))}
        </ul>
      </Section>

      <Section title="Company information" description="Shown across the public website and emails. Edit it in lib/constants.ts (COMPANY).">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          {[
            ["Company name", COMPANY.name],
            ["Tagline", COMPANY.tagline],
            ["Email", COMPANY.email],
            ["Phone", COMPANY.phone],
            ["Website", COMPANY.website],
            ["Admin notifications go to", process.env.ADMIN_EMAIL || COMPANY.email],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-text-muted">{k}</dt>
              <dd className="mt-0.5 font-medium text-text-primary">{v || "—"}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}
