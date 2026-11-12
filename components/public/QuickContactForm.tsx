"use client";

import React, { useState } from "react";
import { Button } from "@/components/shared";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

type Status = { type: "idle" | "success" | "error"; message?: string };

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-primary/60 px-4 py-3 text-[15px] text-white placeholder:text-text-muted/50 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40";

/** Short homepage contact form. Posts to /api/contact (validated + rate-limited server-side). */
export default function QuickContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      setStatus({ type: "error", message: "Please tell us a little more (at least 10 characters)." });
      return;
    }
    setSubmitting(true);
    setStatus({ type: "idle" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          subject: "Homepage enquiry",
          message: form.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ type: "success", message: "Thanks! We've got your message and will reply shortly." });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else if (res.status === 429) {
        setStatus({ type: "error", message: "Too many messages in a short time. Please try again later." });
      } else {
        setStatus({ type: "error", message: data?.message || data?.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-text-secondary">Name</span>
          <input required maxLength={100} autoComplete="name" value={form.name} onChange={update("name")} className={fieldClass} placeholder="Jane Wanjiku" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-text-secondary">Email</span>
          <input required type="email" maxLength={255} autoComplete="email" value={form.email} onChange={update("email")} className={fieldClass} placeholder="jane@company.co.ke" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text-secondary">
          Phone <span className="text-text-muted/50">(optional)</span>
        </span>
        <input type="tel" maxLength={50} autoComplete="tel" value={form.phone} onChange={update("phone")} className={fieldClass} placeholder="0712 345 678" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text-secondary">How can we help?</span>
        <textarea required minLength={10} maxLength={5000} rows={4} value={form.message} onChange={update("message")} className={`${fieldClass} resize-none`} placeholder="Tell us about your business and what you'd like to build or improve…" />
      </label>

      {status.type !== "idle" && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
            status.type === "success" ? "bg-success/10 text-success" : "bg-red-500/10 text-red-300"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />}
          {status.message}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={submitting}>
        Send Message
        <Send size={18} aria-hidden="true" />
      </Button>
    </form>
  );
}
