import { Skeleton } from "@/components/ui/skeleton";
export function IslandLevelMetric({
  level,
  loading,
}: {
  level: number;
  loading: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">Level Reached</p>
      {loading ? (
        <Skeleton className="h-6 w-2 mt-1 rounded-md" />
      ) : (
        <div className="flex flex-row justify-between items-center">
          <p className="text-xl font-bold">{level}</p>
        </div>
      )}
    </div>
  );
}
