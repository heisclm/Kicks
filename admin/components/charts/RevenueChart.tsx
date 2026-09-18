"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function RevenueChart({
  data,
}: {
  data: { name: string; revenue: number; target: number }[];
}) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
      >
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          dy={10}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl">
                  ${payload[0].value?.toLocaleString()}
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="revenue" radius={[6, 6, 6, 6]} barSize={32}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.revenue === maxRevenue
                  ? "var(--brand-primary)"
                  : "var(--muted)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
