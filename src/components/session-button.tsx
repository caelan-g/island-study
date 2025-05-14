import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { checkSession } from "@/hooks/sessions/check-session";
import { startSession } from "@/hooks/sessions/start-session";
import { endSession } from "@/hooks/sessions/end-session";
import { fetchCourses } from "@/hooks/courses/fetch-courses";
import { Spinner } from "@/components/ui/spinner";

export function SessionButton() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [active, courseData] = await Promise.all([
          checkSession(),
          fetchCourses(),
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
        <Button className="peer cursor-pointer">Start</Button>
        <div className="bg-background rounded-md p-2 border transition-all flex flex-col gap-2 z-50 opacity-0 pointer-events-none peer-hover:opacity-100 hover:pointer-events-auto hover:opacity-100 peer-hover:pointer-events-auto absolute">
          {courses.map((course) => (
            <Button
              key={course.id}
              style={{ backgroundColor: course.colour }}
              onClick={async () => {
                setActiveSession(true);
                await startSession(course.id);
              }}
            >
              {course.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Button
      onClick={async () => {
        setActiveSession(false);
        await endSession();
      }}
    >
      End Session
    </Button>
  );
}
