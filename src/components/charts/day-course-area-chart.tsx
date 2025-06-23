"use client";

import { CartesianGrid, Area, AreaChart as Chart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { timeFilter } from "@/lib/filters/time-filter";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";

interface GroupedSession {
  date: string;
  sessions: sessionProps[];
}

interface DayCourseAreaChartProps {
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

export function DayCourseAreaChart({
  chartData,
  courses,
  timeframe,
}: DayCourseAreaChartProps) {
  // Transform grouped sessions into chart data format with course-specific times
  const processedData = chartData.map((day) => {
    const dateObj = new Date(day.date);

    // Create an object with base date
    const dayData: { [key: string]: any } = {
      date: dateObj.toLocaleDateString("en-US"),
    };

    // Calculate study time for each course
    courses.forEach((course) => {
      const courseTime = day.sessions
        .filter((session) => session.course_id === course.id)
        .reduce((total, session) => {
          return (
            total +
            (new Date(session.end_time).getTime() -
              new Date(session.start_time).getTime()) /
              1000
          );
        }, 0);

      dayData[course.id] = courseTime;
    });

    return dayData;
  });

  return (
    <ChartContainer config={chartConfig}>
      <Chart
        data={processedData}
        margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
        stackOffset="none"
      >
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.getDate().toString();
          }}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid gap-2">
                    {payload.map((entry: any, index: number) => (
                      <div
                        key={`item-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="size-3 rounded-sm"
                          style={{
                            backgroundColor: courses.find(
                              (c) => c.id === entry.dataKey
                            )?.colour,
                          }}
                        />
                        <span className="font-medium">
                          {courses.find((c) => c.id === entry.dataKey)?.name}:
                        </span>
                        <span>{timeFilter(entry.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        {courses.map((course) => (
          <Area
            key={course.id}
            dataKey={course.id}
            stackId="stack"
            stroke={course.colour}
            fill={course.colour}
            fillOpacity={0.4}
            type="monotone"
          />
        ))}
      </Chart>
    </ChartContainer>
  );
}
