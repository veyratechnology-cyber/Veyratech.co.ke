"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Clock, Loader2 } from "lucide-react";

interface ApplicationActionsProps {
  applicationId: string;
  applicationEmail: string;
  applicationName: string;
  programmeName: string;
  adminId: string;
}

export function ApplicationActions({
  applicationId,
  applicationEmail,
  applicationName,
  programmeName,
  adminId,
}: ApplicationActionsProps) {
  const router = useRouter();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");

  const handleAccept = async () => {
    if (!confirm(`Accept ${applicationName} for ${programmeName}?\n\nThey will receive an email with account activation instructions.`)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/learning/applications/${applicationId}/admit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Application accepted! Admission email sent to student.");
        router.refresh();
      } else {
        setError(data.error || "Failed to accept application");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/learning/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          adminId,
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowRejectModal(false);
        alert("Application rejected");
        router.refresh();
      } else {
        setError(data.error || "Failed to reject application");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWaitlist = async () => {
    if (!confirm(`Move ${applicationName} to waitlist?`)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/learning/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "WAITLISTED",
          adminId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Application moved to waitlist");
        router.refresh();
      } else {
        setError(data.error || "Failed to waitlist application");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/learning/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "UNDER_REVIEW",
          adminId,
          notes: adminNotes.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowNotesModal(false);
        alert("Notes saved");
        router.refresh();
      } else {
        setError(data.error || "Failed to save notes");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleAccept}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          Accept
        </button>

        <button
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </button>

        <button
          onClick={handleWaitlist}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Clock className="w-4 h-4 mr-2" />
          Waitlist
        </button>

        <button
          onClick={() => setShowNotesModal(true)}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-background-light hover:bg-background text-text-primary font-medium rounded-lg border border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Notes
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-light rounded-xl border border-border max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Reject Application
            </h3>

            <p className="text-text-secondary mb-4">
              Please provide a reason for rejecting this application. This will help improve
              our review process.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-secondary text-text-primary resize-none mb-4"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Application"
                )}
              </button>

              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setError("");
                }}
                disabled={loading}
                className="px-4 py-2 bg-background hover:bg-background-light text-text-primary font-medium rounded-lg border border-border transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-light rounded-xl border border-border max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Add Admin Notes</h3>

            <p className="text-text-secondary mb-4">
              Add private notes about this application. These notes are only visible to admins.
            </p>

            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes..."
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-secondary text-text-primary resize-none mb-4"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSaveNotes}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Saving...
                  </>
                ) : (
                  "Save Notes"
                )}
              </button>

              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setAdminNotes("");
                  setError("");
                }}
                disabled={loading}
                className="px-4 py-2 bg-background hover:bg-background-light text-text-primary font-medium rounded-lg border border-border transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
