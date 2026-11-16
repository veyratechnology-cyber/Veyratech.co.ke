import { NextRequest, NextResponse } from "next/server";
import { loginStudent } from "@/lib/learning/auth";

/**
 * POST /api/learning/auth/student-login
 * Authenticate a student and create session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await loginStudent(email, password);

    if (result.success) {
      return NextResponse.json({
        success: true,
        profile: result.profile,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("[API] Student login error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
