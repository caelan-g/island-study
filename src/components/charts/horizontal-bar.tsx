"use client";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A mixed bar chart";

const chartData = [
  { browser: "Sunday", visitors: 275, fill: "var(--color-black)" },
  { browser: "Monday", visitors: 180, fill: "var(--color-black)" },
  { browser: "Tuesday", visitors: 214, fill: "var(--color-black)" },
  { browser: "Wednesday", visitors: 130, fill: "var(--color-black)" },
  { browser: "Thursday", visitors: 230, fill: "var(--color-black)" },
  { browser: "Friday", visitors: 150, fill: "var(--color-black)" },
];

const chartConfig = {
  visitors: {
    label: "Sunday",
  },
  chrome: {
    label: "Monday",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Tuesday",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Wednesday",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Thursday",
    color: "var(--chart-4)",
  },
  other: {
    label: "Friday",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function HorizontalBar() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 0,
        }}
      >
        <YAxis
          dataKey="browser"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            chartConfig[value as keyof typeof chartConfig]?.label
          }
        />
        <XAxis dataKey="visitors" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="visitors" layout="vertical" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
