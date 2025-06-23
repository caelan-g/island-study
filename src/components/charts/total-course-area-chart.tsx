"use client";

import {
  CartesianGrid,
  Area,
  AreaChart as Chart,
  XAxis,
  LabelList,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { timeFilter } from "@/lib/filters/time-filter";
import { courseProps } from "@/components/types/course";
import { GroupedSession } from "@/components/types/session";

interface TotalCourseAreaChartProps {
  chartData: GroupedSession[];
  courses: courseProps[];
  timeframe: "week" | "month" | "all";
}

const chartConfig = {
  studyTime: {
    label: "Study Time",
    color: "var(--chart-green)",
  },
} satisfies ChartConfig;

export function TotalCourseAreaChart({
  chartData = [],
  courses,
  timeframe,
}: TotalCourseAreaChartProps) {
  const period = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365;

  // Filter sessions within timeframe
  const filteredSessions = chartData
    .filter((day) => {
      const date = new Date(day.date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period);
      return date >= cutoffDate;
    })
    .flatMap((day) => day.sessions);

  // Calculate total study time per course
  const processedData = courses.map((course) => {
    const courseTotal = filteredSessions
      .filter((session) => session.course_id === course.id)
      .reduce((total, session) => {
        return (
          total +
          (new Date(session.end_time).getTime() -
            new Date(session.start_time).getTime()) /
            1000
        );
      }, 0);

    return {
      name: course.name,
      total: courseTotal,
      color: course.colour,
    };
  });

  // Sort by total time descending
  processedData.sort((a, b) => b.total - a.total);

  return (
    <ChartContainer config={chartConfig} className="w-full min-h-80">
      <Chart
        data={processedData}
        margin={{ left: 12, right: 12, top: 20, bottom: 60 }}
      >
        <CartesianGrid
          horizontal={false}
          vertical={false}
          stroke="var(--border)"
        />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          angle={-45}
          textAnchor="end"
          interval={0}
          className="text-[9px] right-2"
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-sm"
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="font-medium">{data.name}:</span>
                    <span>{timeFilter(data.total)}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="var(--chart-green)"
          strokeWidth={2}
          fill="var(--chart-green)"
          fillOpacity={0.4}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground font-bold"
            fontSize={12}
            formatter={(value: number) => timeFilter(value, "hours")}
            style={{
              backgroundColor: "var(--chart-green)",
              padding: "0 4px",
              borderRadius: "2px",
            }}
          />
        </Area>
      </Chart>
    </ChartContainer>
  );
}
