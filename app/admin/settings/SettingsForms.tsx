"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared";

const input =
  "w-full rounded-lg border border-white/10 bg-primary px-3.5 py-2.5 text-white placeholder:text-text-muted/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60";

type Msg = { type: "ok" | "err"; text: string } | null;

function Note({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p role={msg.type === "err" ? "alert" : "status"} className={`rounded-lg px-4 py-2.5 text-sm ${msg.type === "ok" ? "bg-success/10 text-success" : "bg-red-500/10 text-red-300"}`}>
      {msg.text}
    </p>
  );
}

export default function SettingsForms({ name: initialName, email }: { name: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [profileMsg, setProfileMsg] = useState<Msg>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState<Msg>(null);
  const [savingPw, setSavingPw] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save");
      setProfileMsg({ type: "ok", text: "Profile updated. The new name shows after your next sign-in." });
      router.refresh();
    } catch (err: any) {
      setProfileMsg({ type: "err", text: err.message });
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pw.newPassword !== pw.confirm) {
      setPwMsg({ type: "err", text: "New passwords don't match" });
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not change password");
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      setPwMsg({ type: "ok", text: "Password changed." });
    } catch (err: any) {
      setPwMsg({ type: "err", text: err.message });
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={saveProfile} className="space-y-4 rounded-2xl border border-white/10 bg-primary-dark p-6">
        <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm text-text-secondary">Name</span>
          <input required minLength={2} maxLength={100} className={input} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-text-secondary">Email (sign-in)</span>
          <input disabled className={input} value={email} />
          <span className="mt-1 block text-xs text-text-muted/70">Your sign-in email can&apos;t be changed here.</span>
        </label>
        <Note msg={profileMsg} />
        <Button type="submit" variant="primary" size="sm" isLoading={savingProfile} disabled={name.trim() === initialName}>
          Save profile
        </Button>
      </form>

      <form onSubmit={changePassword} className="space-y-4 rounded-2xl border border-white/10 bg-primary-dark p-6">
        <h2 className="text-lg font-semibold text-text-primary">Change password</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm text-text-secondary">Current password</span>
          <input required type="password" autoComplete="current-password" className={input} value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-text-secondary">New password</span>
          <input required type="password" autoComplete="new-password" minLength={12} className={input} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <span className="mt-1 block text-xs text-text-muted/70">12+ characters with upper and lower case, a number and a symbol.</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-text-secondary">Confirm new password</span>
          <input required type="password" autoComplete="new-password" className={input} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
        </label>
        <Note msg={pwMsg} />
        <Button type="submit" variant="primary" size="sm" isLoading={savingPw}>
          Change password
        </Button>
      </form>
    </div>
  );
}
