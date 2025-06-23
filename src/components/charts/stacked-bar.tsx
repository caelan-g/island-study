"use client";

import type React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { timeFilter } from "@/lib/filters/time-filter";
import { GroupedSession } from "@/components/types/session";

const chartConfig = {
  under: {
    label: "Under Goal",
    color: "var(--muted)",
  },
  achieved: {
    label: "Achieved",
    color: "var(--chart-green)",
  },
  over: {
    label: "Over Goal",
    color: "var(--muted)",
  },
} satisfies ChartConfig;

export function StackedBarChart({
  groupedSessions,
  goal,
}: {
  groupedSessions: GroupedSession[];
  goal: number;
}) {
  const processedData = groupedSessions.map((day) => {
    const totalDuration = day.sessions.reduce(
      (acc, session) =>
        acc +
        (new Date(session.end_time).getTime() -
          new Date(session.start_time).getTime()) /
          1000,
      0
    );

    const date = new Date(day.date);

    return {
      date: date.getDate(),
      under: totalDuration < goal ? totalDuration : 0,
      achieved: totalDuration >= goal ? goal : 0,
      over: totalDuration > goal ? totalDuration - goal : 0,
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={processedData.reverse()}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={({ active, payload }) => {
            if (active && payload?.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">
                      Day {payload[0].payload.date}
                    </span>
                    <span className="font-medium">
                      {timeFilter(Number(payload[0].value) || 0)}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="under"
          stackId="a"
          fill="var(--muted-foreground)"
          radius={[4, 4, 4, 4]}
        />
        <Bar
          dataKey="achieved"
          stackId="a"
          fill="var(--chart-green)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="over"
          stackId="a"
          fill="var(--muted-foreground)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
