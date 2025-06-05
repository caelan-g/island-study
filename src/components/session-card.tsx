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
import { useTimeFilter } from "@/hooks/time-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SessionCard = ({
  session,
  courses,
  onEdit,
}: {
  session: sessionProps;
  courses: courseProps[];
  onEdit: (session: sessionProps) => void;
}) => {
  const [course, setCourse] = useState<courseProps | null>(null);

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === session.course_id);
    setCourse(foundCourse || null);
  }, [courses, session.course_id]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <div>{course?.name || "Unknown Course"}</div>
          <div>
            {useTimeFilter(
              (new Date(session.end_time).getTime() -
                new Date(session.start_time).getTime()) /
                1000
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {session.end_time
            ? new Date(session.end_time).toLocaleDateString()
            : new Date(session.start_time).toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-row justify-between ">
        {session.end_time ? (
          <>
            <div>
              {session.description || "No description available"}
              <p className="text-sm text-gray-500">
                {new Date(session.start_time).toLocaleTimeString()} -{" "}
                {new Date(session.end_time).toLocaleTimeString()}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>...</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit(session)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div>Started {new Date(session.start_time).toLocaleTimeString()}</div>
        )}
      </CardContent>
    </Card>
  );
};
