"use client";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseProps } from "@/components/types/course";
import { sessionProps, TimeMetrics } from "@/components/types/session";
import { GroupedSession } from "@/components/types/session";
import { processSessionData } from "@/lib/metrics/process-session-data";
import { DayCourseAreaChart } from "@/components/charts/day-course-area-chart";
import { CourseMetric } from "@/components/metrics/courses/course-metric";
import { CourseTopMetric } from "@/components/metrics/courses/course-top-metric";
import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useState } from "react";
import { fetchIslands } from "@/lib/island/fetch-islands";
import { useAuth } from "@/contexts/auth-context";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { fetchUser } from "@/lib/user/fetch-user";
import { YearHeatmap } from "@/components/charts/year-heatmap";
import { RadarChart } from "@/components/charts/radar-chart";
import { Spinner } from "@/components/ui/spinner";
import { userProps } from "@/components/types/user";
import { BarChart } from "@/components/charts/bar-chart";

export default function AnalyticsPage() {
  const [islandCount, setIslandCount] = useState<number>(0);
  const [evolutionCount, setEvolutionCount] = useState<number>(0);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [dayCount, setDayCount] = useState<number>(0);
  const [user, setUser] = useState<userProps>();
  const [totalStudy, setTotalStudy] = useState<number>(0);
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [sessions, setSessions] = useState<sessionProps[]>([]);
  const [groupedSessions, setGroupedSessions] = useState<GroupedSession[]>([]);
  const [studyTime, setTotal] = useState<TimeMetrics>({
    today: 0,
    week: 0,
    month: 0,
  });

  const [loading, setLoading] = useState(true);
  const { user: authUser, loading: authLoading } = useAuth();

  const initializeData = useCallback(async () => {
    Promise.all([
      fetchUser(authUser),
      fetchCourses(authUser),
      fetchSessions(authUser),
      fetchIslands(authUser),
    ])
      .then(([userData, courseData, sessionData, islandData]) => {
        if (userData) setUser(userData);

        if (courseData) {
          setCourses(courseData);
        }
        setIslandCount(islandData ? islandData.length : 0);
        if (sessionData) {
          setSessions(sessionData);
          const uniqueDays = new Set(
            sessionData.map(
              (session) =>
                new Date(session.start_time).toISOString().split("T")[0],
            ),
          );
          setDayCount(uniqueDays.size);
          setSessionCount(sessionData.length);
          const totalMilliseconds = sessionData.reduce((acc, session) => {
            const startTime = new Date(session.start_time).getTime();
            const endTime = new Date(session.end_time).getTime();
            if (!isNaN(startTime) && !isNaN(endTime) && endTime > startTime) {
              return acc + (endTime - startTime);
            }
            return acc;
          }, 0);
          const totalSeconds = Math.round(totalMilliseconds / 1000);
          setTotalStudy(totalSeconds);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, [authUser]);

  useEffect(() => {
    if (!authLoading && authUser) {
      initializeData();
    }
  }, [authLoading, authUser, initializeData]);
  useEffect(() => {
    if (sessions.length > 0) {
      const [timeMetrics, groupedArray] = processSessionData(
        sessions,
        "all",
      ) || [{ today: 0, week: 0, month: 0 }, [], []];

      setTotal(timeMetrics as TimeMetrics);
      setGroupedSessions((groupedArray as GroupedSession[]).reverse());
    }
  }, [sessions]);
  if (loading || islandCount >= 3) {
    return (
      <div>
        <div className="text-2xl font-semibold tracking-tight">Analytics</div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Card className="w-full">
              <CardContent className="flex flex-col mt-6">
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                  Study Time by Course
                </h2>
                <DayCourseAreaChart
                  chartData={groupedSessions}
                  courses={courses}
                />
              </CardContent>
            </Card>
            <Card className="min-w-96">
              <CardContent className="flex flex-col mt-6">
                <h2 className="text-xl font-semibold tracking-tight mb-2">
                  Lifetime Stats
                </h2>
                <span className="text-muted-foreground text-xs">Totals</span>
                <p className="font-semibold text-md">
                  {Math.floor(totalStudy / 3600)}{" "}
                  <span className="font-normal text-sm">hours studied</span>
                </p>
                <p className="font-semibold text-md">
                  {sessionCount}{" "}
                  <span className="font-normal text-sm">sessions created</span>
                </p>
                <p className="font-semibold text-md">
                  {dayCount}{" "}
                  <span className="font-normal text-sm">
                    individual days studied
                  </span>
                </p>

                <p className="font-semibold text-md">
                  {islandCount}{" "}
                  <span className="font-normal text-sm">islands created</span>
                </p>
                <p className="font-semibold text-md">
                  {evolutionCount}{" "}
                  <span className="font-normal text-sm">islands evolved</span>
                </p>
                <span className="text-muted-foreground text-xs mt-4">
                  Records
                </span>
                <p className="font-semibold text-md">
                  {evolutionCount}{" "}
                  <span className="font-normal text-sm">longest session</span>
                </p>
                <p className="font-semibold text-md">
                  {evolutionCount}{" "}
                  <span className="font-normal text-sm">biggest day</span>
                  <p className="font-semibold text-md">
                    {evolutionCount}{" "}
                    <span className="font-normal text-sm">biggest week</span>
                    <p className="font-semibold text-md">
                      {evolutionCount}{" "}
                      <span className="font-normal text-sm">
                        biggest 30 days
                      </span>
                    </p>
                  </p>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full h-full">
            <CardContent className="flex flex-col mt-6 mb-12">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Courses This Year
              </h2>
              <div className="mx-auto">
                <div className="text-sm font-semibold mt-2 mb-2">
                  Course Heatmap
                </div>
                <YearHeatmap
                  data={groupedSessions}
                  type={"course"}
                  courseData={courses}
                  className="mx-auto"
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-row gap-4">
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
                      type="weekday"
                      goal={user?.goal ?? 0}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="flex flex-col gap-4 mt-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  Average Session Duration by Course
                </h2>
                <div className="w-full">
                  {loading && !user ? (
                    <Spinner className="mt-8 mx-auto" />
                  ) : (
                    <RadarChart
                      groupedSessions={groupedSessions}
                      type="course"
                      courseData={courses}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="flex flex-col gap-4 mt-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  Average Study By Month
                </h2>
                <div className="w-full">
                  {loading && !user ? (
                    <Spinner className="mt-8 mx-auto" />
                  ) : (
                    <BarChart chartData={groupedSessions} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="w-full h-full">
            <CardContent className="flex flex-col mt-6">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                This Year
              </h2>
              <div className="mx-auto">
                <div className="text-sm font-semibold mt-2 mb-2">
                  Study Time Heatmap
                </div>
                <YearHeatmap data={groupedSessions} type={"time"} />
                <div className="text-sm font-semibold mt-4 mb-2">
                  Session Count Heatmap
                </div>
                <YearHeatmap data={groupedSessions} type={"session"} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } else {
    return (
      <div className="fixed w-screen h-screen top-0 left-0 lg:pl-[16.5rem] bg-white pt-4">
        <div className="text-2xl font-semibold tracking-tight">Analytics</div>
        <div className="w-full flex h-screen backdrop-blur-sm absolute top-0 left-0 overflow-x-hidden">
          <div className="mx-auto text-center align-middle my-auto flex flex-col pb-12">
            <Lock size={30} strokeWidth={2} className="my-auto mx-auto" />
            <div className="font-semibold mx-auto text-lg">
              Analytics locked
            </div>
            <div className="text-sm">Create 3 unique islands</div>
            <div className="flex flex-row gap-1 mt-2">
              <Progress
                value={islandCount >= 1 ? 100 : 0}
                className="[&>div]:bg-[var(--chart-green)]"
              />
              <Progress
                value={islandCount >= 2 ? 100 : 0}
                className="[&>div]:bg-[var(--chart-green)]"
              />
              <Progress
                value={islandCount >= 3 ? 100 : 0}
                className="[&>div]:bg-[var(--chart-green)]"
              />
            </div>
          </div>
        </div>
        <div className="h-screen flex flex-col gap-4">
          <div className="flex flex-row gap-4 min-h-96">
            <Card className="min-w-96">
              <CardContent className="flex flex-col mt-6">
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                  Locked Metric 1
                </h2>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="flex flex-col mt-6">
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                  Locked Metric 2
                </h2>
              </CardContent>
            </Card>
          </div>
          <Card className="w-full h-full">
            <CardContent className="flex flex-col mt-6">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Locked Metric 3
              </h2>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
