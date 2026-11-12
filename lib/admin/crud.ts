/**
 * Generic admin record API (server only).
 *
 * Each app/api/admin/<resource>/[id]/route.ts re-exports handlers built here:
 *   GET    -> load one record (JSON-list fields converted to "one per line")
 *   PATCH  -> validate against RESOURCES[resource].fields and update
 *   DELETE -> delete (409 with a clear message if other records depend on it)
 *
 * Only fields declared in lib/admin/resources.ts can ever be written.
 */

import { NextRequest, NextResponse } from "next/server";
import { z, ZodTypeAny } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import { RESOURCES, ResourceKey, FieldDef } from "./resources";
import { sanitizeRichHtml } from "./sanitize";

// Prisma delegate for each resource
const MODELS: Record<ResourceKey, any> = {
  leads: prisma.lead,
  prospects: prisma.prospect,
  services: prisma.service,
  industries: prisma.industryPage,
  insights: prisma.insight,
  projects: prisma.project,
  proposals: prisma.proposal,
  "contact-messages": prisma.contactMessage,
  newsletters: prisma.newsletterSubscription,
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fieldSchema(f: FieldDef): ZodTypeAny {
  const optionalText = (s: z.ZodString) =>
    f.required ? s.min(1, `${f.label} is required`) : s.optional().nullable().transform((v) => (v ? v : null));

  switch (f.type) {
    case "text":
    case "textarea":
    case "richtext": {
      let s = z.string().trim();
      if (f.max) s = s.max(f.max, `${f.label} is too long`);
      if (f.name === "slug") s = s.regex(SLUG, "Slug may only contain lowercase letters, numbers and dashes");
      return optionalText(s);
    }
    case "email":
      return optionalText(z.string().trim().email(`${f.label} must be a valid email`).max(f.max ?? 255));
    case "url":
      return f.required
        ? z.string().trim().url(`${f.label} must be a valid URL`)
        : z
            .union([z.string().trim().url(`${f.label} must be a valid URL`), z.literal(""), z.null()])
            .optional()
            .transform((v) => (v ? v : null));
    case "select": {
      const e = z.enum(f.options as [string, ...string[]]);
      return f.required ? e : z.union([e, z.literal(""), z.null()]).optional().transform((v) => (v ? v : null));
    }
    case "number":
      return z.coerce.number().int().min(0).max(f.name === "progress" ? 100 : 1_000_000);
    case "boolean":
      return z.boolean();
    case "date":
      return z
        .union([z.string(), z.null()])
        .optional()
        .transform((v, ctx) => {
          if (!v) return null;
          const d = new Date(v);
          if (Number.isNaN(d.getTime())) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${f.label} is not a valid date` });
            return z.NEVER;
          }
          return d;
        });
    case "tags":
      return z
        .union([z.string(), z.array(z.string())])
        .optional()
        .transform((v) =>
          (Array.isArray(v) ? v : (v ?? "").split(","))
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 30)
        );
  }
}

function buildSchema(resource: ResourceKey) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const f of RESOURCES[resource].fields) shape[f.name] = fieldSchema(f).optional();
  return z.object(shape).strict();
}

function toForm(resource: ResourceKey, record: Record<string, any>) {
  const out: Record<string, any> = { ...record };
  for (const f of RESOURCES[resource].fields) {
    const v = record[f.name];
    if (f.jsonList && typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) out[f.name] = parsed.map(String).join("\n");
      } catch {
        /* leave as-is */
      }
    }
    if (f.type === "tags" && Array.isArray(v)) out[f.name] = v.join(", ");
    if (f.type === "number" && v !== null && typeof v === "object") out[f.name] = Number(v);
  }
  return out;
}

function fromForm(resource: ResourceKey, data: Record<string, any>) {
  for (const f of RESOURCES[resource].fields) {
    if (!(f.name in data)) continue;
    if (f.jsonList) {
      const v = data[f.name];
      data[f.name] = v
        ? JSON.stringify(
            String(v)
              .split("\n")
              .map((l: string) => l.replace(/^[-•*]\s*/, "").trim())
              .filter(Boolean)
          )
        : null;
    }
    if (f.type === "richtext" && typeof data[f.name] === "string") {
      data[f.name] = sanitizeRichHtml(data[f.name]);
    }
  }
  return data;
}

type Ctx = { params: { id: string } };

export function recordHandlers(resource: ResourceKey) {
  const model = MODELS[resource];
  const schema = buildSchema(resource);
  const def = RESOURCES[resource];

  async function GET(_req: NextRequest, { params }: Ctx) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const record = await model.findUnique({ where: { id: params.id } });
    if (!record) return NextResponse.json({ success: false, error: `${def.singular} not found` }, { status: 404 });

    // Opening a contact message marks it as read
    if (resource === "contact-messages" && !record.isRead) {
      await model.update({ where: { id: params.id }, data: { isRead: true } });
      record.isRead = true;
    }
    return NextResponse.json({ success: true, record: toForm(resource, record) });
  }

  async function PATCH(req: NextRequest, { params }: Ctx) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body ?? {});
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return NextResponse.json(
        { success: false, error: first?.message || "Invalid data", issues: parsed.error.errors.map((e) => ({ field: e.path.join("."), message: e.message })) },
        { status: 400 }
      );
    }

    const data = fromForm(resource, { ...parsed.data });

    // Side effects that keep related fields consistent
    if (resource === "insights" && data.status === "PUBLISHED") {
      const current = await model.findUnique({ where: { id: params.id }, select: { publishedAt: true } });
      if (current && !current.publishedAt) data.publishedAt = new Date();
    }
    if (resource === "proposals" && data.status) {
      const now = new Date();
      if (data.status === "SENT") data.sentAt = now;
      if (data.status === "ACCEPTED") data.acceptedAt = now;
      if (data.status === "REJECTED") data.rejectedAt = now;
    }
    if (resource === "contact-messages" && data.isRead === false) data.respondedAt = undefined;

    try {
      const record = await model.update({ where: { id: params.id }, data });
      logAudit(auth.id, resource, params.id, "updated");
      return NextResponse.json({ success: true, record: toForm(resource, record) });
    } catch (error: any) {
      if (error?.code === "P2025") return NextResponse.json({ success: false, error: `${def.singular} not found` }, { status: 404 });
      if (error?.code === "P2002") return NextResponse.json({ success: false, error: "That value is already used by another record (e.g. slug or email)." }, { status: 409 });
      console.error(`[ADMIN ${resource} PATCH]`, error?.message);
      return NextResponse.json({ success: false, error: "Could not save changes" }, { status: 500 });
    }
  }

  async function DELETE(_req: NextRequest, { params }: Ctx) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;
    try {
      await model.delete({ where: { id: params.id } });
      logAudit(auth.id, resource, params.id, "deleted");
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error?.code === "P2025") return NextResponse.json({ success: false, error: `${def.singular} not found` }, { status: 404 });
      if (error?.code === "P2003" || error?.code === "P2014") {
        return NextResponse.json(
          { success: false, error: `This ${def.singular.toLowerCase()} is linked to other records (e.g. consultations, proposals or projects). Remove those links first, or change its status instead.` },
          { status: 409 }
        );
      }
      console.error(`[ADMIN ${resource} DELETE]`, error?.message);
      return NextResponse.json({ success: false, error: "Could not delete" }, { status: 500 });
    }
  }

  return { GET, PATCH, DELETE };
}

const AUDIT_ACTION: Partial<Record<ResourceKey, string>> = {
  leads: "LEAD_UPDATED",
  prospects: "PROSPECT_UPDATED",
  projects: "PROJECT_UPDATED",
  services: "SERVICE_UPDATED",
  industries: "SERVICE_UPDATED",
  insights: "INSIGHT_PUBLISHED",
};

function logAudit(adminId: string, resource: ResourceKey, id: string, verb: string) {
  const action = AUDIT_ACTION[resource] ?? "SETTINGS_CHANGED";
  prisma.auditLog
    .create({ data: { adminId, action: action as any, resource, resourceId: id, details: verb, result: "SUCCESS" } })
    .catch(() => {});
}
