"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { formatCareDate } from "@/lib/dates";
import type { PregnancySnapshot } from "@/lib/pregnancy";
import { ChartBox, PanelCard } from "@/components/homepage/dashboard/PanelCard";
import { chartColors } from "@/components/homepage/dashboard/chartTheme";

export function ProgressPanel({ snapshot }: { snapshot: PregnancySnapshot }) {
  const percent = Math.round(snapshot.progress * 100);
  const data = [{ name: "Progress", value: percent, fill: chartColors.sage }];

  return (
    <PanelCard eyebrow="Progress" title="Pregnancy progress" wide>
      <p className="mt-1 text-sm leading-6 text-rose-900/75">
        About {percent}% of a 40-week timeline. Due {formatCareDate(snapshot.due)}
        {snapshot.dueEstimated ? " (estimated from your start date)" : ""}.
      </p>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="62%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" background cornerRadius={12} />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartBox>
      <p className="text-center text-sm font-semibold text-rose-950">Week {snapshot.week} of 40</p>
    </PanelCard>
  );
}
