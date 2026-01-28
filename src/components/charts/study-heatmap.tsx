"use client";

import { sessionProps } from "@/components/types/session";
import { GroupedSession } from "@/components/types/session";

interface StudyHeatmapProps {
  groupedSessions: GroupedSession[];
  goal: number;
  loading: boolean;
}

// Add type for week array
type WeekData = (Date | null)[];

export default function StudyHeatmap({
  groupedSessions,
  goal,
  loading,
}: StudyHeatmapProps) {
  // Calculate study hours for a given date
  const calculateStudyHours = (sessions: sessionProps[]): number => {
    return sessions.reduce((total, session) => {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  };

  // Generate last 30 days
  const generateLast30Days = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    return days;
  };

  // Get study hours for a specific date
  const getStudyHoursForDate = (date: Date): number => {
    // Format date to start of day in local timezone
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const dayData = groupedSessions.find((group) => {
      const groupDate = new Date(group.date);
      const localGroupDate = new Date(
        groupDate.getFullYear(),
        groupDate.getMonth(),
        groupDate.getDate()
      );
      return localGroupDate.getTime() === localDate.getTime();
    });

    return dayData ? calculateStudyHours(dayData.sessions) : 0;
  };

  // Get color intensity based on study hours
  const getColorIntensity = (hours: number): string => {
    const goalHours = goal / 3600;
    if (hours === 0) return "bg-gray-100 text-gray-400";
    if (hours < goalHours) return "bg-muted-foreground text-white";
    if (hours < goalHours * 1.2) return "bg-emerald-300 text-white";
    if (hours < goalHours * 1.5) return "bg-emerald-500 text-white";
    if (hours < goalHours * 2) return "bg-emerald-700 text-white";
    return "bg-emerald-800 text-white";
  };

  const last30Days = generateLast30Days();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Group days by week for proper grid layout
  const weekGroups: WeekData[] = [];
  let currentWeek: WeekData = [];

  last30Days.forEach((date, index) => {
    const dayOfWeek = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    // If this is the first day or we're starting a new week
    if (index === 0) {
      // Fill in empty days at the beginning of the first week
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    currentWeek.push(date);

    // If we've completed a week or this is the last day
    if (currentWeek.length === 7 || index === last30Days.length - 1) {
      // Fill in empty days at the end of the last week
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weekGroups.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <>
      {/* Day headers */}
      <div className="grid grid-cols-7">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weekGroups.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIndex) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className="w-10 h-10"
                  />
                );
              }

              const dayNumber = date.getDate();
              const hours = loading ? 0 : getStudyHoursForDate(date);
              const colorClass = loading
                ? "bg-gray-100 text-gray-400"
                : getColorIntensity(hours);

              return (
                <div
                  key={date.toISOString()}
                  className={`w-10 h-10 rounded-md flex flex-col items-center justify-center text-xs transition-all hover:scale-105 cursor-pointer ${colorClass}`}
                  title={
                    loading
                      ? date.toLocaleDateString()
                      : `${date.toLocaleDateString()}: ${hours.toFixed(
                          1
                        )}h studied`
                  }
                >
                  <div className="text-xs">{dayNumber}</div>
                  {!loading && (
                    <div className="text-sm font-bold">
                      {hours > 0 ? `${Math.round(hours)}h` : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
