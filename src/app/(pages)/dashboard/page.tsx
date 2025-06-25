"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { fetchUser } from "@/lib/user/fetch-user";
import { checkSession } from "@/lib/sessions/check-session";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { SessionButton } from "@/components/sessions/session-button";
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
import { SessionDayCard } from "@/components/sessions/session-day-card";
import { TimeMetric } from "@/components/metrics/time-metric";
import { SessionMetric } from "@/components/metrics/session-metric";
import { CourseMetric } from "@/components/metrics/course-metric";
import { PeriodProgress } from "@/components/metrics/period-progress";
import { processSessionData } from "@/lib/metrics/process-session-data";
import { SessionCountMetric } from "@/components/metrics/session-count-metric";
import { CourseTopMetric } from "@/components/metrics/course-top-metric";
import { RadarChart } from "@/components/charts/radar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { TotalCourseAreaChart } from "@/components/charts/total-course-area-chart";
import StudyHeatmap from "@/components/charts/study-heatmap";
import { toast } from "sonner";
import { GroupedSession, TimeMetrics } from "@/components/types/session";
import ReviewDialog from "@/components/islands/review-dialog";
import { resetIsland } from "@/lib/island/reset-island";

export default function Dashboard() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [openSessionDialog, setOpenSessionDialog] = useState(false);

  //const [progressValue, setProgressValue] = useState<number>(0);
  const [studyTime, setTotal] = useState<TimeMetrics>({
    today: 0,
    week: 0,
    month: 0,
  });
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [island, setIsland] = useState<islandProps | null>(null);
  const [user, setUser] = useState<userProps>();
  const [activeSession, setActiveSession] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [rawSessionData, setRawSessionData] = useState<sessionProps[]>([]);
  const [groupedSessions, setGroupedSessions] = useState<GroupedSession[]>([]);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [oldIsland, setOldIsland] = useState<islandProps | null>(null);

  useEffect(() => {
    if (rawSessionData.length > 0) {
      const [timeMetrics, groupedArray] = processSessionData(
        rawSessionData
      ) || [{ today: 0, week: 0, month: 0 }, [], []];

      setTotal(timeMetrics as TimeMetrics);
      setGroupedSessions(groupedArray as GroupedSession[]);
    }
  }, [rawSessionData]);

  const loadDatabases = useCallback(async () => {
    Promise.all([
      fetchUser(authUser),
      checkSession(authUser),
      fetchCourses(authUser),
      fetchActiveIsland(authUser),
      fetchSessions(authUser),
    ])
      .then(
        ([userData, activeSession, courseData, islandData, sessionData]) => {
          if (userData) setUser(userData);
          setActiveSession(activeSession ? true : false);
          if (sessionData) setRawSessionData(sessionData);
          if (courseData) {
            setCourses(courseData);
          }
          setIsland(islandData);
          setLoading(false);
        }
      )
      .catch((error) => {
        console.error("Error loading data:", error);
        toast.error("Error loading data. Please try again later.");
        setLoading(false);
      });
  }, [authUser]);

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

  useEffect(() => {
    if (island) {
      const deadline = new Date(island.created_at);
      deadline.setDate(deadline.getDate() + 7); // Add 1 week
      const daysRemaining =
        (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      if (daysRemaining < 0) {
        setDaysRemaining(0);
        setReviewDialogOpen(true);
        resetIsland(authUser);
        setOldIsland(island);
        loadDatabases(); // Reload data after resetting island
      } else {
        setDaysRemaining(daysRemaining);
      }
    }
  }, [island]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <Card className="lg:min-w-[600px] w-full max-w-[800px]">
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
                  className="pixelated floating pointer-events-none select-none w-full max-w-[800px]"
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
                <div className="flex flex-col w-full">
                  <Progress
                    className={`bg-muted [&>div]:bg-muted-foreground ${
                      island?.level === 7 ? "hidden" : ""
                    }`}
                    value={island ? (island.xp / island.threshold) * 100 : 0}
                  />
                  <div className="flex flex-row justify-between">
                    <p className="text-xs tracking-tight whitespace-nowrap">
                      {island
                        ? (() => {
                            return daysRemaining > 0
                              ? `${Math.round(daysRemaining)} days remaining`
                              : "Time expired";
                          })()
                        : ""}
                    </p>

                    <p
                      className={`text-xs whitespace-nowrap tracking-tight ${
                        island?.level === 7 ? "hidden" : ""
                      }`}
                    >
                      {island
                        ? `${island.xp} / ${island.threshold} XP`
                        : `0 XP`}
                    </p>
                  </div>
                </div>
              </div>
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
                    className="grow"
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
            </CardContent>
          </Card>
          <Card className="w-full px-4">
            <CardContent className="mt-8">
              <div className="flex flex-col py-auto gap-2 justify-center h-full">
                <div className="min-w-48 flex flex-col gap-6">
                  <div className="flex flex-row justify-between w-full">
                    <PeriodProgress
                      studyTime={studyTime["today"]}
                      goal={user?.goal ?? 0}
                      timeframe="day"
                    />
                    <PeriodProgress
                      studyTime={studyTime["week"]}
                      goal={user?.goal ?? 0}
                      timeframe="week"
                    />
                    <PeriodProgress
                      studyTime={studyTime["month"]}
                      goal={user?.goal ?? 0}
                      timeframe="month"
                    />
                  </div>
                  <div className="flex flex-row justify-between">
                    {/*} <RadialChart
                      chartData={[
                        {
                          today: studyTime["today"],
                          goal: user?.goal ?? 0,
                          fill: "var(--chart-green)",
                        },
                      ]}
                    /> */}
                    <LineChart chartData={groupedSessions} />

                    <div className="absolute">
                      <TimeMetric
                        studyTime={studyTime["week"]}
                        goal={user?.goal ?? 0}
                        timeframe="week"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-between gap-2">
                    {loading ? (
                      <Spinner className="mt-8" />
                    ) : (
                      [...groupedSessions]
                        .reverse()
                        .slice(0, 7)
                        .reverse()
                        .map((day) => (
                          <SessionDayCard
                            key={day.date}
                            day={day}
                            goal={user?.goal ?? 0}
                          />
                        ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex lg:flex-row flex-col gap-4">
          <Card className="w-full max-w-96">
            <CardContent className="flex flex-col mt-6">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Last 30 Days
              </h2>
              {loading ? (
                <Spinner className="mt-8" />
              ) : (
                <StudyHeatmap
                  groupedSessions={groupedSessions}
                  goal={user?.goal ?? 0}
                />
              )}
            </CardContent>
          </Card>
          <Card className="lg:min-w-96 w-full">
            <CardContent className="mt-6">
              <div className="flex flex-col gap-2">
                <CourseTopMetric
                  timeframe="week"
                  courses={courses}
                  groupedSessions={groupedSessions}
                />
                <CourseMetric
                  studyTime={studyTime["week"]}
                  timeframe="week"
                  courses={courses}
                />
              </div>
              <div className="">
                {loading ? (
                  <TotalCourseAreaChart
                    chartData={groupedSessions.reverse()}
                    timeframe={"week"}
                    courses={courses}
                  />
                ) : (
                  <TotalCourseAreaChart
                    chartData={groupedSessions.reverse()}
                    timeframe={"week"}
                    courses={courses}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="flex flex-col gap-4 mt-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Average Study By Day
              </h2>
              <div className="">
                {loading && !user ? (
                  <Spinner className="mt-8" />
                ) : (
                  <RadarChart
                    groupedSessions={groupedSessions}
                    goal={user?.goal ?? 0}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <SessionMetric
                  studyTime={studyTime["week"]}
                  timeframe="week"
                  groupedSessions={groupedSessions}
                />
                <SessionCountMetric
                  timeframe="week"
                  groupedSessions={groupedSessions}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={(open: boolean) => {
          setReviewDialogOpen(open);
        }}
        groupedSessions={groupedSessions}
        studyTime={studyTime["week"]}
        goal={user?.goal ?? 0}
        courses={courses}
        island={oldIsland}
      />
    </div>
  );
}
