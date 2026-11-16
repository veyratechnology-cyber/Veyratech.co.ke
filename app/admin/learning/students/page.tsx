import { requireAuth } from "@/lib/auth/session";
import { Users, UserPlus } from "lucide-react";

export const metadata = {
  title: "Students | Learning Management | Admin | VeyraTech",
};

export default async function StudentsPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-bold text-text-primary">Students</h1>
        </div>
        <p className="text-text-secondary">Manage enrolled students and their progress</p>
      </div>

      <div className="bg-background-light p-12 rounded-xl border border-border text-center">
        <UserPlus className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Student Management Coming in Stage 4
        </h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Student dashboard, programme access, and progress tracking will be implemented in
          Stage 4 of the learning module development.
        </p>
      </div>
    </div>
  );
}
