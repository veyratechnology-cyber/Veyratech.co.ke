import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, serverError } from "@/lib/security";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/contact-messages/:id/convert
 * Turns a contact-form message into a Lead (or returns the existing lead with
 * the same email) and marks the message as read/responded.
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: params.id } });
    if (!message) return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });

    const email = message.email.toLowerCase();
    let lead = await prisma.lead.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });
    const created = !lead;
    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name: message.name,
          company: message.company,
          email,
          phone: message.phone,
          leadSource: "WEBSITE",
          status: "NEW",
          priority: "MEDIUM",
          assignedAdminId: auth.id,
          businessChallenge: `${message.subject}\n\n${message.message}`.slice(0, 5000),
          notes: `Created from contact message on ${message.createdAt.toISOString().slice(0, 10)}`,
        },
      });
      prisma.auditLog
        .create({ data: { adminId: auth.id, action: "LEAD_CREATED", resource: "leads", resourceId: lead.id, details: "from contact message", result: "SUCCESS" } })
        .catch(() => {});
    }

    await prisma.contactMessage.update({
      where: { id: message.id },
      data: { isRead: true, respondedAt: message.respondedAt ?? new Date() },
    });

    return NextResponse.json({ success: true, leadId: lead.id, created });
  } catch (error) {
    return serverError("CONVERT_MESSAGE", error, "Could not convert message to a lead");
  }
}
