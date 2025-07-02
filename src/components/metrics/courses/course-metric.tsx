import { timeFilter } from "@/lib/filters/time-filter";
import { courseProps } from "@/components/types/course";

export function CourseMetric({
  studyTime,
  timeframe,
  courses,
}: {
  studyTime: number;
  timeframe: "week" | "month";
  courses: courseProps[];
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        Average Study Per Course ({timeframe})
      </p>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold">
          {timeFilter(studyTime / courses.length)}
        </p>
      </div>
    </div>
  );
}
