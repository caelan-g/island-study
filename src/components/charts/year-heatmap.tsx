"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HeatmapDataPoint {
  date: string; // ISO date string "YYYY-MM-DD"
  value: number;
}

interface YearHeatmapProps {
  data: HeatmapDataPoint[];
  colorScale?: {
    empty: string;
    low: string;
    medium: string;
    high: string;
    max: string;
  };
  className?: string;
}

const defaultColorScale = {
  empty: "bg-muted",
  low: "bg-emerald-200 dark:bg-emerald-900",
  medium: "bg-emerald-400 dark:bg-emerald-700",
  high: "bg-emerald-500 dark:bg-emerald-500",
  max: "bg-emerald-600 dark:bg-emerald-400",
};

function getColorClass(
  value: number | undefined,
  maxValue: number,
  colorScale: typeof defaultColorScale
): string {
  if (value === undefined || value === 0) return colorScale.empty;
  const percentage = value / maxValue;
  if (percentage <= 0.25) return colorScale.low;
  if (percentage <= 0.5) return colorScale.medium;
  if (percentage <= 0.75) return colorScale.high;
  return colorScale.max;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function YearHeatmap({
  data,
  colorScale = defaultColorScale,
  className,
}: YearHeatmapProps) {
  const { weeks, months, dataMap, maxValue } = useMemo(() => {
    // Create a map of date -> value for quick lookup
    const dataMap = new Map<string, number>();
    let maxVal = 0;
    data.forEach((d) => {
      dataMap.set(d.date, d.value);
      if (d.value > maxVal) maxVal = d.value;
    });

    // Generate last 365 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Date[] = [];
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    // Group days into weeks (columns)
    // Each week starts on Sunday (0)
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Pad the first week if it doesn't start on Sunday
    const firstDay = days[0];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null as unknown as Date); // placeholder for empty cells
    }

    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    // Push the last week
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // Calculate month labels and their positions
    const months: { label: string; startWeek: number }[] = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      // Find the first valid day in this week
      const validDay = week.find((d) => d !== null);
      if (validDay) {
        const month = validDay.getMonth();
        if (month !== currentMonth) {
          currentMonth = month;
          months.push({
            label: validDay.toLocaleDateString("en-US", { month: "short" }),
            startWeek: weekIndex,
          });
        }
      }
    });

    return { weeks, months, dataMap, maxValue: maxVal || 1 };
  }, [data]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn("inline-block", className)}>
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {months.map((month, idx) => {
            const nextMonth = months[idx + 1];
            const width = nextMonth
              ? nextMonth.startWeek - month.startWeek
              : weeks.length - month.startWeek;

            return (
              <div
                key={`${month.label}-${idx}`}
                className="text-xs text-muted-foreground"
                style={{
                  width: `${width * 19}px`,
                  minWidth: `${width * 19}px`,
                }}
              >
                {width >= 2 ? month.label : ""}
              </div>
            );
          })}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1 text-xs text-muted-foreground">
            {dayLabels.map((day, idx) => (
              <div
                key={day}
                className="h-4 flex items-center justify-end pr-1"
                style={{ fontSize: "9px" }}
              >
                {idx % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {week.map((day, dayIdx) => {
                  if (!day) {
                    return <div key={`empty-${dayIdx}`} className="w-4 h-4" />;
                  }

                  const dateStr = toISODateString(day);
                  const value = dataMap.get(dateStr);

                  return (
                    <Tooltip key={dateStr}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-4 h-4 rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-foreground/30",
                            getColorClass(value, maxValue, colorScale)
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-medium">
                          {value !== undefined
                            ? `${value} contributions`
                            : "No contributions"}
                        </p>
                        <p className="text-muted-foreground">
                          {formatDate(day)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className={cn("w-4 h-4 rounded-sm", colorScale.empty)} />
          <div className={cn("w-4 h-4 rounded-sm", colorScale.low)} />
          <div className={cn("w-4 h-4 rounded-sm", colorScale.medium)} />
          <div className={cn("w-4 h-4 rounded-sm", colorScale.high)} />
          <div className={cn("w-4 h-4 rounded-sm", colorScale.max)} />
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
