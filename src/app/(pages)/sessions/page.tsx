"use client";
import { SessionCard } from "@/components/sessions/session-card";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { useState, useEffect, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { sessionProps } from "@/components/types/session";
import { SessionDialog } from "@/components/sessions/session-dialog";
import { courseProps } from "@/components/types/course";
import { useAuth } from "@/contexts/auth-context";
import { EditSessionCard } from "@/components/sessions/edit-session-card";
import { SessionCardSkeleton } from "@/components/sessions/session-card-skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sessions() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<sessionProps[]>([]);
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<sessionProps | null>(
    null
  );
  //need function that updates island table goal when or if user goal changes
  //need to research whether to do this all serverside or fetching goal from supabase and api new island/updating?

  const initializeData = useCallback(async () => {
    try {
      const [sessionData, courseData] = await Promise.all([
        fetchSessions(authUser),
        fetchCourses(authUser),
      ]);

      if (sessionData) setSessions(sessionData);
      if (courseData) setCourses(courseData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  const handleSessionSubmit = async () => {
    setLoading(true);
    try {
      await initializeData();
      setSelectedSession(null); // Reset selection after update
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = (session: sessionProps) => {
    setSelectedSession(session);
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      initializeData();
    }
  }, [authLoading, authUser]);

  return (
    <>
      <div className="text-2xl font-bold">Sessions</div>
      <div className="flex flex-row w-full gap-4 justify-between items-start">
        <div className="flex flex-col gap-4 w-full">
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SessionCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  courses={courses}
                  user={authUser}
                  onClick={() => handleEditSession(session)}
                  isSelected={selectedSession?.id === session.id}
                />
              ))}
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
          </Card>
          <EditSessionCard
            courses={courses}
            sessionProps={selectedSession}
            onSubmitSuccess={handleSessionSubmit}
          />
        </div>
      </div>
    </>
  );
}
