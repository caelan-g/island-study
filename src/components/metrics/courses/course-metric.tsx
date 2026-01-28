import { timeFilter } from "@/lib/filters/time-filter";
import { courseProps } from "@/components/types/course";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseMetric({
  studyTime,
  timeframe,
  courses,
  loading,
}: {
  studyTime: number;
  timeframe: "week" | "month";
  courses: courseProps[];
  loading: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        Average Study Per Course ({timeframe})
      </p>
      {loading ? (
        <Skeleton className="h-6 w-18 mt-1 rounded-md" />
      ) : (
        <div className="flex flex-row justify-between items-center">
          <p className="text-xl font-bold">
            {timeFilter(studyTime / courses.length)}
          </p>
        </div>
      )}
    </div>
  );
}
