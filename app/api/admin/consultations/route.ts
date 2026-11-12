import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/consultations[?scheduled=true]
 * Used by the admin calendar. With scheduled=true only consultations that have
 * a meeting time are returned.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const scheduledOnly = request.nextUrl.searchParams.get("scheduled") === "true";
    const consultations = await prisma.consultation.findMany({
      where: scheduledOnly ? { actualScheduledAt: { not: null }, status: { not: "CANCELLED" } } : undefined,
      orderBy: scheduledOnly ? { actualScheduledAt: "asc" } : { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        actualScheduledAt: true,
        googleMeetLink: true,
        meetingType: true,
      },
    });
    return NextResponse.json({ success: true, consultations });
  } catch (error: any) {
    console.error("[ADMIN CONSULTATIONS GET]", error?.message);
    return NextResponse.json({ error: "Could not load consultations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      prospectName,
      prospectEmail,
      scheduledAt,
      notes,
      status,
    } = body;

    const consultation = await prisma.consultation.create({
      data: {
        name: prospectName,
        email: prospectEmail,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes: notes || null,
        status: status || "NEW",
        assignedAdminId: session.user.id,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: "CONSULTATION_CREATED",
        resource: "Consultation",
        resourceId: consultation.id,
        result: "SUCCESS",
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 500 }
    );
  }
}
