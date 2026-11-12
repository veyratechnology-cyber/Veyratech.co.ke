"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, UserPlus, Trash2, Reply } from "lucide-react";

/** Action buttons for a single contact message in the admin list. */
export default function MessageActions({
  id,
  email,
  subject,
  isRead,
}: {
  id: string;
  email: string;
  subject: string;
  isRead: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(action: string, url: string, init: RequestInit) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(url, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Action failed");
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setBusy(null);
    }
  }

  const toggleRead = async () => {
    const ok = await call("read", `/api/admin/contact-messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    });
    if (ok) router.refresh();
  };

  const convert = async () => {
    const data = await call("convert", `/api/admin/contact-messages/${id}/convert`, { method: "POST" });
    if (data?.leadId) router.push(`/admin/leads/${data.leadId}`);
  };

  const remove = async () => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    const ok = await call("delete", `/api/admin/contact-messages/${id}`, { method: "DELETE" });
    if (ok) router.refresh();
  };

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-secondary/50 hover:text-white disabled:opacity-50";

  return (
    <div className="mt-5 border-t border-white/5 pt-4">
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`} className={btn}>
          <Reply size={15} /> Reply
        </a>
        <button type="button" onClick={convert} disabled={!!busy} className={btn}>
          <UserPlus size={15} /> {busy === "convert" ? "Converting…" : "Convert to lead"}
        </button>
        <button type="button" onClick={toggleRead} disabled={!!busy} className={btn}>
          {isRead ? <Mail size={15} /> : <MailOpen size={15} />} {isRead ? "Mark unread" : "Mark read"}
        </button>
        <button type="button" onClick={remove} disabled={!!busy} className={`${btn} hover:border-red-400/50 hover:text-red-300`}>
          <Trash2 size={15} /> Delete
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
