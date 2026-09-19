"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PregnancySnapshot } from "@/lib/pregnancy";
import { ChartBox, PanelCard } from "@/components/homepage/dashboard/PanelCard";
import { chartColors, tooltipStyle } from "@/components/homepage/dashboard/chartTheme";

export function ThisWeekPanel({ snapshot }: { snapshot: PregnancySnapshot }) {
  const week = Math.min(Math.max(snapshot.week, 0), 40);
  const data = [
    { topic: "Week of 40", value: Math.round((week / 40) * 100) },
    { topic: "Day of week", value: Math.round((snapshot.day / 6) * 100) },
    { topic: "Trimester", value: Math.round((snapshot.trimester / 3) * 100) },
  ];

  return (
    <PanelCard eyebrow="This week" title={`Week ${week}`}>
      <p className="mt-2 text-sm leading-6 text-rose-900/75">{snapshot.milestone.note}</p>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#fecdd3" />
            <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: chartColors.ink }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar dataKey="value" stroke={chartColors.rose} fill={chartColors.roseSoft} fillOpacity={0.6} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, "Relative"]} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartBox>
    </PanelCard>
  );
}
