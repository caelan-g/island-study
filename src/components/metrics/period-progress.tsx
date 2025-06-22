import { timeFilter } from "@/lib/filters/time-filter";
import { Progress } from "@/components/ui/progress";

export function PeriodProgress({
  studyTime,
  goal,
  timeframe,
}: {
  studyTime: number;
  goal: number;
  timeframe: "day" | "week" | "month";
}) {
  const period = timeframe === "day" ? 1 : timeframe === "week" ? 7 : 30;
  return (
    <div className="flex flex-row gap-1">
      <div className="flex flex-col">
        <h1 className="text-md text-muted-foreground text-center">
          {timeframe === "day"
            ? "Today"
            : timeframe === "week"
            ? "Week"
            : "Month"}
        </h1>
        <p className="text-xl font-bold text-center">{timeFilter(studyTime)}</p>

        <Progress
          className={`bg-muted min-w-24 w-full ${
            studyTime >= goal * period
              ? "[&>div]:bg-[var(--chart-green)]"
              : "[&>div]:bg-muted-foreground"
          }`}
          value={goal ? Math.min((studyTime / (goal * period)) * 100, 100) : 0}
        />
      </div>
      <div className="text-xs text-muted-foreground flex items-end relative top-1">
        {timeFilter(goal * period, "hours")}
      </div>
    </div>
  );
}
