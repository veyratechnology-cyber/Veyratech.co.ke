import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin, rateLimit, serverError } from "@/lib/security";
import { validatePasswordStrength } from "@/lib/auth/security";

export const dynamic = "force-dynamic";

const profileSchema = z.object({ name: z.string().trim().min(2, "Name is required").max(100) });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password").max(200),
  newPassword: z.string().min(12, "New password must be at least 12 characters").max(200),
});

/** PATCH /api/admin/account — update your display name. */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const parsed = profileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
  try {
    const admin = await prisma.admin.update({ where: { id: auth.id }, data: { name: parsed.data.name }, select: { name: true } });
    return NextResponse.json({ success: true, admin });
  } catch (error) {
    return serverError("ACCOUNT_PROFILE", error, "Could not update profile");
  }
}

/** POST /api/admin/account — change your password (requires the current one). */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const limit = rateLimit(`pwchange:${auth.id}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ success: false, error: "Too many attempts. Try again later." }, { status: 429 });

  const parsed = passwordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
  const { currentPassword, newPassword } = parsed.data;

  const strength = validatePasswordStrength(newPassword);
  if (!strength.valid) return NextResponse.json({ success: false, error: strength.errors.join(". ") }, { status: 400 });

  try {
    const admin = await prisma.admin.findUnique({ where: { id: auth.id }, select: { passwordHash: true } });
    if (!admin || !(await compare(currentPassword, admin.passwordHash))) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
    }
    if (await compare(newPassword, admin.passwordHash)) {
      return NextResponse.json({ success: false, error: "New password must be different from the current one" }, { status: 400 });
    }
    await prisma.admin.update({ where: { id: auth.id }, data: { passwordHash: await hash(newPassword, 12) } });
    prisma.auditLog
      .create({ data: { adminId: auth.id, action: "SETTINGS_CHANGED", resource: "admins", resourceId: auth.id, details: "password changed", result: "SUCCESS" } })
      .catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError("ACCOUNT_PASSWORD", error, "Could not change password");
  }
}
