import { timeFilter } from "@/lib/filters/time-filter";
import { courseProps } from "@/components/types/course";
import { sessionProps } from "@/components/types/session";
import { ArrowUp } from "lucide-react";

interface GroupedSession {
  date: string;
  sessions: sessionProps[];
}

export function CourseTopMetric({
  timeframe,
  courses,
  groupedSessions,
}: {
  timeframe: "week" | "month";
  courses: courseProps[];
  groupedSessions: GroupedSession[];
}) {
  const period = timeframe === "week" ? 7 : 30;

  // Filter sessions within timeframe
  const filteredSessions = groupedSessions
    .filter((day) => {
      const date = new Date(day.date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period);
      return date >= cutoffDate;
    })
    .flatMap((day) => day.sessions);

  // Calculate study time per course
  const courseStudyTime = courses.reduce((acc, course) => {
    const courseTotal = filteredSessions
      .filter((session) => session.course_id === course.id)
      .reduce(
        (total, session) =>
          total +
          (new Date(session.end_time).getTime() -
            new Date(session.start_time).getTime()) /
            1000,
        0
      );

    return [...acc, { course, total: courseTotal }];
  }, [] as { course: courseProps; total: number }[]);

  // Find course with most study time
  const topCourse = courseStudyTime.reduce(
    (max, current) => (current.total > max.total ? current : max),
    courseStudyTime[0]
  );

  return (
    <div className="w-full">
      <p className="text-xs text-muted-foreground">
        Top Studied Course ({timeframe})
      </p>
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className="size-4 rounded-sm"
            style={{ backgroundColor: topCourse?.course.colour }}
          />
          <p className="text-xl font-bold truncate">
            {topCourse ? topCourse.course.name : "No data"}
          </p>
        </div>
        <p className="text-xs rounded-md bg-emerald-100 dark:bg-emerald-500 dark:text-background flex px-2 py-1 ml-2">
          <ArrowUp className="size-4 mr-1" />
          {timeFilter(topCourse?.total || 0)}
        </p>
      </div>
    </div>
  );
}
