"use client";

import { CartesianGrid, Line, LineChart as Chart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { timeFilter } from "@/lib/filters/time-filter";
import { GroupedSession } from "@/components/types/session";

interface LineChartProps {
  chartData: GroupedSession[];
}

const chartConfig = {
  studyTime: {
    label: "Study Time",
    color: "var(--chart-green)",
  },
} satisfies ChartConfig;

export function LineChart({ chartData }: LineChartProps) {
  // Transform grouped sessions into chart data format and sort by date
  const processedData = chartData
    .map((day) => {
      // Parse the date string (assuming day/month/year format)
      const [month_, day_, year_] = day.date.split("/");
      const dateObj = new Date(`${month_}/${day_}/${year_}`);

      return {
        date: dateObj.toLocaleDateString("en-US"),
        dateTimestamp: dateObj.getTime(), // Add timestamp for sorting
        studyTime: day.sessions.reduce((total, session) => {
          return (
            total +
            (new Date(session.end_time).getTime() -
              new Date(session.start_time).getTime()) /
              1000
          );
        }, 0),
      };
    })
    .sort((a, b) => a.dateTimestamp - b.dateTimestamp); // Sort by timestamp

  return (
    <ChartContainer config={chartConfig} className="max-h-44 w-full">
      <Chart
        accessibilityLayer
        // Remove the reverse() since we're already sorting
        data={processedData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex item-center gap-2">
                    <p className="">
                      {new Date(payload[0].payload.date).toLocaleDateString()}
                    </p>
                    <p className="font-medium">
                      {timeFilter(Number(payload[0].value))}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          dataKey="studyTime"
          type="monotone"
          stroke="var(--chart-green)"
          strokeWidth={2}
          dot={{
            r: 0,
            fill: "var(--chart-green)",
            stroke: "white",
            strokeWidth: 2,
          }}
        />
      </Chart>
    </ChartContainer>
  );
}
