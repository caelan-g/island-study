"use client";
import { SessionCard } from "@/components/session-card";
import { useFetchSessions } from "@/hooks/sessions/fetch-sessions";
import { useFetchCourses } from "@/hooks/courses/fetch-courses";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "sonner";
import { sessionProps } from "@/components/types/session";

export default function Sessions() {
  const [sessions, setSessions] = useState<sessionProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [sessionData] = await Promise.all([useFetchSessions()]);

        if (sessionData) setSessions(sessionData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </>
  );
}
