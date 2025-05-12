import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { checkSession } from "@/hooks/sessions/check-session";
import { startSession } from "@/hooks/sessions/start-session";
import { endSession } from "@/hooks/sessions/end-session";
import { fetchCourses } from "@/hooks/courses/fetch-courses";

export function SessionButton() {
  useEffect(() => {
    const fetchActiveSession = async () => {
      const active = await checkSession();
      setActiveSession(active);
    };

    fetchActiveSession();
  }, []);

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

  const [activeSession, setActiveSession] = useState(true);

  return !activeSession ? (
    <div className="flex flex-col gap-2">
      {loading ? (
        <div className="animate-pulse bg-neutral-100 rounded-xl p-4">
          loading...
        </div>
      ) : (
        <div>
          <Button className="peer cursor-pointer">Start</Button>
          <div className="bg-background rounded-md p-2 border transition-all flex flex-col gap-2 z-50 opacity-0 pointer-events-none peer-hover:opacity-100 hover:pointer-events-auto hover:opacity-100 peer-hover:pointer-events-auto absolute">
            {courses.map((course) => (
              <Button
                key={course.id}
                style={{ backgroundColor: course.colour }}
                onClick={async () => {
                  await startSession(course.id);
                  setActiveSession(true);
                }}
              >
                {course.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <Button
      onClick={async () => {
        await endSession();
        setActiveSession(false);
      }}
    >
      End Session
    </Button>
  );
}
