import { NextRequest, NextResponse } from "next/server";
import { updateApplicationStatus } from "@/lib/learning/applications";
import { ApplicationStatus } from "@prisma/client";

/**
 * PATCH /api/admin/learning/applications/[id]/status
 * Update application status (reject, waitlist, add notes)
 * Admin only
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add admin authentication check
    const body = await request.json();
    const { status, adminId, notes, rejectionReason } = body;

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: "Admin ID required" },
        { status: 400 }
      );
    }

    if (status && !["UNDER_REVIEW", "REJECTED", "WAITLISTED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const result = await updateApplicationStatus(
      params.id,
      status as ApplicationStatus,
      adminId,
      notes,
      rejectionReason
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Application updated successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[API] Update application status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}
