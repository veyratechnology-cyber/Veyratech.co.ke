import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, serverError } from "@/lib/security";

export const dynamic = "force-dynamic";

/** GET /api/admin/newsletters — all newsletter subscribers for the admin list. */
export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const rows = await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        status: true,
        paymentStatus: true,
        amount: true,
        subscribedAt: true,
        paidAt: true,
        createdAt: true,
      },
    });
    const subscribers = rows.map((r) => ({
      ...r,
      subscriptionDate: r.subscribedAt ?? r.createdAt,
      lastEmailSent: null,
    }));
    return NextResponse.json({ success: true, subscribers });
  } catch (error) {
    return serverError("ADMIN_NEWSLETTERS", error, "Could not load subscribers");
  }
}
