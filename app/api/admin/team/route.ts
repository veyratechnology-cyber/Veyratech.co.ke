import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin, serverError } from "@/lib/security";
import { validatePasswordStrength } from "@/lib/auth/security";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Valid email required").max(255),
  password: z.string().min(12, "Password must be at least 12 characters").max(200),
});

/** POST /api/admin/team — add another admin account. */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message || "Invalid data" }, { status: 400 });
  }
  const { name, email, password } = parsed.data;
  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    return NextResponse.json({ success: false, error: strength.errors.join(". ") }, { status: 400 });
  }

  try {
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ success: false, error: "An admin with that email already exists" }, { status: 409 });

    const admin = await prisma.admin.create({
      data: { name, email, passwordHash: await hash(password, 12), status: "ACTIVE" },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    });
    prisma.auditLog
      .create({ data: { adminId: auth.id, action: "SETTINGS_CHANGED", resource: "admins", resourceId: admin.id, details: `added admin ${email}`, result: "SUCCESS" } })
      .catch(() => {});
    return NextResponse.json({ success: true, admin }, { status: 201 });
  } catch (error) {
    return serverError("TEAM_CREATE", error, "Could not create admin");
  }
}
