"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartColors, tooltipStyle } from "@/components/homepage/dashboard/chartTheme";
import { formatCareDate } from "@/lib/dates";
import {
  MOVEMENT_REFERENCE_COUNT,
  movementChartDays,
  type MovementLog,
} from "@/lib/baby-movements";

export type MovementChartRow = {
  date: string;
  count: number | null;
  label: string;
};

export function buildMovementChartRows(log: MovementLog, today: string): MovementChartRow[] {
  if (!today) return [];
  return movementChartDays(log, today).map((day) => ({
    ...day,
    label: shortDayLabel(day.date),
  }));
}

export function movementChartMax(rows: MovementChartRow[]) {
  return Math.max(MOVEMENT_REFERENCE_COUNT, ...rows.map((row) => row.count ?? 0));
}

export function MovementSetsChart({
  rows,
  chartMax,
}: {
  rows: MovementChartRow[];
  chartMax: number;
}) {
  return (
    <div className="mt-4 h-56 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: chartColors.ink }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, chartMax]}
            allowDecimals={false}
            tick={{ fontSize: 10, fill: chartColors.ink }}
            width={28}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [
              value == null || value === "" ? "—" : `${value} sets`,
              "Sets",
            ]}
            labelFormatter={(_, payload) => {
              const date = payload?.[0]?.payload?.date;
              return typeof date === "string" ? formatCareDate(date) : "";
            }}
          />
          <ReferenceLine
            y={MOVEMENT_REFERENCE_COUNT}
            stroke="#dc2626"
            strokeWidth={2}
            ifOverflow="extendDomain"
            label={{
              value: "Minimum",
              fill: "#dc2626",
              fontSize: 11,
              position: "insideTopRight",
            }}
          />
          <Bar
            dataKey="count"
            name="Sets"
            fill={chartColors.sage}
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function shortDayLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
