import { sessionProps } from "@/components/types/session";
import { Skeleton } from "@/components/ui/skeleton";
import { timeFilter } from "@/lib/filters/time-filter";

interface GroupedSession {
  date: string;
  sessions: sessionProps[];
}

export function SessionMetric({
  studyTime,
  timeframe,
  groupedSessions,
  loading,
}: {
  studyTime: number;
  timeframe: "week" | "month";
  groupedSessions: GroupedSession[];
  loading: boolean;
}) {
  const period = timeframe === "week" ? 7 : 30;

  // Filter sessions within the timeframe
  const filteredSessions = groupedSessions
    .filter((day) => {
      const date = new Date(day.date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period);
      return date >= cutoffDate;
    })
    .flatMap((day) => day.sessions);

  const sessionCount = filteredSessions.length || 1; // Prevent division by zero

  return (
    <div>
      <p className="text-xs text-muted-foreground">
        Session Average ({timeframe})
      </p>
      {loading ? (
        <Skeleton className="h-6 w-12 mt-1 rounded-md" />
      ) : (
        <div className="flex flex-row justify-between items-center">
          <p className="text-xl font-bold">
            {timeFilter(studyTime / sessionCount)}
          </p>
        </div>
      )}
    </div>
  );
}
