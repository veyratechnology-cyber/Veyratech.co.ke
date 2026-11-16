import { NextRequest, NextResponse } from "next/server";
import { submitApplication } from "@/lib/learning/applications";

/**
 * POST /api/learning/applications
 * Submit a new student application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "country",
      "city",
      "educationLevel",
      "institution",
      "currentOccupation",
      "programmingExperience",
      "programmeId",
      "whyJoin",
      "goals",
      "weeklyAvailability",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate minimum text lengths
    if (body.whyJoin.length < 50) {
      return NextResponse.json(
        { success: false, error: "Please provide a more detailed reason for joining (minimum 50 characters)" },
        { status: 400 }
      );
    }

    if (body.goals.length < 50) {
      return NextResponse.json(
        { success: false, error: "Please provide more detailed goals (minimum 50 characters)" },
        { status: 400 }
      );
    }

    // Validate hasLaptop is boolean
    if (typeof body.hasLaptop !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid laptop availability value" },
        { status: 400 }
      );
    }

    // Submit application
    const result = await submitApplication(body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        referenceNumber: result.referenceNumber,
        applicationId: result.applicationId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[API] Application submission error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while processing your application" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/learning/applications
 * Get all applications (admin only - to be protected in Stage 3)
 */
export async function GET(request: NextRequest) {
  // TODO: Add admin authentication in Stage 3
  return NextResponse.json(
    { success: false, error: "Endpoint not yet implemented" },
    { status: 501 }
  );
}
