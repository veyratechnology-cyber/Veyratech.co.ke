import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Admin Layout
 * Protected layout with sidebar navigation
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession(authOptions);

    // Redirect to login if not authenticated
    if (!session || !session.user) {
      console.warn('[ADMIN LAYOUT] No session found, redirecting to login');
      redirect("/admin-login");
    }

    console.log('[ADMIN LAYOUT] Session valid for:', session.user.email);

    return (
      <div className="flex h-screen bg-primary">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader user={session.user} />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('[ADMIN LAYOUT] Error:', error?.message || error);
    redirect("/admin-login");
  }
}
