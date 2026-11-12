"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/shared";
import { RESOURCES, ResourceKey, FieldDef, humanize } from "@/lib/admin/resources";

type Values = Record<string, any>;

const inputClass =
  "w-full rounded-lg border border-white/10 bg-primary px-3.5 py-2.5 text-[15px] text-white placeholder:text-text-muted/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

function toInputValue(field: FieldDef, value: any) {
  if (value === null || value === undefined) return field.type === "boolean" ? false : "";
  if (field.type === "date") return String(value).slice(0, 10);
  return value;
}

/**
 * Generic edit screen for an admin record.
 * Loads GET /api/admin/<resource>/<id>, saves with PATCH, deletes with DELETE.
 */
export default function RecordEditor({
  resource,
  id,
  aside,
}: {
  resource: ResourceKey;
  id: string;
  /** optional extra panel (e.g. quick actions) rendered beside the form */
  aside?: React.ReactNode;
}) {
  const def = RESOURCES[resource];
  const router = useRouter();
  const api = `/api/admin/${resource}/${id}`;
  const listHref = `/admin/${resource}`;

  const [values, setValues] = useState<Values | null>(null);
  const [initial, setInitial] = useState<Values | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch(api)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || `Could not load ${def.singular.toLowerCase()}`);
        return data.record;
      })
      .then((record) => {
        if (cancelled) return;
        const v: Values = {};
        for (const f of def.fields) v[f.name] = toInputValue(f, record[f.name]);
        setValues({ ...record, ...v });
        setInitial({ ...record, ...v });
      })
      .catch((e) => !cancelled && setLoadError(e.message));
    return () => {
      cancelled = true;
    };
  }, [api, def]);

  const dirty = useMemo(
    () => !!values && !!initial && def.fields.some((f) => values[f.name] !== initial[f.name]),
    [values, initial, def.fields]
  );

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const set = (name: string, v: any) => {
    setValues((prev) => ({ ...(prev as Values), [name]: v }));
    setFieldErrors((e) => ({ ...e, [name]: "" }));
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setStatus(null);
    setFieldErrors({});
    const payload: Values = {};
    for (const f of def.fields) payload[f.name] = values[f.name] === "" && !f.required ? null : values[f.name];
    try {
      const res = await fetch(api, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errs: Record<string, string> = {};
        for (const i of data.issues ?? []) errs[i.field] = i.message;
        setFieldErrors(errs);
        throw new Error(data.error || "Could not save changes");
      }
      const v: Values = {};
      for (const f of def.fields) v[f.name] = toInputValue(f, data.record[f.name]);
      setValues({ ...data.record, ...v });
      setInitial({ ...data.record, ...v });
      setStatus({ type: "success", text: "Changes saved" });
      router.refresh();
    } catch (err: any) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    const name = values?.[def.titleField] || def.singular.toLowerCase();
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(true);
    setStatus(null);
    try {
      const res = await fetch(api, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete");
      router.push(listHref);
      router.refresh();
    } catch (err: any) {
      setStatus({ type: "error", text: err.message });
      setDeleting(false);
    }
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <Link href={listHref} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-secondary">
          <ArrowLeft size={16} /> Back to {def.plural.toLowerCase()}
        </Link>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">{loadError}</div>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="flex items-center gap-3 p-10 text-text-muted">
        <Loader2 className="animate-spin" size={20} /> Loading…
      </div>
    );
  }

  const publicUrl = def.publicPath?.(values) ?? null;

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href={listHref} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-secondary">
            <ArrowLeft size={16} /> {def.plural}
          </Link>
          <h1 className="mt-2 text-3xl font-sora font-bold text-text-primary">
            {values[def.titleField] || `Edit ${def.singular}`}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {def.singular}
            {values.createdAt ? ` · created ${new Date(values.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : ""}
            {dirty && <span className="ml-2 text-secondary">· unsaved changes</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {publicUrl && (
            <Button href={publicUrl} target="_blank" variant="outline" size="sm">
              <ExternalLink size={16} /> View on site
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={remove} disabled={deleting} className="text-red-300 hover:bg-red-500/10 hover:text-red-200">
            <Trash2 size={16} /> {deleting ? "Deleting…" : "Delete"}
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={saving} disabled={!dirty}>
            <Save size={16} /> Save changes
          </Button>
        </div>
      </div>

      {status && (
        <div
          role={status.type === "error" ? "alert" : "status"}
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            status.type === "success" ? "bg-success/10 text-success" : "bg-red-500/10 text-red-300"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.text}
        </div>
      )}

      <div className={aside ? "grid gap-6 xl:grid-cols-[1fr_320px]" : ""}>
        <div className="grid gap-5 rounded-2xl border border-white/10 bg-primary-dark p-6 md:grid-cols-2">
          {def.fields.map((f) => (
            <Field key={f.name} field={f} value={values[f.name]} error={fieldErrors[f.name]} onChange={(v) => set(f.name, v)} />
          ))}
        </div>
        {aside && <aside className="space-y-4">{aside}</aside>}
      </div>
    </form>
  );
}

function Field({ field: f, value, error, onChange }: { field: FieldDef; value: any; error?: string; onChange: (v: any) => void }) {
  const id = `field-${f.name}`;
  const span = f.half ? "" : "md:col-span-2";
  const label = (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-secondary">
      {f.label} {f.required && <span className="text-secondary">*</span>}
    </label>
  );
  const hint = (
    <>
      {error ? (
        <p className="mt-1 text-xs text-red-300">{error}</p>
      ) : f.help ? (
        <p className="mt-1 text-xs text-text-muted/70">{f.help}</p>
      ) : null}
      {f.max && typeof value === "string" && (f.type === "textarea" || f.name.startsWith("seo")) ? (
        <p className={`mt-1 text-right text-xs ${value.length > f.max ? "text-red-300" : "text-text-muted/50"}`}>
          {value.length}/{f.max}
        </p>
      ) : null}
    </>
  );

  if (f.type === "boolean") {
    return (
      <div className={span}>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-primary px-4 py-3">
          <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[#FC8436]" />
          <span className="text-sm text-text-primary">{f.label}</span>
        </label>
      </div>
    );
  }

  if (f.type === "select") {
    return (
      <div className={span}>
        {label}
        <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputClass} required={f.required}>
          {!f.required && <option value="">—</option>}
          {f.options!.map((o) => (
            <option key={o} value={o}>
              {humanize(o)}
            </option>
          ))}
        </select>
        {hint}
      </div>
    );
  }

  if (f.type === "textarea" || f.type === "richtext") {
    return (
      <div className={span}>
        {label}
        <textarea
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={f.type === "richtext" ? 16 : f.jsonList ? 6 : 4}
          className={`${inputClass} ${f.type === "richtext" ? "font-mono text-sm" : ""}`}
          required={f.required}
        />
        {hint}
      </div>
    );
  }

  const type = f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "email" ? "email" : f.type === "url" ? "url" : "text";
  return (
    <div className={span}>
      {label}
      <input
        id={id}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
        className={inputClass}
        required={f.required}
        maxLength={f.max}
      />
      {hint}
    </div>
  );
}
