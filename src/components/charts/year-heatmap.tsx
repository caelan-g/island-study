"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GroupedSession } from "@/components/types/session";
import { courseProps } from "@/components/types/course";

interface YearHeatmapProps {
  data: GroupedSession[];
  type: "time" | "session" | "course";
  courseData?: courseProps[];
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
  colorScale: typeof defaultColorScale,
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
  type,
  courseData,
  colorScale = defaultColorScale,
  className,
}: YearHeatmapProps) {
  const { weeks, months, dataMap, courseMap, maxValue } = useMemo(() => {
    // Process data based on type
    const dataMap = new Map<string, number>();
    const courseMap = new Map<
      string,
      { courseId: string; courseName: string; courseColor: string }
    >();
    let maxVal = 0;

    data.forEach((day) => {
      // Parse date - handles both ISO format and US format
      let dateStr: string;
      if (day.date.includes("/")) {
        // US format: M/D/YYYY
        const [month, dayNum, year] = day.date.split("/");
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(dayNum),
        );
        dateStr = toISODateString(date);
      } else {
        // ISO format: YYYY-MM-DD
        dateStr = day.date;
      }

      if (type === "session") {
        // Count number of sessions
        const sessionCount = day.sessions.length;
        dataMap.set(dateStr, sessionCount);
        if (sessionCount > maxVal) maxVal = sessionCount;
      } else if (type === "time") {
        // Calculate total study time in seconds
        const totalTime = day.sessions.reduce((total, session) => {
          return (
            total +
            (new Date(session.end_time).getTime() -
              new Date(session.start_time).getTime()) /
              1000
          );
        }, 0);
        dataMap.set(dateStr, totalTime);
        if (totalTime > maxVal) maxVal = totalTime;
      } else if (type === "course") {
        // Find the course studied most on this day
        const courseTime: Record<string, number> = {};
        day.sessions.forEach((session) => {
          if (!session.course_id) return;
          const sessionTime =
            (new Date(session.end_time).getTime() -
              new Date(session.start_time).getTime()) /
            1000;
          courseTime[session.course_id] =
            (courseTime[session.course_id] || 0) + sessionTime;
        });

        // Find the course with most time
        let maxCourseId = "";
        let maxCourseTime = 0;
        Object.entries(courseTime).forEach(([courseId, time]) => {
          if (time > maxCourseTime) {
            maxCourseTime = time;
            maxCourseId = courseId;
          }
        });

        if (maxCourseId && courseData) {
          const course = courseData.find((c) => c.id === maxCourseId);
          if (course) {
            dataMap.set(dateStr, maxCourseTime);
            courseMap.set(dateStr, {
              courseId: maxCourseId,
              courseName: course.name,
              courseColor: course.colour,
            });
            if (maxCourseTime > maxVal) maxVal = maxCourseTime;
          }
        }
      }
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

    return { weeks, months, dataMap, courseMap, maxValue: maxVal || 1 };
  }, [data, type, courseData]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <TooltipProvider delayDuration={100}>
      <style>{`
        .year-heatmap {
          --cell-unit: 19px;
        }
        @media (max-width: 640px) {
          .year-heatmap {
            --cell-unit: 15px;
          }
        }
        @media (min-width: 1536px) {
          .year-heatmap {
            --cell-unit: 23px;
          }
        }
      `}</style>
      <div className={cn("w-fit year-heatmap", className)}>
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
                  width: `calc(var(--cell-unit) * ${width})`,
                  minWidth: `calc(var(--cell-unit) * ${width})`,
                }}
              >
                {width >= 2 ? month.label : ""}
              </div>
            );
          })}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col lg:gap-[3px] 2xl:gap-[7px] mr-1 text-xs text-muted-foreground">
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
                    return (
                      <div
                        key={`empty-${dayIdx}`}
                        className="w-3 lg:w-4 2xl:w-5 h-3 lg:h-4 2xl:h-5"
                      />
                    );
                  }

                  const dateStr = toISODateString(day);
                  const value = dataMap.get(dateStr);
                  const courseInfo = courseMap.get(dateStr);

                  // For course type, use course color; otherwise use color scale
                  const cellStyle =
                    type === "course" && courseInfo
                      ? { backgroundColor: courseInfo.courseColor }
                      : undefined;

                  const cellClassName =
                    type === "course" && courseInfo
                      ? "w-3 lg:w-4 2xl:w-5 h-3 lg:h-4 2xl:h-5 rounded-xs lg:rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-foreground/30"
                      : cn(
                          "w-3 lg:w-4 2xl:w-5 h-3 lg:h-4 2xl:h-5 rounded-xs lg:rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-foreground/30",
                          getColorClass(value, maxValue, colorScale),
                        );

                  // Format tooltip content based on type
                  let tooltipTitle = "No activity";
                  if (value !== undefined && value > 0) {
                    if (type === "session") {
                      tooltipTitle = `${value} session${value !== 1 ? "s" : ""}`;
                    } else if (type === "time") {
                      const hours = Math.floor(value / 3600);
                      const minutes = Math.floor((value % 3600) / 60);
                      tooltipTitle =
                        hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                    } else if (type === "course" && courseInfo) {
                      tooltipTitle = courseInfo.courseName;
                    }
                  }

                  return (
                    <Tooltip key={dateStr}>
                      <TooltipTrigger asChild>
                        <div className={cellClassName} style={cellStyle} />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-medium">{tooltipTitle}</p>
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
        {type !== "course" && (
          <div className="flex items-center justify-end gap-1 mt-6 text-xs text-muted-foreground">
            <span>Less</span>
            <div className={cn("w-4 h-4 rounded-sm", colorScale.empty)} />
            <div className={cn("w-4 h-4 rounded-sm", colorScale.low)} />
            <div className={cn("w-4 h-4 rounded-sm", colorScale.medium)} />
            <div className={cn("w-4 h-4 rounded-sm", colorScale.high)} />
            <div className={cn("w-4 h-4 rounded-sm", colorScale.max)} />
            <span>More</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
