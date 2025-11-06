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
  const processedData = chartData.map((day) => {
    // Parse the date string (assuming day/month/year format)
    const [day_, month_, year_] = day.date.split("/");
    const dateObj = new Date(`${month_}/${day_}/${year_}`);

    return {
      date: dateObj.toLocaleDateString("en-US"), // This will format as month/day/year
      studyTime: day.sessions.reduce((total, session) => {
        return (
          total +
          (new Date(session.end_time).getTime() -
            new Date(session.start_time).getTime()) /
            1000
        );
      }, 0),
    };
  });
  //console.log("Processed Data:", processedData);

  return (
    <ChartContainer config={chartConfig}>
      <Chart accessibilityLayer data={processedData.reverse()}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload?.[0]) {
              return (
                <div className="rounded-md bg-white/80 p-2 shadow-sm backdrop-blur-sm dark:bg-black/80">
                  <p className="text-sm text-muted-foreground">
                    {new Date(payload[0].payload.date).toLocaleDateString()}
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
          fill="#646464"
          radius={[4, 4, 0, 0]} // Rounded top corners
        />
      </Chart>
    </ChartContainer>
  );
}
