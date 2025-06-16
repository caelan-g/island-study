"use client";
import { CreateCourseDialog } from "@/components/create-course-dialog";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { useEffect, useState, useCallback } from "react";
import { CourseCard } from "@/components/ui/course-card";
import { courseProps } from "@/components/types/course";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function Courses() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);

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

  return (
    <>
      <div>courses page</div>
      <Button onClick={() => setOpenSessionDialog(true)}>
        Create Course
        <Plus strokeWidth={2.5} />
      </Button>
      <CreateCourseDialog
        open={openSessionDialog}
        onOpenChange={(open: boolean) => {
          setOpenSessionDialog(open);
        }}
        onSubmitSuccess={handleCourseSubmit}
      />
      <div className="grid grid-cols-2 gap-2 my-2">
        {loading ? (
          <div className="animate-pulse bg-neutral-100 rounded-xl p-4">
            loading...
          </div>
        ) : (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </>
  );
}
