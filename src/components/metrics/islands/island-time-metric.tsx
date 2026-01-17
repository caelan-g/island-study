import { timeFilter } from "@/lib/filters/time-filter";

export function IslandTimeMetric({
  threshold,
  level,
  xp,
  loading,
}: {
  threshold: number;
  level: number;
  xp: number;
  loading: boolean;
}) {
  const total = threshold * (level - 1) + xp;
  return (
    <div>
      <p className="text-xs text-muted-foreground">Time Studied</p>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold">{timeFilter(total)}</p>
      </div>
    </div>
  );
}
