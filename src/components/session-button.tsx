import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCheckSession } from "@/hooks/sessions/check-session";
import { useStartSession } from "@/hooks/sessions/start-session";
import { useFetchCourses } from "@/hooks/courses/fetch-courses";
import { Spinner } from "@/components/ui/spinner";
import { SessionDialog } from "@/components/session-dialog";

export function SessionButton() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<boolean | null>(null);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [active, courseData] = await Promise.all([
          useCheckSession(),
          useFetchCourses(),
        ]);

        setActiveSession(active);
        if (courseData) setCourses(courseData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  if (loading || activeSession === null) {
    return (
      <Button variant={"loading"}>
        <Spinner />
      </Button>
    );
  }

  return !activeSession ? (
    <div className="flex flex-col gap-2">
      <div>
        <Button className="peer cursor-pointer">Start Session</Button>
        <div className="bg-background rounded-md p-2 border transition-all flex flex-col gap-2 z-50 opacity-0 pointer-events-none peer-hover:opacity-100 hover:pointer-events-auto hover:opacity-100 peer-hover:pointer-events-auto absolute">
          {courses.map((course) => (
            <Button
              key={course.id}
              style={{ backgroundColor: course.colour }}
              onClick={async () => {
                setActiveSession(true);
                await useStartSession(course.id);
              }}
            >
              {course.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <>
      <Button
        onClick={() => {
          setOpenSessionDialog(true);
        }}
      >
        End Session
      </Button>
      <SessionDialog
        open={openSessionDialog}
        onOpenChange={(open: boolean) => setOpenSessionDialog(open)}
        courses={courses}
      />
    </>
  );
}
