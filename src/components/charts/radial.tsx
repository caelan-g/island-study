"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { timeFilter } from "@/lib/filters/time-filter";

const chartConfig = {
  today: {
    label: "Study Time",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface chartData {
  today: number;
  goal: number;
  fill: string;
}

export function RadialChart({ chartData }: { chartData: chartData[] }) {
  let max = chartData[0].today;
  if (chartData[0].today > chartData[0].goal) {
    max = chartData[0].goal;
  }

  return (
    <div className="flex-1 flex-col">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[200px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={90 - (max / chartData[0].goal) * 360}
          innerRadius={89}
          outerRadius={114}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[94, 84]}
          />
          <RadialBar dataKey="today" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const percentage = Math.round(
                    (chartData[0].today / chartData[0].goal) * 100
                  );
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {timeFilter(chartData[0].today)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 30}
                        className="fill-muted-foreground text-sm"
                      >
                        {percentage}% of goal
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}
