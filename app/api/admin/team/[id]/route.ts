import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, serverError } from "@/lib/security";

export const dynamic = "force-dynamic";

const schema = z.object({ status: z.enum(["ACTIVE", "INACTIVE"]) });

/** PATCH /api/admin/team/:id — activate / deactivate an admin (not yourself). */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });

  if (params.id === auth.id && parsed.data.status === "INACTIVE") {
    return NextResponse.json({ success: false, error: "You can't deactivate your own account" }, { status: 400 });
  }

  try {
    if (parsed.data.status === "INACTIVE") {
      const active = await prisma.admin.count({ where: { status: "ACTIVE" } });
      if (active <= 1) return NextResponse.json({ success: false, error: "At least one active admin is required" }, { status: 400 });
    }
    const admin = await prisma.admin.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });
    prisma.auditLog
      .create({ data: { adminId: auth.id, action: "SETTINGS_CHANGED", resource: "admins", resourceId: admin.id, details: `status -> ${admin.status}`, result: "SUCCESS" } })
      .catch(() => {});
    return NextResponse.json({ success: true, admin });
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
    return serverError("TEAM_UPDATE", error, "Could not update admin");
  }
}
