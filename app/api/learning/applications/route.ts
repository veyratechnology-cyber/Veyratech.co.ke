import { NextRequest, NextResponse } from "next/server";
import { submitApplication } from "@/lib/learning/applications";

/**
 * POST /api/learning/applications
 * Submit a new student application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("[API] Received application data:", {
      hasName: !!body.name,
      hasEmail: !!body.email,
      hasPhone: !!body.phone,
      hasDateOfBirth: !!body.dateOfBirth,
      hasCountry: !!body.country,
      hasEducationLevel: !!body.educationLevel,
      hasInstitution: !!body.institution,
      hasProgramme: !!body.programme,
      hasMotivation: !!body.motivation,
      hasLearningGoals: !!body.learningGoals,
      hasReferralSource: !!body.referralSource,
      motivationLength: body.motivation?.length || 0,
      learningGoalsLength: body.learningGoals?.length || 0,
    });

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "dateOfBirth",
      "country",
      "educationLevel",
      "institution",
      "programme",
      "motivation",
      "learningGoals",
      "referralSource",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`[API] Missing field: ${field}`);
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
    if (body.motivation.length < 100) {
      return NextResponse.json(
        { success: false, error: "Please provide a more detailed reason for joining (minimum 100 characters)" },
        { status: 400 }
      );
    }

    if (body.learningGoals.length < 50) {
      return NextResponse.json(
        { success: false, error: "Please provide more detailed goals (minimum 50 characters)" },
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
    
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] Error details:", errorMessage);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred while processing your application",
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
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
