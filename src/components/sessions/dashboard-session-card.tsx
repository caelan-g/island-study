import { useEffect, useState } from "react";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { timeFilter } from "@/lib/filters/time-filter";

export const DashboardSessionCard = ({
  session,
  courses,
}: {
  session: sessionProps;
  courses: courseProps[];
  onEdit?: (session: sessionProps) => void;
}) => {
  const [course, setCourse] = useState<courseProps | null>(null);

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === session.course_id);
    setCourse(foundCourse || null);
  }, [courses, session.course_id]);

  return (
    <div className="text-sm flex flex-row justify-between border-y-1 border-muted gap-2">
      <div>
        <div className="max-w-52 truncate">
          <span
            className="size-4 rounded-sm mr-2 inline-block"
            style={{ backgroundColor: course?.colour || "#000000" }}
          />
          {course?.name || "Unknown Course"}
        </div>
        <div className="text-muted-foreground">
          {session.end_time
            ? new Date(session.end_time).toLocaleDateString()
            : new Date(session.start_time).toLocaleDateString()}
        </div>
      </div>
      <div className="bg-emerald-100 rounded-md text-xs my-auto items-center px-2 py-1">
        {timeFilter(
          (new Date(session.end_time).getTime() -
            new Date(session.start_time).getTime()) /
            1000
        )}
      </div>
    </div>
  );
};
