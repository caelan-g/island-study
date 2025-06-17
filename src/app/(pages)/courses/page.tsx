"use client";
import { CourseDialog } from "@/components/courses/course-dialog";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { useEffect, useState, useCallback } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { courseProps } from "@/components/types/course";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Spinner } from "@/components/ui/spinner";

export default function Courses() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<courseProps | null>(
    null
  );
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);

  const initializeData = useCallback(async () => {
    setLoading(true);
    const data = await fetchCourses(authUser);
    if (data) setCourses(data);
    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    if (!authLoading && authUser) {
      initializeData();
    }
  }, [authLoading, authUser, initializeData]);

  const handleCourseSubmit = async () => {
    setLoading(true);
    try {
      await initializeData(); // Reuse existing loadDatabases function
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: courseProps) => {
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpenCourseDialog(true);
          setSelectedCourse(null);
        }}
      >
        Create Course
        <Plus strokeWidth={2.5} />
      </Button>
      <CourseDialog
        open={openCourseDialog}
        onOpenChange={(open: boolean) => {
          setOpenCourseDialog(open);
        }}
        onSubmitSuccess={handleCourseSubmit}
        course={selectedCourse}
      />
      <div className="flex flex-col w-1/2 gap-2 my-2">
        {loading ? (
          <div className="w-full mx-auto text-center">
            <Spinner />
          </div>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
            />
          ))
        )}
      </div>
    </>
  );
}
