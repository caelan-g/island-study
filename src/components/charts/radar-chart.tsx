"use client";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as Chart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { timeFilter } from "@/lib/filters/time-filter";
import { GroupedSession } from "@/components/types/session";

interface RadarChartProps {
  groupedSessions: GroupedSession[];
  goal: number;
}

const chartConfig = {
  average: {
    label: "Daily Average",
    color: "var(--chart-green)",
  },
} satisfies ChartConfig;

export function RadarChart({ groupedSessions, goal }: RadarChartProps) {
  // Process data to get weekday averages
  const weekdayData = groupedSessions.reduce((acc, day) => {
    const date = new Date(day.date);
    const weekday = date.getDay();

    const dayTotal = day.sessions.reduce((total, session) => {
      return (
        total +
        (new Date(session.end_time).getTime() -
          new Date(session.start_time).getTime()) /
          1000
      );
    }, 0);

    if (!acc[weekday]) {
      acc[weekday] = { total: 0, count: 0 };
    }

    acc[weekday].total += dayTotal;
    acc[weekday].count += 1;

    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  // Convert to chart data format
  const chartData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (day, index) => {
      const data = weekdayData[index] || { total: 0, count: 1 };
      return {
        day,
        average: data.total / data.count,
        goal,
      };
    }
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[500px]"
    >
      <Chart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload?.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {payload[0].payload.day}
                      </span>
                      <span>{timeFilter(payload[0].payload.average)}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <PolarAngleAxis
          dataKey="day"
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <PolarGrid radialLines={false} />
        <Radar
          dataKey="average"
          fill="var(--muted-foreground)"
          fillOpacity={0.4}
          stroke="var(--muted-foreground)"
          strokeWidth={2}
        />
        <Radar
          dataKey="goal"
          fill="transparent"
          stroke="var(--chart-green)"
          strokeWidth={2}
        />
      </Chart>
    </ChartContainer>
  );
}
