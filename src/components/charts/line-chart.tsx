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
  // Transform grouped sessions into chart data format
  const processedData = chartData.map((day) => {
    // Parse the date string (assuming day/month/year format)
    const [month_, day_, year_] = day.date.split("/");
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

  return (
    <ChartContainer config={chartConfig} className="max-h-48 w-full">
      <Chart
        accessibilityLayer
        data={processedData.reverse()}
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
                <div className="rounded-md bg-white/80 p-2 shadow-sm backdrop-blur-sm dark:bg-black/80">
                  <p className="text-sm text-muted-foreground ">
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
