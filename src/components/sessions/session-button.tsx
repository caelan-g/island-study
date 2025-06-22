import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { checkSession } from "@/lib/sessions/check-session";
import { startSession } from "@/lib/sessions/start-session";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { Spinner } from "@/components/ui/spinner";
import { courseProps } from "@/components/types/course";
import { sessionProps } from "@/components/types/session";
import Stopwatch from "@/components/ui/stopwatch";
import { Square } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { PlayIcon } from "lucide-react";

interface SessionButtonProps {
  isActive?: (clicked: boolean) => void;
}

export function SessionButton({ isActive }: SessionButtonProps) {
  const { user: authUser } = useAuth();
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [activeLoading, setActiveLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<sessionProps | null>(null);

  // Move functions outside useEffect and memoize them
  const initializeCourses = useCallback(async () => {
    try {
      const courseData = await fetchCourses(authUser);
      if (courseData) setCourses(courseData);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setCourseLoading(false);
    }
  }, [authUser]);

  const initializeActive = useCallback(async () => {
    try {
      const active = await checkSession(authUser);
      setActiveSession(active);
    } catch (error) {
      console.error("Failed to check active session:", error);
    } finally {
      setActiveLoading(false);
    }
  }, [authUser]);

  // Run effect only once on mount
  useEffect(() => {
    initializeCourses();
    initializeActive();
  }, [initializeCourses, initializeActive]); // Remove activeSession from deps

  if (courseLoading || activeLoading) {
    return (
      <Button variant={"loading"}>
        <Spinner />
      </Button>
    );
  }

  return !activeSession ? (
    <div className="flex flex-col gap-2">
      <div>
        <Button className="peer cursor-pointer" variant="accent">
          <PlayIcon fill="currentColor" />
          Start
        </Button>
        <div className="bg-background rounded-md p-2 border transition-all flex flex-col gap-2 z-50 opacity-0 pointer-events-none peer-hover:opacity-100 hover:pointer-events-auto hover:opacity-100 peer-hover:pointer-events-auto absolute">
          {courses.map((course) => (
            <div
              key={course.id}
              className="text-xs text-white font-bold p-2 rounded-md whitespace-nowrap overflow-x-hidden text-ellipsis max-w-48 cursor-pointer"
              style={{
                backgroundColor: course.colour,
                //color: `color-mix(in srgb, ${course.colour} 15%, white)`,
              }}
              onClick={async () => {
                await startSession(course.id, authUser);
                initializeActive();
                isActive?.(true);
              }}
            >
              {course.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <>
      <Button
        onClick={() => {
          isActive?.(false);
          initializeActive();
        }}
      >
        <span>
          <Square strokeWidth={0} fill="rgb(255, 50, 50)" />
        </span>
        <Stopwatch startTime={new Date(activeSession.start_time)} />
      </Button>
    </>
  );
}
