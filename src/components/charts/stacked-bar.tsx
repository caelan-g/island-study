"use client";

import type React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 224, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 24, mobile: 140 },
  { month: "April", desktop: 73, mobile: 1 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#232323",
  },
  mobile: {
    label: "Mobile",
    color: "#646464",
  },
} satisfies ChartConfig;

export function StackedBarChart() {
  return (
    <div
      style={
        {
          "--color-desktop": "hsl(var(--chart-1))",
          "--color-mobile": "hsl(var(--chart-2))",
        } as React.CSSProperties
      }
    >
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            wrapperStyle={{ outline: "none" }}
            isAnimationActive={true}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="desktop"
            stackId="a"
            fill="var(--color-desktop)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="mobile"
            stackId="a"
            fill="var(--color-mobile)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
