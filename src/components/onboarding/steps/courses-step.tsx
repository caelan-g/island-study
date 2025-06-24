"use client";
import { CourseForm } from "@/components/courses/course-form";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { CoursePreview } from "@/components/courses/course-preview";
import { useEffect, useState } from "react";
import { courseProps } from "@/components/types/course";
import { FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { StepProps } from "@/components/types/onboarding";
import { useAuth } from "@/contexts/auth-context";

export default function CoursesStep({ form }: StepProps) {
  const [courses, setCourses] = useState<courseProps[]>([]);
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (courses.length > 0) {
      form.setValue("hasCourse", true);
    }
  }, [refreshTrigger, courses, form]);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses(authUser);
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
      <h2 className="text-xl font-semibold tracking-tight">Add your courses</h2>

      <div className="space-y-2">
        <CourseForm onSuccess={handleCourseCreated} parentForm={true} />
        <FormMessage>
          {courses.length === 0 && "Please create at least one course"}
        </FormMessage>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {courses.map((course) => (
            <CoursePreview key={course.id} course={course} user={authUser} />
          ))}
        </div>
      )}
    </div>
  );
}
