import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { ClipboardList, Search, Filter, Eye } from "lucide-react";
import { ApplicationStatus } from "@prisma/client";

export const metadata = {
  title: "Applications | Learning Management | Admin | VeyraTech",
  description: "Review and manage student applications",
};

interface PageProps {
  searchParams: {
    status?: string;
    search?: string;
  };
}

async function getApplications(filters: { status?: string; search?: string }) {
  const where: any = {};

  if (filters.status && filters.status !== "all") {
    if (filters.status === "pending") {
      where.status = { in: ["SUBMITTED", "UNDER_REVIEW"] };
    } else {
      where.status = filters.status.toUpperCase() as ApplicationStatus;
    }
  }

  if (filters.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { referenceNumber: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      profile: {
        select: { name: true, email: true, status: true },
      },
      programme: {
        select: { name: true },
      },
    },
  });

  return applications;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  await requireAuth();

  const applications = await getApplications({
    status: searchParams.status,
    search: searchParams.search,
  });

  const statusCounts = {
    all: await prisma.application.count(),
    pending: await prisma.application.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    }),
    accepted: await prisma.application.count({ where: { status: "ACCEPTED" } }),
    rejected: await prisma.application.count({ where: { status: "REJECTED" } }),
    waitlisted: await prisma.application.count({ where: { status: "WAITLISTED" } }),
  };

  const currentStatus = searchParams.status || "all";

  const statusColors = {
    SUBMITTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    UNDER_REVIEW: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    ACCEPTED: "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    WAITLISTED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-bold text-text-primary">Applications</h1>
        </div>
        <p className="text-text-secondary">Review and process student applications</p>
      </div>

      {/* Stats Tabs */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/learning/applications"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentStatus === "all"
              ? "bg-secondary text-white border-secondary"
              : "bg-background-light text-text-secondary border-border hover:border-secondary/50"
          }`}
        >
          All ({statusCounts.all})
        </Link>
        <Link
          href="/admin/learning/applications?status=pending"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentStatus === "pending"
              ? "bg-secondary text-white border-secondary"
              : "bg-background-light text-text-secondary border-border hover:border-secondary/50"
          }`}
        >
          Pending ({statusCounts.pending})
        </Link>
        <Link
          href="/admin/learning/applications?status=accepted"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentStatus === "accepted"
              ? "bg-secondary text-white border-secondary"
              : "bg-background-light text-text-secondary border-border hover:border-secondary/50"
          }`}
        >
          Accepted ({statusCounts.accepted})
        </Link>
        <Link
          href="/admin/learning/applications?status=rejected"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentStatus === "rejected"
              ? "bg-secondary text-white border-secondary"
              : "bg-background-light text-text-secondary border-border hover:border-secondary/50"
          }`}
        >
          Rejected ({statusCounts.rejected})
        </Link>
        <Link
          href="/admin/learning/applications?status=waitlisted"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentStatus === "waitlisted"
              ? "bg-secondary text-white border-secondary"
              : "bg-background-light text-text-secondary border-border hover:border-secondary/50"
          }`}
        >
          Waitlisted ({statusCounts.waitlisted})
        </Link>
      </div>

      {/* Search */}
      <div className="bg-background-light p-4 rounded-xl border border-border">
        <form method="GET" className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search}
              placeholder="Search by name, email, or reference number..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-secondary text-text-primary"
            />
          </div>
          {searchParams.status && <input type="hidden" name="status" value={searchParams.status} />}
          <button
            type="submit"
            className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Applications List */}
      <div className="bg-background-light rounded-xl border border-border">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No applications found</p>
            <p className="text-sm text-text-muted mt-1">
              {searchParams.search
                ? "Try adjusting your search criteria"
                : "Applications will appear here when students apply"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {applications.map((application) => (
              <Link
                key={application.id}
                href={`/admin/learning/applications/${application.id}`}
                className="block p-6 hover:bg-background transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {application.fullName}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          statusColors[application.status]
                        }`}
                      >
                        {application.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <div className="text-text-secondary">
                        <span className="text-text-muted">Email:</span> {application.email}
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-text-muted">Phone:</span> {application.phone}
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-text-muted">Location:</span> {application.city},{" "}
                        {application.country}
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-text-muted">Programme:</span>{" "}
                        {application.programme.name}
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-text-muted">Education:</span>{" "}
                        {application.educationLevel}
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-text-muted">Experience:</span>{" "}
                        {application.programmingExperience}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono text-text-muted mb-2">
                      {application.referenceNumber}
                    </div>
                    <div className="text-sm text-text-muted">
                      {new Date(application.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-sm text-secondary hover:text-secondary/80">
                        <Eye className="w-4 h-4" />
                        Review
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {applications.length > 0 && (
        <div className="text-center text-sm text-text-muted">
          Showing {applications.length} application{applications.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
