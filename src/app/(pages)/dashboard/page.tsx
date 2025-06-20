"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { fetchTotal } from "@/lib/user/fetch-total";
import { fetchUser } from "@/lib/user/fetch-user";
import { StackedBarChart } from "@/components/charts/stacked-bar";
import { SplineAreaChart } from "@/components/charts/spline-area";
import { checkSession } from "@/lib/sessions/check-session";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { SessionButton } from "@/components/sessions/session-button";
import { RadialChart } from "@/components/charts/radial";
import { SessionDialog } from "@/components/sessions/session-dialog";
import { courseProps } from "@/components/types/course";
import Image from "next/image";
import { userProps } from "@/components/types/user";
import { islandProps } from "@/components/types/island";
import { fetchActiveIsland } from "@/lib/island/fetch-active-island";
import { useAuth } from "@/contexts/auth-context";
import { PlusIcon } from "lucide-react";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { sessionProps } from "@/components/types/session";
import { DashboardSessionCard } from "@/components/sessions/dashboard-session-card";
import { SessionDayCard } from "@/components/sessions/session-day-card";
import { timeFilter } from "@/lib/filters/time-filter";
import { LabelledPieChart } from "@/components/charts/labelled-pie-chart";

interface GroupedSession {
  date: string;
  sessions: sessionProps[];
}

interface TimeMetrics {
  today: number;
  week: number;
  month: number;
  all: number;
}

export default function Dashboard() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [openSessionDialog, setOpenSessionDialog] = useState(false);

  //const [progressValue, setProgressValue] = useState<number>(0);
  const [studyTime, setTotal] = useState<TimeMetrics>({
    today: 0,
    week: 0,
    month: 0,
    all: 0,
  });
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [island, setIsland] = useState<islandProps | null>(null);
  const [chartCourses, setChartCourses] = useState<{
    course: string[];
    total: number[];
  }>({ course: [], total: [] });
  const [user, setUser] = useState<userProps>();
  const [activeSession, setActiveSession] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [allSessions, setAllSessions] = useState<sessionProps[]>([]);
  const [recentSessions, setRecentSessions] = useState<sessionProps[]>([]);
  const [groupedSessions, setGroupedSessions] = useState<GroupedSession[]>([]);
  console.log(groupedSessions);

  const processSessionData = useCallback((sessions: sessionProps[]) => {
    if (!sessions) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const allTime = new Date(0); // Represents the start of time

    // Calculate time metrics
    const timeMetrics = sessions.reduce(
      (acc: TimeMetrics, session) => {
        const sessionStart = new Date(session.start_time);
        const duration =
          (new Date(session.end_time).getTime() - sessionStart.getTime()) /
          1000;

        if (sessionStart >= today) {
          acc.today += duration;
        }
        if (sessionStart >= weekAgo) {
          acc.week += duration;
        }
        if (sessionStart >= monthAgo) {
          acc.month += duration;
        }

        return acc;
      },
      { today: 0, week: 0, month: 0 }
    );

    setTotal(timeMetrics);

    // Rest of your existing processSessionData logic...
    setAllSessions(sessions);
    setRecentSessions(sessions.slice(0, 5));

    // Group sessions by day
    const grouped = sessions.reduce(
      (acc: { [key: string]: sessionProps[] }, session) => {
        const date = new Date(session.start_time).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(session);
        return acc;
      },
      {}
    );

    const groupedArray = Object.entries(grouped)
      .map(([date, sessions]) => ({
        date,
        sessions,
      }))
      .slice(0, 7);

    setGroupedSessions(groupedArray);
  }, []);

  const loadDatabases = useCallback(async () => {
    Promise.all([
      fetchUser(authUser),
      checkSession(authUser),
      fetchTotal(authUser),
      fetchCourses(authUser),
      fetchActiveIsland(authUser),
      fetchSessions(authUser),
    ])
      .then(
        ([
          userData,
          activeSession,
          totalData,
          courseData,
          islandData,
          sessionData,
        ]) => {
          if (userData) setUser(userData);
          setActiveSession(activeSession ? true : false);
          if (totalData) setTotal(totalData);
          if (sessionData) processSessionData(sessionData);
          if (courseData) {
            setCourses(courseData);
            const courseNames = courseData.map((course) => course.name);
            const courseTotals = courseData.map((course) => course.total);
            setChartCourses({ course: courseNames, total: courseTotals });
          }
          setIsland(islandData);
          setLoading(false);
        }
      )
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, [authUser, processSessionData]);

  const handleSessionSubmit = async () => {
    setLoading(true);
    try {
      await loadDatabases(); // Reuse existing loadDatabases function
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      loadDatabases();
    }
  }, [authLoading, authUser, loadDatabases]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-row gap-2">
          <SessionButton
            isActive={(isActive) => {
              if (!isActive) {
                setOpenSessionDialog(true);
              } else {
              }
            }}
          />
          {!activeSession ? (
            <Button
              variant="secondary"
              onClick={() => setOpenSessionDialog(true)}
            >
              <PlusIcon strokeWidth={2.5} />
              Add
            </Button>
          ) : null}

          <SessionDialog
            open={openSessionDialog}
            onOpenChange={(open: boolean) => {
              setOpenSessionDialog(open);
            }}
            courses={courses}
            onSubmitSuccess={handleSessionSubmit}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Card className="w-[600px]">
            <CardHeader></CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div>
                <Image
                  src={
                    loading
                      ? "/images/loading_island.png"
                      : island
                      ? island.current_url
                      : "/images/loading_island.png" //change later
                  }
                  alt="My Island"
                  width={600}
                  height={300}
                  className="pixelated floating pointer-events-none select-none"
                  unoptimized
                />
              </div>
              <div className="flex flex-row justify-center items-center">
                <div className="z-10 font-bold text-background">
                  {island ? island.level : <Spinner size="xs" />}
                </div>
                <span className="rotate-45 rounded-sm bg-primary size-6 absolute"></span>
              </div>
              <div className="flex flex-row justify-between space-x-4 items-center">
                <Progress
                  className={`bg-muted [&>div]:bg-primary ${
                    island?.level === 7 ? "hidden" : ""
                  }`}
                  value={island ? (island.xp / island.threshold) * 100 : 0}
                />
                <p
                  className={`text-xs font-bold whitespace-nowrap ${
                    island?.level === 7 ? "hidden" : ""
                  }`}
                >
                  {island ? `${island.xp} / ${island.threshold} XP` : null}
                </p>
                {island?.level == 7 ? (
                  <p className="font-bold mx-auto">MAX</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
          <Card className="grow">
            <CardContent className="h-full mt-8">
              <div className="flex flex-col py-auto gap-2 justify-center h-full">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="">
                    <div className="min-w-48 flex flex-col gap-2">
                      <div className="flex flex-row justify-between gap-4 mx-12">
                        <div>
                          <h1 className="text-md text-muted-foreground text-center">
                            Today
                          </h1>
                          <p className="text-2xl font-bold ">
                            {timeFilter(studyTime["today"])}
                          </p>
                          <Progress
                            className="bg-muted [&>div]:bg-[--chart-green]"
                            value={
                              user?.goal
                                ? (studyTime["today"] / user.goal) * 100
                                : 0
                            }
                          />
                        </div>
                        <div>
                          <h1 className="text-md text-muted-foreground text-center">
                            Week
                          </h1>
                          <p className="text-2xl font-bold ">
                            {timeFilter(studyTime["week"])}
                          </p>
                          <Progress
                            className="bg-muted [&>div]:bg-[--chart-green]"
                            value={
                              user?.goal
                                ? (studyTime["week"] / (user.goal * 7)) * 100
                                : 0
                            }
                          />
                        </div>
                        <div>
                          <h1 className="text-md text-muted-foreground text-center">
                            Month
                          </h1>
                          <p className="text-2xl font-bold ">
                            {timeFilter(studyTime["month"])}
                          </p>
                          <Progress
                            className="bg-muted [&>div]:bg-[--chart-green]"
                            value={
                              user?.goal
                                ? (studyTime["month"] / (user.goal * 30)) * 100
                                : 0
                            }
                          />
                        </div>
                      </div>
                      {/*<RadialChart
                        chartData={[
                          {
                            today: studyTime["today"],
                            goal: user?.goal ?? 0,
                            fill: "var(--chart-green)",
                          },
                        ]}
                      />*/}
                      <div className="flex flex-row justify-center grow">
                        {groupedSessions.map((day) => (
                          <SessionDayCard
                            key={day.date}
                            day={day}
                            goal={user?.goal ?? 0}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <Card className="min-w-96">
              <CardContent>
                {loading ? (
                  <SplineAreaChart />
                ) : (
                  <SplineAreaChart data={chartCourses} />
                )}
              </CardContent>
            </Card>
            <Card className="min-w-96">
              <CardContent>
                <LabelledPieChart />
              </CardContent>
            </Card>
          </div>

          <Card className="grow">
            <CardContent className="flex flex-col">
              <div className="grow min-w-96">
                <StackedBarChart />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {recentSessions.map((session) => (
                  <DashboardSessionCard
                    key={session.id}
                    session={session}
                    courses={courses}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
