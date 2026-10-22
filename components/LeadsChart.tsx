"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LeadsChart({ data }: { data: { dia: string; leads: number }[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="dia" tickLine={false} axisLine={false} interval={3} tick={{ fontSize: 12, fill: "var(--muted)" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted)" }} />
          <Tooltip
            cursor={{ fill: "var(--surface-2)" }}
            contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
            formatter={(v) => [v as number, "Leads"]}
          />
          <Bar dataKey="leads" fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
