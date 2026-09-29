"use client";

import { DashboardTrackerCharts } from "@/components/homepage/DashboardTrackerCharts";
import { PregnancyDashPreview } from "@/components/homepage/PregnancyDashPreview";

export function HomePageForGuest() {
  return (
    <div className="space-y-5">
      <PregnancyDashPreview fillViewport />
      <DashboardTrackerCharts />
    </div>
  );
}
