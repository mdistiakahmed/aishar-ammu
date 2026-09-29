"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MotherWeightPoint } from "@/lib/mother-weights";

const actualGreen = "#22c55e";
const expectedGray = "#9ca3af";

export function MotherWeightProgressChart({
  rows,
  xTicks,
  yTicks,
}: {
  rows: MotherWeightPoint[];
  xTicks: number[];
  yTicks: number[];
}) {
  const low = yTicks[0] ?? 0;
  const high = yTicks[yTicks.length - 1] ?? low;

  return (
    <div className="mt-4 h-72 w-full min-w-0 rounded-2xl bg-[#f6f7f9] px-1 py-3 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 6" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="week"
            ticks={xTicks}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <YAxis
            domain={[low, high]}
            ticks={yTicks}
            tickFormatter={(value) => `${value} kg`}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              fontSize: 12,
              color: "#111827",
            }}
            formatter={(value, name) => [
              value == null || value === "" ? "—" : `${value} kg`,
              String(name),
            ]}
            labelFormatter={(week) => `Week ${week}`}
          />
          <Line
            type="linear"
            dataKey="expected"
            name="Expected"
            stroke={expectedGray}
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={false}
          />
          <Line
            type="linear"
            dataKey="actual"
            name="Actual"
            stroke={actualGreen}
            strokeWidth={2.5}
            dot={{ r: 5, fill: actualGreen, stroke: actualGreen }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
