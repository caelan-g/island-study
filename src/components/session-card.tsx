import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { useFetchCourses } from "@/hooks/courses/fetch-courses";
import { useTimeFilter } from "@/hooks/time-filter";

export const SessionCard = ({ session }: { session: sessionProps }) => {
  const [course, setCourse] = useState<courseProps | null>(null);

  useFetchCourses().then((data) => {
    if (data) {
      const foundCourse = data.find((c) => c.id === session.course_id);
      setCourse(foundCourse || null);
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <div>{course.name || "Unknown Course"}</div>
          <div>
            {useTimeFilter(
              (new Date(session.end_time).getTime() -
                new Date(session.start_time).getTime()) /
                1000
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {new Date(session.end_time).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {session.description || "No description available"}
        <p className="text-sm text-gray-500">
          {new Date(session.start_time).toLocaleTimeString()} -{" "}
          {new Date(session.end_time).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};
