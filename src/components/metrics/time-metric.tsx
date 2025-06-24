import { ArrowDown, ArrowUp } from "lucide-react";
import { timeFilter } from "@/lib/filters/time-filter";

export function TimeMetric({
  studyTime,
  goal,
  timeframe,
}: {
  studyTime: number;
  goal: number;
  timeframe: "week" | "month";
}) {
  const period = timeframe === "week" ? 7 : 30;

  return (
    <div>
      <p className="text-xs text-muted-foreground">
        Daily Average ({timeframe})
      </p>
      <div className="flex flex-row items-center">
        <p className="text-xl font-bold">{timeFilter(studyTime / period)}</p>
        {goal - studyTime / period > 0 ? (
          <p className="text-xs rounded-md bg-muted flex px-2 py-1 ml-2">
            <ArrowDown className="size-4 mr-1" />
            {timeFilter(goal - studyTime / period)} from goal
          </p>
        ) : goal ? (
          <p className="text-xs rounded-md bg-emerald-100 flex px-2 py-1 ml-2">
            <ArrowUp className="size-4 mr-1" />
            {timeFilter(studyTime / period - goal)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
