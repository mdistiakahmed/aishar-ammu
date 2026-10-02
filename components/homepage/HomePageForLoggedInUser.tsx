"use client";

import { DashboardTrackerCharts } from "@/components/homepage/DashboardTrackerCharts";
import { PregnancyDashPreview } from "@/components/homepage/PregnancyDashPreview";
import { ProfileDetailsCollapsible } from "@/components/homepage/ProfileDetailsCollapsible";
import type { SessionUser } from "@/lib/user";

export function HomePageForLoggedInUser({ user }: { user: SessionUser }) {
  return (
    <div className="space-y-5">
      <div id="pregnancy-journey" className="scroll-mt-24">
        <PregnancyDashPreview
          pregnancyStartDate={user.pregnancyStartDate}
          preferredName={user.preferredName || user.name}
          afterGreeting={<ProfileDetailsCollapsible user={user} />}
        />
      </div>
      <DashboardTrackerCharts />
    </div>
  );
}
