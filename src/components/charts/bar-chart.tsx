"use client";

import { Bar, BarChart as Chart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { timeFilter } from "@/lib/filters/time-filter";
import { GroupedSession } from "@/components/types/session";

export const description = "A bar chart";

interface BarChartProps {
  chartData: GroupedSession[];
}

const chartConfig = {
  studyTime: {
    label: "Study Time",
    color: "var(--chart-green)",
  },
} satisfies ChartConfig;

export function BarChart({ chartData }: BarChartProps) {
  const processedData = (() => {
    // Get the current date
    const now = new Date();

    // Create an array for the last 12 months
    const monthlyData: Record<string, number> = {};

    // Initialize all 12 months with 0
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[monthKey] = 0;
    }

    // Add up study time for each month
    chartData.forEach((day) => {
      // Parse the date string (format: M/D/YYYY from toLocaleDateString("en-US"))
      const [month_, day_, year_] = day.date.split("/");
      const dateObj = new Date(
        parseInt(year_),
        parseInt(month_) - 1,
        parseInt(day_),
      );

      // Check if date is within the last 12 months and not in the future
      const twelveMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 12,
        now.getDate(),
      );
      if (dateObj < twelveMonthsAgo || dateObj > now) {
        return;
      }

      // Create a key for the month (YYYY-MM format)
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;

      // Calculate study time for the day
      const dayStudyTime = day.sessions.reduce((total, session) => {
        return (
          total +
          (new Date(session.end_time).getTime() -
            new Date(session.start_time).getTime()) /
            1000
        );
      }, 0);

      // Add to monthly total
      if (monthKey in monthlyData) {
        monthlyData[monthKey] += dayStudyTime;
      }
    });

    // Convert to array and format for display
    return Object.entries(monthlyData)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([monthKey, studyTime]) => {
        const [year, month] = monthKey.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          studyTime,
        };
      });
  })();

  return (
    <ChartContainer config={chartConfig}>
      <Chart accessibilityLayer data={processedData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload?.[0]) {
              return (
                <div className="rounded-md bg-white/80 p-2 shadow-sm backdrop-blur-sm dark:bg-black/80">
                  <p className="text-sm text-muted-foreground">
                    {payload[0].payload.date}
                  </p>
                  <p className="text-lg font-bold">
                    {timeFilter(Number(payload[0].value))}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="studyTime"
          fill="var(--chart-green)"
          radius={[4, 4, 0, 0]} // Rounded top corners
        />
      </Chart>
    </ChartContainer>
  );
}
