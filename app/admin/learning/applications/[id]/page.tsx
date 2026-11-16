import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth, getCurrentAdminId } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Laptop, Clock, Target, MessageSquare } from "lucide-react";
import { ApplicationActions } from "./ApplicationActions";

export const metadata = {
  title: "Application Review | Learning Management | Admin | VeyraTech",
};

interface PageProps {
  params: {
    id: string;
  };
}

async function getApplication(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      profile: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          country: true,
          city: true,
          status: true,
          createdAt: true,
        },
      },
      programme: {
        select: {
          id: true,
          name: true,
          duration: true,
          level: true,
        },
      },
    },
  });

  return application;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  await requireAuth();
  const adminId = await getCurrentAdminId();

  const application = await getApplication(params.id);

  if (!application) {
    notFound();
  }

  const statusColors = {
    SUBMITTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    UNDER_REVIEW: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    ACCEPTED: "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    WAITLISTED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const isPending = application.status === "SUBMITTED" || application.status === "UNDER_REVIEW";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/learning/applications"
          className="inline-flex items-center text-secondary hover:text-secondary/80 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {application.fullName}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm px-3 py-1 rounded-full border font-medium ${
                  statusColors[application.status]
                }`}
              >
                {application.status.replace("_", " ")}
              </span>
              <span className="text-sm text-text-muted">
                Ref: {application.referenceNumber}
              </span>
            </div>
          </div>

          {isPending && adminId && (
            <ApplicationActions
              applicationId={application.id}
              applicationEmail={application.email}
              applicationName={application.fullName}
              programmeName={application.programme.name}
              adminId={adminId}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-background-light p-6 rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-text-muted mb-1">Full Name</div>
                <div className="text-text-primary font-medium">{application.fullName}</div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Email</div>
                <div className="text-text-primary">
                  <a
                    href={`mailto:${application.email}`}
                    className="hover:text-secondary transition-colors"
                  >
                    {application.email}
                  </a>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Phone</div>
                <div className="text-text-primary">{application.phone}</div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Location</div>
                <div className="text-text-primary">
                  {application.city}, {application.country}
                </div>
              </div>
            </div>
          </div>

          {/* Education & Experience */}
          <div className="bg-background-light p-6 rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education & Experience
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-text-muted mb-1">Education Level</div>
                <div className="text-text-primary font-medium capitalize">
                  {application.educationLevel.replace("-", " ")}
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Institution</div>
                <div className="text-text-primary">{application.institution}</div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Current Occupation</div>
                <div className="text-text-primary">{application.currentOccupation}</div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Programming Experience</div>
                <div className="text-text-primary capitalize">
                  {application.programmingExperience}
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Laptop Availability</div>
                <div className="flex items-center gap-2">
                  <Laptop
                    className={`w-4 h-4 ${
                      application.hasLaptop ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className="text-text-primary">
                    {application.hasLaptop ? "Has laptop" : "No laptop"}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Weekly Availability</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span className="text-text-primary">{application.weeklyAvailability}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-background-light p-6 rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Motivation & Goals
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-text-primary mb-2">
                  Why do you want to join this programme?
                </div>
                <div className="text-text-secondary bg-background p-4 rounded-lg">
                  {application.whyJoin}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-text-primary mb-2">
                  What are your learning goals?
                </div>
                <div className="text-text-secondary bg-background p-4 rounded-lg">
                  {application.goals}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {application.adminNotes && (
            <div className="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/20">
              <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-yellow-500" />
                Admin Notes
              </h2>
              <div className="text-text-secondary">{application.adminNotes}</div>
            </div>
          )}

          {/* Rejection Reason */}
          {application.rejectionReason && (
            <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Rejection Reason
              </h2>
              <div className="text-text-secondary">{application.rejectionReason}</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Programme Info */}
          <div className="bg-background-light p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Programme</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-text-muted mb-1">Programme Name</div>
                <div className="text-text-primary font-medium">
                  {application.programme.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-text-muted mb-1">Duration</div>
                <div className="text-text-primary">{application.programme.duration}</div>
              </div>
              <div>
                <div className="text-sm text-text-muted mb-1">Level</div>
                <div className="text-text-primary">{application.programme.level}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-background-light p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-text-muted mb-1">Submitted</div>
                <div className="text-text-primary">
                  {new Date(application.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              {application.reviewedAt && (
                <div>
                  <div className="text-sm text-text-muted mb-1">Reviewed</div>
                  <div className="text-text-primary">
                    {new Date(application.reviewedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              )}

              {application.updatedAt && application.updatedAt !== application.createdAt && (
                <div>
                  <div className="text-sm text-text-muted mb-1">Last Updated</div>
                  <div className="text-text-primary">
                    {new Date(application.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-background-light p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Account Status</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-text-muted mb-1">Profile Status</div>
                <div className="text-text-primary capitalize">
                  {application.profile.status.toLowerCase()}
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-1">Profile Created</div>
                <div className="text-text-primary">
                  {new Date(application.profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
