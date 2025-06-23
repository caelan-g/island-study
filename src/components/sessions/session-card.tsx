import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { timeFilter } from "@/lib/filters/time-filter";
import { User } from "@supabase/supabase-js";

export const SessionCard = ({
  session,
  courses,
  user,
  onClick, // Add onClick to props
  isSelected, // Add isSelected prop
}: {
  session: sessionProps;
  courses: courseProps[];
  user: User | null;
  onClick?: (session: sessionProps) => void; // Add onClick type
  isSelected?: boolean; // Add type for isSelected
}) => {
  const [course, setCourse] = useState<courseProps | null>(null);

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === session.course_id);
    setCourse(foundCourse || null);
  }, [courses, session.course_id]);

  return (
    <Card
      className={`w-full  transition-all ${
        isSelected ? "outline-2 outline-[var(--chart-green)]" : ""
      } ${
        session.end_time ? "cursor-pointer hover:bg-muted/70" : "cursor-default"
      }`}
      onClick={session.end_time ? () => onClick?.(session) : undefined}
    >
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <div className="truncate">{course?.name || "Unknown Course"}</div>
          <div>
            {session.end_time ? (
              timeFilter(
                (new Date(session.end_time).getTime() -
                  new Date(session.start_time).getTime()) /
                  1000
              )
            ) : (
              <p className="text-sm rounded-md bg-emerald-100 flex px-2 py-1 ml-2">
                Active
              </p>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {session.end_time
            ? new Date(session.end_time).toLocaleDateString()
            : new Date(session.start_time).toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-row justify-between">
        {session.end_time ? (
          <>
            <div className="truncate">
              {session.description}
              <p className="text-sm text-muted-foreground">
                {new Date(session.start_time).toLocaleTimeString()} -{" "}
                {new Date(session.end_time).toLocaleTimeString()}
              </p>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground text-sm">
            Started {new Date(session.start_time).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
