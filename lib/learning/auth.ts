/**
 * Learning Module Authentication Utilities
 * Handles authentication for students and mentors
 */

import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/db/prisma";
import { UserType, ProfileStatus } from "@prisma/client";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "";
const STUDENT_TOKEN_NAME = "veyra-student-token";
const MENTOR_TOKEN_NAME = "veyra-mentor-token";
const TOKEN_MAX_AGE = 8 * 60 * 60; // 8 hours (same as admin)

interface TokenPayload {
  id: string;
  email: string;
  name: string;
  userType: UserType;
}

/**
 * Hash password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_MAX_AGE,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Set student session cookie
 */
export async function setStudentSession(profileId: string, email: string, name: string) {
  const token = generateToken({
    id: profileId,
    email,
    name,
    userType: "STUDENT",
  });

  cookies().set(STUDENT_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });
}

/**
 * Set mentor session cookie
 */
export async function setMentorSession(profileId: string, email: string, name: string) {
  const token = generateToken({
    id: profileId,
    email,
    name,
    userType: "MENTOR",
  });

  cookies().set(MENTOR_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });
}

/**
 * Get student session
 */
export async function getStudentSession(): Promise<TokenPayload | null> {
  const token = cookies().get(STUDENT_TOKEN_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || payload.userType !== "STUDENT") return null;

  // Verify student still exists and is active
  const profile = await prisma.learningProfile.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, status: true, userType: true },
  });

  if (!profile || profile.status !== "ACTIVE" || profile.userType !== "STUDENT") {
    await clearStudentSession();
    return null;
  }

  return payload;
}

/**
 * Get mentor session
 */
export async function getMentorSession(): Promise<TokenPayload | null> {
  const token = cookies().get(MENTOR_TOKEN_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || payload.userType !== "MENTOR") return null;

  // Verify mentor still exists and is active
  const profile = await prisma.learningProfile.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, status: true, userType: true },
  });

  if (!profile || profile.status !== "ACTIVE" || profile.userType !== "MENTOR") {
    await clearMentorSession();
    return null;
  }

  return payload;
}

/**
 * Clear student session
 */
export async function clearStudentSession() {
  cookies().delete(STUDENT_TOKEN_NAME);
}

/**
 * Clear mentor session
 */
export async function clearMentorSession() {
  cookies().delete(MENTOR_TOKEN_NAME);
}

/**
 * Require student authentication (use in server components/actions)
 */
export async function requireStudent(): Promise<TokenPayload> {
  const session = await getStudentSession();
  if (!session) {
    throw new Error("Unauthorized: Student login required");
  }
  return session;
}

/**
 * Require mentor authentication (use in server components/actions)
 */
export async function requireMentor(): Promise<TokenPayload> {
  const session = await getMentorSession();
  if (!session) {
    throw new Error("Unauthorized: Mentor login required");
  }
  return session;
}

/**
 * Student login
 */
export async function loginStudent(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
  profile?: { id: string; email: string; name: string };
}> {
  try {
    const profile = await prisma.learningProfile.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        userType: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!profile) {
      return { success: false, error: "Invalid email or password" };
    }

    if (profile.status !== "ACTIVE") {
      return { success: false, error: "Account is not active. Please contact support." };
    }

    const isValid = await verifyPassword(password, profile.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Update last login
    await prisma.learningProfile.update({
      where: { id: profile.id },
      data: { lastLoginAt: new Date() },
    });

    // Set session
    await setStudentSession(profile.id, profile.email, profile.name);

    return {
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    };
  } catch (error) {
    console.error("[STUDENT AUTH] Login error:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}

/**
 * Mentor login
 */
export async function loginMentor(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
  profile?: { id: string; email: string; name: string };
}> {
  try {
    const profile = await prisma.learningProfile.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        userType: "MENTOR",
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!profile) {
      return { success: false, error: "Invalid email or password" };
    }

    if (profile.status !== "ACTIVE") {
      return { success: false, error: "Account is not active. Please contact support." };
    }

    const isValid = await verifyPassword(password, profile.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Update last login
    await prisma.learningProfile.update({
      where: { id: profile.id },
      data: { lastLoginAt: new Date() },
    });

    // Set session
    await setMentorSession(profile.id, profile.email, profile.name);

    return {
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    };
  } catch (error) {
    console.error("[MENTOR AUTH] Login error:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}

/**
 * Student logout
 */
export async function logoutStudent() {
  await clearStudentSession();
}

/**
 * Mentor logout
 */
export async function logoutMentor() {
  await clearMentorSession();
}
