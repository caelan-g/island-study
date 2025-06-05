"use client";
import { SessionCard } from "@/components/session-card";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "sonner";
import { sessionProps } from "@/components/types/session";
import { SessionDialog } from "@/components/session-dialog";
import { courseProps } from "@/components/types/course";

export default function Sessions() {
  const [sessions, setSessions] = useState<sessionProps[]>([]);
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<sessionProps | null>(
    null
  );
  //need function that updates island table goal when or if user goal changes
  //need to research whether to do this all serverside or fetching goal from supabase and api new island/updating?

  const initializeData = async () => {
    try {
      const [sessionData, courseData] = await Promise.all([
        fetchSessions(),
        fetchCourses(),
      ]);

      if (sessionData) setSessions(sessionData);
      if (courseData) setCourses(courseData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = (session: sessionProps) => {
    setSelectedSession(session);
    setOpenSessionDialog(true);
  };

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                courses={courses}
                onEdit={() => handleEditSession(session)}
              />
            ))}
          </div>

          {openSessionDialog && (
            <SessionDialog
              open={openSessionDialog}
              onOpenChange={(open: boolean) => {
                setOpenSessionDialog(open);
              }}
              courses={courses}
              sessionProps={selectedSession ? selectedSession : undefined}
            />
          )}
        </>
      )}
      <Toaster />
    </>
  );
}
