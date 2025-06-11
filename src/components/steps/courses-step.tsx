"use client";
import { CourseForm } from "@/components/course-form";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { CourseCard } from "@/components/ui/course-card";
import { useEffect, useState } from "react";
import { courseProps } from "@/components/types/course";
import { FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { StepProps } from "@/components/types/onboarding";

export default function CoursesStep({ form }: StepProps) {
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (courses.length > 0) {
      form.setValue("hasCourse", true);
    }
  }, [refreshTrigger, courses, form]);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses();
    if (data) setCourses(data);
    setLoading(false);
  };

  const handleCourseCreated = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment trigger to cause refresh
  };

  useEffect(() => {
    loadCourses();
  }, [refreshTrigger]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Course Setup</h2>
      <p className="text-sm text-muted-foreground">
        Create some courses to study for.
      </p>

      <div className="space-y-2">
        <CourseForm onSuccess={handleCourseCreated} parentForm={true} />
        <FormMessage>
          {courses.length === 0 && "Please create at least one course"}
        </FormMessage>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
