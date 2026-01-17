import { ArrowDown, ArrowUp } from "lucide-react";
import { timeFilter } from "@/lib/filters/time-filter";
import { Skeleton } from "@/components/ui/skeleton";

export function TimeMetric({
  studyTime,
  goal,
  timeframe,
  loading,
}: {
  studyTime: number;
  goal: number;
  timeframe: "week" | "month";
  loading: boolean;
}) {
  const period = timeframe === "week" ? 7 : 30;

  return (
    <div>
      <p className="text-xs text-muted-foreground">
        Daily Average ({timeframe})
      </p>
      {loading ? (
        <Skeleton className="h-6 w-32 mt-1 rounded-md" />
      ) : (
        <div className="flex flex-row items-center">
          <p className="text-xl font-bold">{timeFilter(studyTime / period)}</p>
          {goal - studyTime / period > 0 ? (
            <p className="text-xs rounded-md bg-muted flex px-2 py-1 ml-2">
              <ArrowDown className="size-4 mr-1" />
              {timeFilter(goal - studyTime / period)} from goal
            </p>
          ) : goal ? (
            <p className="text-xs rounded-md bg-emerald-100 dark:bg-emerald-500 dark:text-background flex px-2 py-1 ml-2">
              <ArrowUp className="size-4 mr-1" />
              {timeFilter(studyTime / period - goal)}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
