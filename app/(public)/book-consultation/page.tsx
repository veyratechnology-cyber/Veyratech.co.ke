"use client";

import React, { Suspense } from "react";
import MultiStepBooking from "./multi-step-booking";

/**
 * Consultation Booking Page - Multi-Step Wizard
 * Includes package selection, payment integration, and meeting scheduling
 */
export default function BookConsultationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center">Loading...</div></div>}>
      <MultiStepBooking />
    </Suspense>
  );
}
