/**
 * @jest-environment node
 */
import { NextResponse } from "next/server";

jest.mock("@/lib/prisma", () => {
  const model = () => ({ findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() });
  const stub = model();
  return {
    prisma: {
      lead: model(), service: model(), insight: model(),
      prospect: stub, industryPage: stub, project: stub, proposal: stub, contactMessage: stub, newsletterSubscription: stub,
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    },
  };
});

const mockRequireAdmin = jest.fn();
jest.mock("@/lib/security", () => ({ requireAdmin: () => mockRequireAdmin() }));

import { recordHandlers } from "../crud";
import { prisma } from "@/lib/prisma";

const { lead, service, insight } = prisma as any;
const requireAdmin = mockRequireAdmin;

const req = (body: unknown) => ({ json: async () => body }) as any;
const ctx = { params: { id: "abc" } };

beforeEach(() => {
  jest.clearAllMocks();
  requireAdmin.mockResolvedValue({ id: "admin1", email: "a@b.co" });
});

describe("admin record handlers", () => {
  it("rejects requests without an admin session", async () => {
    requireAdmin.mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const res = await recordHandlers("leads").PATCH(req({ name: "X" }), ctx);
    expect(res.status).toBe(401);
    expect(lead.update).not.toHaveBeenCalled();
  });

  it("saves valid lead changes and converts empty optionals to null", async () => {
    lead.update.mockImplementation(async ({ data }: any) => ({ id: "abc", ...data }));
    const res = await recordHandlers("leads").PATCH(
      req({ name: " Jane ", email: "jane@example.com", status: "QUALIFIED", priority: "HIGH", leadSource: "WEBSITE", company: "", nextFollowUpAt: "2030-01-15" }),
      ctx
    );
    expect(res.status).toBe(200);
    const data = lead.update.mock.calls[0][0].data;
    expect(data.name).toBe("Jane");
    expect(data.company).toBeNull();
    expect(data.status).toBe("QUALIFIED");
    expect(data.nextFollowUpAt).toBeInstanceOf(Date);
  });

  it("rejects invalid enum values, bad emails and unknown fields", async () => {
    const h = recordHandlers("leads");
    expect((await h.PATCH(req({ status: "HACKED" }), ctx)).status).toBe(400);
    expect((await h.PATCH(req({ email: "not-an-email" }), ctx)).status).toBe(400);
    expect((await h.PATCH(req({ passwordHash: "x", assignedAdminId: "y" }), ctx)).status).toBe(400);
    expect(lead.update).not.toHaveBeenCalled();
  });

  it("stores one-per-line service lists as JSON arrays and validates slugs", async () => {
    service.update.mockImplementation(async ({ data }: any) => ({ id: "abc", ...data }));
    const h = recordHandlers("services");
    const res = await h.PATCH(req({ deliverables: "- Roadmap\nTraining\n\n", slug: "cloud-solutions" }), ctx);
    expect(res.status).toBe(200);
    expect(service.update.mock.calls[0][0].data.deliverables).toBe('["Roadmap","Training"]');
    const body = await res.json();
    expect(body.record.deliverables).toBe("Roadmap\nTraining");
    expect((await h.PATCH(req({ slug: "Bad Slug!" }), ctx)).status).toBe(400);
  });

  it("sanitises insight HTML and sets publishedAt when first published", async () => {
    insight.findUnique.mockResolvedValue({ publishedAt: null });
    insight.update.mockImplementation(async ({ data }: any) => ({ id: "abc", ...data }));
    const res = await recordHandlers("insights").PATCH(
      req({ status: "PUBLISHED", content: '<p onclick="x()">Hi</p><script>alert(1)</script>', tags: "ai, kenya ,," }),
      ctx
    );
    expect(res.status).toBe(200);
    const data = insight.update.mock.calls[0][0].data;
    expect(data.content).toBe("<p>Hi</p>");
    expect(data.publishedAt).toBeInstanceOf(Date);
    expect(data.tags).toEqual(["ai", "kenya"]);
  });

  it("returns 404 for missing records and a clear 409 when delete is blocked by links", async () => {
    lead.findUnique.mockResolvedValue(null);
    expect((await recordHandlers("leads").GET(req(null), ctx)).status).toBe(404);
    lead.delete.mockRejectedValue({ code: "P2003" });
    const res = await recordHandlers("leads").DELETE(req(null), ctx);
    expect(res.status).toBe(409);
    expect((await res.json()).error).toMatch(/linked to other records/);
  });
});
