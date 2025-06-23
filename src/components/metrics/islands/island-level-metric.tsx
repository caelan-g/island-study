import { timeFilter } from "@/lib/filters/time-filter";
import { courseProps } from "@/components/types/course";

export function IslandLevelMetric({ level }: { level: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">Level Reached</p>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold">{level}</p>
      </div>
    </div>
  );
}
