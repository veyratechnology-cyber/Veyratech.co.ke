/**
 * Application Processing Utilities
 */

import prisma from "@/lib/db/prisma";
import { ApplicationStatus } from "@prisma/client";
import { hashPassword } from "./auth";
import { sendApplicationConfirmation, sendAdmissionNotification } from "./emails";

/**
 * Generate unique application reference number
 * Format: APP-YYYYMM-XXXX
 */
export function generateReferenceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `APP-${year}${month}-${random}`;
}

/**
 * Check if email already has an application
 */
export async function hasExistingApplication(email: string, programmeId: string): Promise<boolean> {
  const existing = await prisma.application.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      programmeId,
      status: {
        in: ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "WAITLISTED"],
      },
    },
  });

  return !!existing;
}

/**
 * Submit new application
 */
export async function submitApplication(data: {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  educationLevel: string;
  institution: string;
  fieldOfStudy?: string;
  programme: string;
  motivation: string;
  previousExperience?: string;
  learningGoals: string;
  referralSource: string;
}): Promise<{
  success: boolean;
  error?: string;
  referenceNumber?: string;
  applicationId?: string;
}> {
  try {
    const email = data.email.toLowerCase().trim();

    // Check for existing application
    const existing = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM applications
      WHERE email = ${email}
      AND status IN ('PENDING', 'ACCEPTED')
      LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: false,
        error: "You have already submitted an application. Please check your email for updates.",
      };
    }

    const referenceNumber = generateReferenceNumber();

    // Create application using raw SQL
    const result = await prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO applications (
        name, email, phone, date_of_birth, country,
        education_level, institution, field_of_study, programme,
        motivation, previous_experience, learning_goals, referral_source,
        status, created_at, updated_at
      )
      VALUES (
        ${data.name}, ${email}, ${data.phone}, ${data.dateOfBirth}, ${data.country},
        ${data.educationLevel}, ${data.institution}, ${data.fieldOfStudy || null}, ${data.programme},
        ${data.motivation}, ${data.previousExperience || null}, ${data.learningGoals}, ${data.referralSource},
        'PENDING', NOW(), NOW()
      )
      RETURNING id
    `;

    const applicationId = result[0]?.id;

    // Send confirmation email
    await sendApplicationConfirmation({
      email,
      name: data.name,
      referenceNumber,
      programmeName: data.programme,
    });

    return {
      success: true,
      referenceNumber,
      applicationId,
    };
  } catch (error) {
    console.error("[APPLICATION] Submit error:", error);
    return {
      success: false,
      error: "An error occurred while submitting your application. Please try again.",
    };
  }
}

/**
 * Get application by reference number
 */
export async function getApplicationByReference(referenceNumber: string) {
  return prisma.application.findUnique({
    where: { referenceNumber },
    include: {
      profile: {
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
        },
      },
      programme: {
        select: {
          id: true,
          name: true,
          duration: true,
        },
      },
    },
  });
}

/**
 * Update application status
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  adminId: string,
  notes?: string,
  rejectionReason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        reviewedById: adminId,
        reviewedAt: new Date(),
        adminNotes: notes,
        rejectionReason,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[APPLICATION] Update status error:", error);
    return {
      success: false,
      error: "Failed to update application status.",
    };
  }
}

/**
 * Admit applicant and send activation email
 */
export async function admitApplicant(
  applicationId: string,
  adminId: string
): Promise<{
  success: boolean;
  error?: string;
  activationToken?: string;
}> {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        profile: true,
        programme: true,
      },
    });

    if (!application) {
      return { success: false, error: "Application not found." };
    }

    if (application.status === "ACCEPTED") {
      return { success: false, error: "Applicant already admitted." };
    }

    // Generate secure activation token
    const activationToken = `${application.profile.id}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    // Update application status
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "ACCEPTED",
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });

    // Send admission notification with activation link
    await sendAdmissionNotification({
      email: application.email,
      name: application.fullName,
      programmeName: application.programme.name,
      activationToken,
    });

    return {
      success: true,
      activationToken,
    };
  } catch (error) {
    console.error("[ADMISSION] Error:", error);
    return {
      success: false,
      error: "Failed to admit applicant.",
    };
  }
}

/**
 * Activate student account
 */
export async function activateStudentAccount(
  activationToken: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  profileId?: string;
}> {
  try {
    // Extract profile ID from token (first part before first hyphen)
    const profileId = activationToken.split("-")[0];

    const profile = await prisma.learningProfile.findUnique({
      where: { id: profileId },
      include: {
        application: {
          include: {
            programme: true,
          },
        },
      },
    });

    if (!profile || !profile.application) {
      return { success: false, error: "Invalid activation link." };
    }

    if (profile.application.status !== "ACCEPTED") {
      return { success: false, error: "Application not approved." };
    }

    if (profile.status === "ACTIVE") {
      return { success: false, error: "Account already activated." };
    }

    // Hash password and activate account
    const passwordHash = await hashPassword(password);

    await prisma.learningProfile.update({
      where: { id: profileId },
      data: {
        passwordHash,
        status: "ACTIVE",
        activatedAt: new Date(),
      },
    });

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        profileId: profile.id,
        programmeId: profile.application.programmeId,
        status: "ACTIVE",
      },
    });

    return {
      success: true,
      profileId: profile.id,
    };
  } catch (error) {
    console.error("[ACTIVATION] Error:", error);
    return {
      success: false,
      error: "Failed to activate account.",
    };
  }
}
