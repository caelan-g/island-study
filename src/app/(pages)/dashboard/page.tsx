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
import { ArrowBigUpDash, PlusIcon } from "lucide-react";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { sessionProps } from "@/components/types/session";
import { SessionDayCard } from "@/components/sessions/session-day-card";
import { TimeMetric } from "@/components/metrics/time/time-metric";
import { SessionMetric } from "@/components/metrics/sessions/session-metric";
import { CourseMetric } from "@/components/metrics/courses/course-metric";
import { PeriodProgress } from "@/components/metrics/time/period-progress";
import { processSessionData } from "@/lib/metrics/process-session-data";
import { SessionCountMetric } from "@/components/metrics/sessions/session-count-metric";
import { CourseTopMetric } from "@/components/metrics/courses/course-top-metric";
import { RadarChart } from "@/components/charts/radar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { TotalCourseAreaChart } from "@/components/charts/total-course-area-chart";
import StudyHeatmap from "@/components/charts/study-heatmap";
import { toast } from "sonner";
import { GroupedSession, TimeMetrics } from "@/components/types/session";
import ReviewDialog from "@/components/islands/review-dialog";
import { resetIsland } from "@/lib/island/reset-island";
import { motion, AnimatePresence } from "framer-motion";

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

  // Add this state to track level-ups
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [isLevelUp, setIsLevelUp] = useState(false);

  useEffect(() => {
    if (rawSessionData.length > 0) {
      const [timeMetrics, groupedArray] = processSessionData(
        rawSessionData
      ) || [{ today: 0, week: 0, month: 0 }, [], []];

      setTotal(timeMetrics as TimeMetrics);
      setGroupedSessions(groupedArray as GroupedSession[]);
    }
  }, [rawSessionData]);

  useEffect(() => {
    if (isLevelUp) {
      const sound = "/sounds/level-up.mp3";
      const audio = new Audio(sound);
      setTimeout(() => {
        audio.play();
      }, 500);
    }
  }, [isLevelUp]);

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
      await loadDatabases();
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

  useEffect(() => {
    if (previousLevel !== null && island && island.level > previousLevel) {
      setIsLevelUp(true);
      setTimeout(() => setIsLevelUp(false), 2000); // Reset after animation
    }
    if (island) {
      setPreviousLevel(island.level);
    }
  }, [island?.level, previousLevel]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <Card className="lg:min-w-[600px] w-full max-w-[800px]">
            <CardHeader></CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div>
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={island?.current_url || "loading"}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        type: "spring",
                        bounce: 0.4,
                      }}
                      className="relative"
                    >
                      <Image
                        src={
                          loading
                            ? "/images/loading_island.png"
                            : island
                            ? island.current_url
                            : "/images/loading_island.png"
                        }
                        alt="My Island"
                        width={600}
                        height={300}
                        className={`pixelated pointer-events-none select-none w-full max-w-[800px] floating ${
                          isLevelUp ? "animate-shimmer" : ""
                        }`}
                        unoptimized
                      />

                      {isLevelUp && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.8, 1, 0],
                            }}
                            transition={{ duration: 1.5, times: [0, 0.5, 1] }}
                            className="text-4xl font-bold text-emerald-500 bg-black/30 px-6 py-3 rounded-full"
                          >
                            <ArrowBigUpDash className="w-24 h-24" />
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
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
                            if (Math.round(daysRemaining) > 0) {
                              return `${Math.round(
                                daysRemaining
                              )} days remaining`;
                            } else if (Math.round(daysRemaining) == 0) {
                              return `${Math.round(
                                daysRemaining * 24
                              )} hours remaining`;
                            }
                            return "Time expired";
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
                  <div className="hidden lg:flex flex-row justify-between w-full">
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
                  <div className="mx-auto lg:hidden ">
                    <PeriodProgress
                      studyTime={studyTime["today"]}
                      goal={user?.goal ?? 0}
                      timeframe="day"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    {/*} <RadialChart
                      chartData={[
                        {
                          today: studyTime["today"],
                          goal: user?.goal ?? 0,
                          fill: "var(--chart-green)",
                        },
                      ]}
                    /> */}
                    <div className="">
                      <TimeMetric
                        studyTime={studyTime["week"]}
                        goal={user?.goal ?? 0}
                        timeframe="week"
                      />
                    </div>
                    <LineChart chartData={groupedSessions} />
                  </div>
                  <div className="lg:flex flex-row justify-between gap-2 hidden">
                    {loading ? (
                      <Spinner className="mt-8" />
                    ) : (
                      [...groupedSessions]
                        .slice(0, 7)
                        .map((day) => (
                          <SessionDayCard
                            key={day.date}
                            day={day}
                            goal={user?.goal ?? 0}
                          />
                        ))
                    )}
                  </div>
                  <div className="flex flex-row justify-between lg:hidden">
                    {loading ? (
                      <Spinner className="mt-8" />
                    ) : (
                      [...groupedSessions]
                        .slice(0, 5)
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
