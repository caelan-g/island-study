"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { timeFilter } from "@/lib/filters/time-filter";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Study Time",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface chartData {
  total: number;
  goal: number;
  fill: string;
}

export function MiniRadialChart({ chartData }: { chartData: chartData[] }) {
  let max = chartData[0].total;
  if (chartData[0].total > chartData[0].goal) {
    max = chartData[0].goal;
  }

  return (
    <div className="flex-1 flex-col w-14">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={90 - (max / chartData[0].goal) * 360}
          innerRadius={20}
          outerRadius={32}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-background last:fill-muted"
            polarRadius={[12, 22]}
          />
          <RadialBar dataKey="total" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold"
                    >
                      {timeFilter(chartData[0].total, "hours")}
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
