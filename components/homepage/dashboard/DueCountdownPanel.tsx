"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCareDate } from "@/lib/dates";
import type { PregnancySnapshot } from "@/lib/pregnancy";
import { ChartBox, PanelCard } from "@/components/homepage/dashboard/PanelCard";
import { chartColors, tooltipStyle } from "@/components/homepage/dashboard/chartTheme";

const PREGNANCY_DAYS = 280;

export function DueCountdownPanel({ snapshot }: { snapshot: PregnancySnapshot }) {
  const days = snapshot.daysUntilDue;
  const title =
    days > 1
      ? `${days} days left`
      : days === 1
        ? "1 day left"
        : days === 0
          ? "Due today"
          : days === -1
            ? "1 day past the due date"
            : `${Math.abs(days)} days past the due date`;

  const body =
    days >= 0
      ? `Estimated arrival window around ${formatCareDate(snapshot.due)}.`
      : `${formatCareDate(snapshot.due)} was the saved due date. Your clinician can advise on next steps.`;

  const remaining = Math.max(0, days);
  const elapsed = Math.min(PREGNANCY_DAYS, Math.max(0, PREGNANCY_DAYS - remaining));
  const data = [{ name: "280-day timeline", passed: elapsed, left: remaining }];

  return (
    <PanelCard eyebrow="Due countdown" title={title}>
      <p className="mt-2 text-sm leading-6 text-rose-900/75">{body}</p>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 16, right: 12, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" horizontal={false} />
            <XAxis type="number" domain={[0, PREGNANCY_DAYS]} tick={{ fontSize: 10, fill: chartColors.ink }} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: chartColors.ink }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="passed" name="Days passed" stackId="due" fill={chartColors.sage} />
            <Bar dataKey="left" name="Days left" stackId="due" fill={chartColors.roseSoft} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </PanelCard>
  );
}
