import { BabyAgePanel } from "@/components/homepage/dashboard/BabyAgePanel";
import { BabyNamesPanel } from "@/components/homepage/dashboard/BabyNamesPanel";
import { BabySizePanel } from "@/components/homepage/dashboard/BabySizePanel";
import { BabyWeightPanel } from "@/components/homepage/dashboard/BabyWeightPanel";
import { CareDatesPanel } from "@/components/homepage/dashboard/CareDatesPanel";
import { DueCountdownPanel } from "@/components/homepage/dashboard/DueCountdownPanel";
import { NextVisitPanel } from "@/components/homepage/dashboard/NextVisitPanel";
import { ProgressPanel } from "@/components/homepage/dashboard/ProgressPanel";
import { ThisWeekPanel } from "@/components/homepage/dashboard/ThisWeekPanel";
import type { SessionUser } from "@/lib/user";
import { buildPregnancySnapshot } from "@/lib/pregnancy";
import type { WeightLog } from "@/lib/weights";

export function HomePageForLoggedInUser({
  user,
  logs,
}: {
  user: SessionUser;
  logs: WeightLog[];
}) {
  const snapshot = buildPregnancySnapshot(user);
  const greeting = user.preferredName || user.name.split(" ")[0] || "there";

  return (
    <div className="space-y-5">
      <p className="px-1 text-2xl font-semibold text-rose-950 sm:text-3xl">Hello, {greeting}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BabyWeightPanel snapshot={snapshot} startWeightKg={user.weightAtStartKg} logs={logs} />
        <BabySizePanel snapshot={snapshot} />
      </div>
      <CareDatesPanel
        snapshot={snapshot}
        nextDoctorVisitDate={user.nextDoctorVisitDate ?? ""}
      />
      <ProgressPanel snapshot={snapshot} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BabyAgePanel snapshot={snapshot} />
        <NextVisitPanel snapshot={snapshot} savedVisit={user.nextDoctorVisitDate} />
        <DueCountdownPanel snapshot={snapshot} />
        <ThisWeekPanel snapshot={snapshot} />
        <BabyNamesPanel />
      </div>
    </div>
  );
}
