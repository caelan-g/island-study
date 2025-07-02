import { sessionProps } from "@/components/types/session";

interface GroupedSession {
  date: string;
  sessions: sessionProps[];
}

export function SessionCountMetric({
  timeframe,
  groupedSessions,
}: {
  timeframe: "week" | "month";
  groupedSessions: GroupedSession[];
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
      <p className="text-xs text-muted-foreground">Sessions this {timeframe}</p>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold">{sessionCount}</p>
      </div>
    </div>
  );
}
