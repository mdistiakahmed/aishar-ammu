"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildMotherGainSeries } from "@/lib/mother-gain";
import { utcToday, type PregnancySnapshot } from "@/lib/pregnancy";
import type { WeightLog } from "@/lib/weights";
import { ChartBox, PanelCard } from "@/components/homepage/dashboard/PanelCard";
import { chartColors, tooltipStyle } from "@/components/homepage/dashboard/chartTheme";

export function BabyWeightPanel({
  snapshot,
  startWeightKg,
  logs,
}: {
  snapshot: PregnancySnapshot;
  startWeightKg: number | null;
  logs: WeightLog[];
}) {
  const data = buildMotherGainSeries({
    startDate: snapshot.start,
    startWeightKg,
    logs,
    today: utcToday(),
  });
  const latest = [...logs].sort((a, b) => a.loggedOn.localeCompare(b.loggedOn)).at(-1);
  const latestGain =
    startWeightKg !== null && latest
      ? Math.round((latest.weightKg - startWeightKg) * 10) / 10
      : null;

  return (
    <PanelCard
      eyebrow="Mother weight"
      title={
        latestGain === null
          ? "Add start and today’s weight"
          : `${latestGain >= 0 ? "+" : ""}${latestGain} kg from start`
      }
    >
      <p className="mt-2 text-sm leading-6 text-rose-900/75">
        This chart is mother weight change in kilograms, not baby size. The dotted line estimates days
        after your last log. The expected line is a typical educational curve.
      </p>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: chartColors.ink }} interval={14} />
            <YAxis tick={{ fontSize: 10, fill: chartColors.ink }} width={32} unit="kg" />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [`${value} kg`, String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="expected"
              name="Typical gain"
              stroke={chartColors.sage}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Logged gain"
              stroke={chartColors.rose}
              strokeWidth={2}
              dot={{ r: 2 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="projected"
              name="Projected"
              stroke={chartColors.roseSoft}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 2 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </PanelCard>
  );
}
