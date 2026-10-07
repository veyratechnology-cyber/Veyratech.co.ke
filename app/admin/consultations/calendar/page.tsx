"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import ConsultationCalendar from '@/components/admin/ConsultationCalendar';

export default function ConsultationCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-sora font-bold text-text-primary mb-2">
          Consultation Calendar
        </h1>
        <p className="text-text-secondary">
          View and manage all scheduled consultations
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <ConsultationCalendar />
        </CardContent>
      </Card>
    </div>
  );
}
