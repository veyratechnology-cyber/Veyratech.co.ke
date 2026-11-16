import { NextRequest, NextResponse } from "next/server";
import { admitApplicant } from "@/lib/learning/applications";

/**
 * POST /api/admin/learning/applications/[id]/admit
 * Admit an applicant and send activation email
 * Admin only
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add admin authentication check
    const body = await request.json();
    const { adminId } = body;

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: "Admin ID required" },
        { status: 400 }
      );
    }

    const result = await admitApplicant(params.id, adminId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Applicant admitted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[API] Admit applicant error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to admit applicant" },
      { status: 500 }
    );
  }
}
