"use client";

import React, { Suspense } from "react";
import SimpleBooking from "./simple-booking";
import BookingFAQ from "@/components/booking/BookingFAQ";

/**
 * Consultation Booking Page - Simple Form with FAQ
 */
export default function BookConsultationPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center">Loading...</div></div>}>
        <SimpleBooking />
      </Suspense>
      <BookingFAQ />
    </>
  );
}
