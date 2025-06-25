import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { checkSession } from "@/lib/sessions/check-session";
import { startSession } from "@/lib/sessions/start-session";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { Spinner } from "@/components/ui/spinner";
import { courseProps } from "@/components/types/course";
import { sessionProps } from "@/components/types/session";
import Stopwatch from "@/components/ui/stopwatch";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { PlayIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface SessionButtonProps {
  isActive?: (clicked: boolean) => void;
}

export function SessionButton({ isActive }: SessionButtonProps) {
  const { user: authUser } = useAuth();
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [activeLoading, setActiveLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<sessionProps | null>(null);

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
  }, [authUser, isActive]);

  // Run effect only once on mount
  useEffect(() => {
    initializeCourses();
    initializeActive();
  }, [initializeCourses, initializeActive]); // Remove activeSession from deps

  if (courseLoading || activeLoading) {
    return (
      <Button variant={"loading"} className="grow">
        <Spinner />
      </Button>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 5, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return !activeSession ? (
    <div className="flex flex-col gap-2 grow">
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="peer cursor-pointer w-full">
              <PlayIcon fill="currentColor" />
              Start
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-semibold tracking-tight">
                Start a session
              </DialogTitle>
            </DialogHeader>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="p-2 transition-all flex flex-col gap-2"
            >
              <AnimatePresence>
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    variants={item}
                    className="flex flex-row items-center transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className="h-4 w-4 rounded-sm"
                      style={{ backgroundColor: course.colour }}
                    />
                    <div
                      className="font-semibold text-xl p-2 rounded-md whitespace-nowrap overflow-x-hidden text-ellipsis cursor-pointer"
                      onClick={async () => {
                        await startSession(course.id, authUser);
                        await initializeActive();
                        isActive?.(true);
                      }}
                    >
                      {course.name}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  ) : (
    <>
      <Button
        onClick={async () => {
          isActive?.(false);
          await initializeActive();
        }}
        className="w-full"
      >
        <span>
          <Check strokeWidth={3} color="var(--chart-green)" />
        </span>
        <Stopwatch startTime={new Date(activeSession.start_time)} />
      </Button>
    </>
  );
}
