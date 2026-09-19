"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { formatCareDate } from "@/lib/dates";
import type { PregnancySnapshot } from "@/lib/pregnancy";
import { ChartBox, PanelCard } from "@/components/homepage/dashboard/PanelCard";
import { chartColors } from "@/components/homepage/dashboard/chartTheme";

const VISIT_WINDOW = 28;

export function NextVisitPanel({
  snapshot,
  savedVisit,
}: {
  snapshot: PregnancySnapshot;
  savedVisit: string | null;
}) {
  const days = snapshot.daysUntilVisit;
  const title =
    days === null
      ? "Not set yet"
      : snapshot.visitPassed
        ? "Visit date passed"
        : days === 0
          ? "Today"
          : days === 1
            ? "1 day left"
            : `${days} days left`;

  const body =
    days === null
      ? "Add your next appointment above so the countdown can appear here."
      : snapshot.visitPassed
        ? `${formatCareDate(savedVisit)} has passed. Update the date when you book again.`
        : `Next visit on ${formatCareDate(savedVisit)}.`;

  const remaining = days === null ? 0 : snapshot.visitPassed ? 0 : Math.min(days, VISIT_WINDOW);
  const data = [{ name: "Visit", value: remaining, fill: chartColors.sky }];

  return (
    <PanelCard eyebrow="Next visit" title={title}>
      <p className="mt-2 text-sm leading-6 text-rose-900/75">{body}</p>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="58%"
            outerRadius="100%"
            startAngle={210}
            endAngle={-30}
          >
            <PolarAngleAxis type="number" domain={[0, VISIT_WINDOW]} tick={false} />
            <RadialBar dataKey="value" background cornerRadius={12} />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartBox>
      <p className="text-center text-xs text-rose-800/80">Gauge shows up to a 28-day window</p>
    </PanelCard>
  );
}
