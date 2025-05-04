"use client";
import { CreateCourseButton } from "@/components/create-course-button";
import { fetchCourses } from "@/hooks/courses/fetch-courses";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      const data = await fetchCourses();
      if (data) setCourses(data);
      setLoading(false);
    };
    loadCourses();
  }, []);

  return (
    <>
      <div>courses page</div>
      <CreateCourseButton />
      <div className="grid grid-cols-2 gap-2 my-2">
        {loading ? (
          <div className="animate-pulse bg-neutral-100 rounded-xl p-4">
            loading...
          </div>
        ) : (
          courses.map((course) => (
            <Card key={course.name}>
              <CardHeader className="flex flex-row text-xl font-bold gap-2">
                <div
                  className="size-8 rounded-sm"
                  style={{ backgroundColor: course.colour }}
                />
                <span>{course.name}</span>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
