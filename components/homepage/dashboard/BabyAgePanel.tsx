"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCareDate } from "@/lib/dates";
import type { PregnancySnapshot } from "@/lib/pregnancy";
import { ChartBox, PanelCard } from "@/components/homepage/dashboard/PanelCard";
import { chartColors, tooltipStyle } from "@/components/homepage/dashboard/chartTheme";

export function BabyAgePanel({ snapshot }: { snapshot: PregnancySnapshot }) {
  const data = [
    { name: "Trimester 1", weeks: 13, fill: chartColors.roseSoft },
    { name: "Trimester 2", weeks: 14, fill: chartColors.sageSoft },
    { name: "Trimester 3", weeks: 13, fill: chartColors.sage },
  ].map((row, index) => ({
    ...row,
    fill: snapshot.trimester === index + 1 ? chartColors.rose : row.fill,
  }));

  return (
    <PanelCard eyebrow="Baby age" title={`Week ${snapshot.week}, day ${snapshot.day}`}>
      <p className="mt-2 text-sm leading-6 text-rose-900/75">
        Trimester {snapshot.trimester}. Counted from{" "}
        {snapshot.usingTodayFallback ? "today" : formatCareDate(snapshot.start)}.
      </p>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="weeks" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </ChartBox>
    </PanelCard>
  );
}
