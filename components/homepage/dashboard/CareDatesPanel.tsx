"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { daysBetween, utcToday, type PregnancySnapshot } from "@/lib/pregnancy";
import { ChartBox, PanelCard } from "@/components/homepage/dashboard/PanelCard";
import { chartColors, tooltipStyle } from "@/components/homepage/dashboard/chartTheme";

export function CareDatesPanel({
  snapshot,
  nextDoctorVisitDate,
}: {
  snapshot: PregnancySnapshot;
  nextDoctorVisitDate: string;
}) {
  const timeline = [
    { name: "Start", days: 0, lane: 1 },
    { name: "Today", days: Math.max(0, daysBetween(snapshot.start, utcToday())), lane: 2 },
    ...(nextDoctorVisitDate
      ? [{ name: "Visit", days: Math.max(0, daysBetween(snapshot.start, nextDoctorVisitDate)), lane: 3 }]
      : []),
    { name: "Due", days: Math.max(0, daysBetween(snapshot.start, snapshot.due)), lane: 4 },
  ];

  return (
    <PanelCard eyebrow="Dashboard" title="Your care dates" wide>
      <p className="mt-2 text-sm leading-6 text-rose-900/75">
        Update dates and weights in the side menu. Figures here are educational, not medical advice.
      </p>

      {snapshot.usingTodayFallback ? (
        <p className="mt-4 text-sm leading-6 text-rose-900/75">
          No start date is saved yet, so the dashboard is using today.
        </p>
      ) : null}

      <p className="mt-5 text-sm leading-6 text-rose-900/75">
        Days from your start date to today, the next visit, and the due date.
      </p>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
            <XAxis type="number" dataKey="days" name="Days" tick={{ fontSize: 11, fill: chartColors.ink }} />
            <YAxis type="number" dataKey="lane" tick={false} width={8} domain={[0, 5]} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, _name, item) => {
                const point = item?.payload as { name?: string; days?: number };
                return [`Day ${point.days ?? value}`, point.name ?? "Date"];
              }}
            />
            <Scatter data={timeline} fill={chartColors.rose} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartBox>
    </PanelCard>
  );
}
