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
import { toast } from "sonner";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { sessionProps } from "@/components/types/session";
import { GroupedSession } from "@/components/types/session";
import { processSessionData } from "@/lib/metrics/process-session-data";
import { TimeMetrics } from "@/components/types/session";
import { DayCourseAreaChart } from "@/components/charts/day-course-area-chart";
import { CourseMetric } from "@/components/metrics/course-metric";
import { CourseTopMetric } from "@/components/metrics/course-top-metric";
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";

export default function Courses() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<courseProps | null>(
    null
  );
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [sessions, setSessions] = useState<sessionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [groupedSessions, setGroupedSessions] = useState<GroupedSession[]>([]);
  const [studyTime, setTotal] = useState<TimeMetrics>({
    today: 0,
    week: 0,
    month: 0,
  });

  useEffect(() => {
    if (sessions.length > 0) {
      const [timeMetrics, groupedArray] = processSessionData(sessions) || [
        { today: 0, week: 0, month: 0 },
        [],
        [],
      ];

      setTotal(timeMetrics as TimeMetrics);
      setGroupedSessions((groupedArray as GroupedSession[]).reverse());
    }
  }, [sessions]);

  const initializeData = useCallback(async () => {
    setLoading(true);
    const courseData = await fetchCourses(authUser);
    const sessionData = await fetchSessions(authUser);

    if (courseData) setCourses(courseData);
    if (sessionData) setSessions(sessionData);
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
      toast.error("Failed to refresh courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: courseProps) => {
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  const handleDeleteCourse = async () => {
    setLoading(true);
    try {
      await initializeData(); // Refresh data after deletion
      setSelectedCourse(null); // Reset selected course
    } catch (error) {
      console.error("Error refreshing data after deletion:", error);
      toast.error("Failed to refresh courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="font-semibold tracking-tight text-2xl">My Courses</h2>
        <Button
          onClick={() => {
            setOpenCourseDialog(true);
            setSelectedCourse(null);
          }}
          className="relative bottom-1"
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
      </div>
      <div className="flex flex-row gap-4 ">
        <div className="flex flex-col w-1/2 gap-4">
          {loading ? (
            <>
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </>
          ) : (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                user={authUser}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            ))
          )}
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Course Allocated Study Time</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <DayCourseAreaChart chartData={groupedSessions} courses={courses} />
            <div className="flex flex-col gap-2">
              <CourseTopMetric
                timeframe="month"
                courses={courses}
                groupedSessions={groupedSessions}
              />
              <CourseMetric
                studyTime={studyTime["month"]}
                timeframe="month"
                courses={courses}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
