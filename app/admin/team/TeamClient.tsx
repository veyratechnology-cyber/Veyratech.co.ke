"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/shared";

interface AdminRow {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  lastLoginAt: string | null;
  createdAt: string;
  _count: { leads: number; consultations: number; proposals: number; projects: number };
}

const input =
  "w-full rounded-lg border border-white/10 bg-primary px-3.5 py-2.5 text-white placeholder:text-text-muted/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

function fmt(d: string | null) {
  return d
    ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "Never";
}

export default function TeamClient({ admins, currentAdminId }: { admins: AdminRow[]; currentAdminId: string }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add admin");
      setMessage({ type: "ok", text: `${data.admin.email} can now sign in. Share the password with them securely.` });
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "err", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const admin = admins.find((a) => a.id === id);
    if (status === "INACTIVE" && !window.confirm(`Deactivate ${admin?.email}? They will be signed out immediately.`)) return;
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update admin");
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "err", text: err.message });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Members</h2>
        <Button type="button" variant={showForm ? "outline" : "primary"} size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X size={16} /> : <UserPlus size={16} />} {showForm ? "Cancel" : "Add admin"}
        </Button>
      </div>

      {message && (
        <p className={`rounded-lg px-4 py-3 text-sm ${message.type === "ok" ? "bg-success/10 text-success" : "bg-red-500/10 text-red-300"}`}>
          {message.text}
        </p>
      )}

      {showForm && (
        <form onSubmit={addAdmin} className="grid gap-4 rounded-2xl border border-white/10 bg-primary-dark p-6 md:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm text-text-secondary">Name</span>
            <input required className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-text-secondary">Email</span>
            <input required type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-text-secondary">Temporary password</span>
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={12}
              className={input}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span className="mt-1 block text-xs text-text-muted/70">12+ characters with upper and lower case, a number and a symbol.</span>
          </label>
          <div className="md:col-span-3">
            <Button type="submit" variant="primary" isLoading={saving}>
              Create admin
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-primary-dark">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-left text-text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Admin</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last sign-in</th>
              <th className="px-5 py-3 font-medium">Assigned</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium text-text-primary">
                    {a.name} {a.id === currentAdminId && <span className="ml-1 text-xs text-secondary">(you)</span>}
                  </p>
                  <p className="text-text-muted">{a.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      a.status === "ACTIVE" ? "bg-success/15 text-success" : "bg-white/10 text-text-muted"
                    }`}
                  >
                    {a.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-text-secondary">{fmt(a.lastLoginAt)}</td>
                <td className="px-5 py-4 text-text-secondary">
                  {a._count.leads} leads · {a._count.consultations} consultations · {a._count.projects} projects
                </td>
                <td className="px-5 py-4 text-right">
                  {a.id !== currentAdminId && (
                    <button
                      type="button"
                      disabled={busyId === a.id}
                      onClick={() => setStatus(a.id, a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-text-secondary hover:border-secondary/50 hover:text-white disabled:opacity-50"
                    >
                      {a.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
