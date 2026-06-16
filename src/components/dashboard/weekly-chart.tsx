"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  day: string;
  correct: number;
  incorrect: number;
}

export function WeeklyChart({ data }: { data: ChartData[] }) {
  const total = data.reduce((sum, d) => sum + d.correct + d.incorrect, 0);

  return (
    <div className="border rounded-xl p-6 bg-card shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold">Weekly Activity</h2>
        <span className="text-xs text-muted-foreground">{total} reviews this week</span>
      </div>
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" /> Correct</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /> Incorrect</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={10} barGap={2}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
            }}
            cursor={{ fill: "var(--muted)", radius: 4 }}
          />
          <Bar dataKey="correct" fill="#22c55e" radius={[4, 4, 0, 0]} name="Correct" />
          <Bar dataKey="incorrect" fill="#f87171" radius={[4, 4, 0, 0]} name="Incorrect" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
