import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { GraduationCap, Users, UserCheck, ClipboardList, TrendingUp, Clock } from "lucide-react";

export const metadata = {
  title: "Learning Management | Admin | VeyraTech",
  description: "Manage learning programmes, applications, students, and mentors",
};

async function getLearningStats() {
  const [
    totalApplications,
    pendingApplications,
    totalStudents,
    totalMentors,
    recentApplications,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
      },
    }),
    prisma.learningProfile.count({
      where: { userType: "STUDENT", status: "ACTIVE" },
    }),
    prisma.learningProfile.count({
      where: { userType: "MENTOR", status: "ACTIVE" },
    }),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        profile: {
          select: { name: true, email: true },
        },
        programme: {
          select: { name: true },
        },
      },
    }),
  ]);

  return {
    totalApplications,
    pendingApplications,
    totalStudents,
    totalMentors,
    recentApplications,
  };
}

export default async function LearningDashboardPage() {
  await requireAuth();

  const stats = await getLearningStats();

  const statCards = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: <ClipboardList className="w-8 h-8" />,
      href: "/admin/learning/applications",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Pending Review",
      value: stats.pendingApplications,
      icon: <Clock className="w-8 h-8" />,
      href: "/admin/learning/applications?status=pending",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      label: "Active Students",
      value: stats.totalStudents,
      icon: <Users className="w-8 h-8" />,
      href: "/admin/learning/students",
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Active Mentors",
      value: stats.totalMentors,
      icon: <UserCheck className="w-8 h-8" />,
      href: "/admin/learning/mentors",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  const statusColors = {
    SUBMITTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    UNDER_REVIEW: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    ACCEPTED: "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    WAITLISTED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-8 h-8 text-secondary" />
          <h1 className="text-3xl font-bold text-text-primary">Learning Management</h1>
        </div>
        <p className="text-text-secondary">
          Manage learning programmes, applications, students, and mentors
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block bg-background-light p-6 rounded-xl border border-border hover:border-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-background-light p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Recent Applications</h2>
          <Link
            href="/admin/learning/applications"
            className="text-sm text-secondary hover:text-secondary/80 font-medium"
          >
            View All →
          </Link>
        </div>

        {stats.recentApplications.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No applications yet</p>
            <p className="text-sm text-text-muted mt-1">
              Applications will appear here when students apply
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentApplications.map((application) => (
              <Link
                key={application.id}
                href={`/admin/learning/applications/${application.id}`}
                className="block p-4 rounded-lg border border-border hover:border-secondary/50 hover:bg-background transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-primary">
                        {application.profile.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          statusColors[application.status]
                        }`}
                      >
                        {application.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">
                      {application.profile.email}
                    </p>
                    <p className="text-sm text-text-muted">
                      Programme: {application.programme.name}
                    </p>
                  </div>
                  <div className="text-right text-sm text-text-muted">
                    <div>Ref: {application.referenceNumber}</div>
                    <div className="mt-1">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/learning/applications"
          className="block bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors"
        >
          <ClipboardList className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Review Applications
          </h3>
          <p className="text-sm text-text-secondary">
            Review and process student applications
          </p>
        </Link>

        <Link
          href="/admin/learning/students"
          className="block bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-colors"
        >
          <Users className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Manage Students</h3>
          <p className="text-sm text-text-secondary">View and manage enrolled students</p>
        </Link>

        <Link
          href="/admin/learning/mentors"
          className="block bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors"
        >
          <UserCheck className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Manage Mentors</h3>
          <p className="text-sm text-text-secondary">
            View and assign mentors to students
          </p>
        </Link>
      </div>
    </div>
  );
}
