import { MiniRadialChart } from "@/components/charts/mini-radial";
import { sessionProps } from "@/components/types/session";
import { Skeleton } from "@/components/ui/skeleton";

export const SessionDayCardSkeleton = () => {
  return (
    <div className="text-sm flex flex-col">
      <Skeleton className="h-4 w-8 mb-2 rounded-md mx-auto" />
      <MiniRadialChart
        chartData={[
          {
            total: 0,
            goal: 1, // Convert hours to seconds
            fill: "var(--chart-green)",
          },
        ]}
      />
    </div>
  );
};
