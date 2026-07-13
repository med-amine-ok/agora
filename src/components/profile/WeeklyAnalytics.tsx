"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Lun", time: 45, cards: 20 },
  { day: "Mar", time: 30, cards: 15 },
  { day: "Mer", time: 60, cards: 40 },
  { day: "Jeu", time: 90, cards: 55 },
  { day: "Ven", time: 20, cards: 10 },
  { day: "Sam", time: 50, cards: 30 },
  { day: "Dim", time: 80, cards: 45 },
];

export default function WeeklyAnalytics() {
  return (
    <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-text-dark">Temps d'Étude Hebdomadaire</h3>
        <p className="text-xs text-text-light">Minutes passées par jour cette semaine</p>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--text-light)", fontWeight: "bold" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--text-light)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--white)",
                borderColor: "rgba(14, 124, 123, 0.15)",
                borderRadius: "12px",
                fontSize: "11px",
                color: "var(--text-dark)",
              }}
            />
            <Area
              type="monotone"
              dataKey="time"
              stroke="var(--teal)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTime)"
              name="Minutes"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
