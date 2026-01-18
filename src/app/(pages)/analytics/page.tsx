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
import {
  YearHeatmap,
  HeatmapDataPoint,
} from "@/components/charts/year-heatmap";

function generateTestData(): HeatmapDataPoint[] {
  const data: HeatmapDataPoint[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Generate random values with some patterns
    // More activity on weekdays
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Random chance of having activity
    const hasActivity = Math.random() > (isWeekend ? 0.6 : 0.3);

    if (hasActivity) {
      // Generate value between 1 and 15, weighted lower on weekends
      const maxValue = isWeekend ? 8 : 15;
      const value = Math.floor(Math.random() * maxValue) + 1;

      data.push({
        date: date.toISOString().split("T")[0],
        value,
      });
    }
  }

  return data;
}

export default function AnalyticsPage() {
  const testData = generateTestData();
  const [islandCount, setIslandCount] = useState<number>(0);
  const [evolutionCount, setEvolutionCount] = useState<number>(0);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [dayCount, setDayCount] = useState<number>(0);
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
    const islandData = await fetchIslands(authUser);
    const courseData = await fetchCourses(authUser);
    const sessionData = await fetchSessions(authUser);

    setIslandCount(islandData ? islandData.length : 0);
    setLoading(false);
    if (courseData) setCourses(courseData);
    if (islandData) {
      setEvolutionCount(
        islandData.reduce(
          (total, island) => total + (island.previous_urls?.length || 0) + 1,
          0
        )
      );
    }
    if (sessionData) {
      setSessions(sessionData);
      const uniqueDays = new Set(
        sessionData.map(
          (session) => new Date(session.start_time).toISOString().split("T")[0]
        )
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
  }, [authUser]);

  useEffect(() => {
    if (!authLoading && authUser) {
      initializeData();
    }
  }, [authLoading, authUser, initializeData]);
  useEffect(() => {
    if (sessions.length > 0) {
      const [timeMetrics, groupedArray] = processSessionData(sessions) || [
        { today: 0, week: 0, month: 0 },
        [],
        [],
      ];

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
                <div className="flex flex-col gap-2">
                  <CourseTopMetric
                    timeframe="month"
                    courses={courses}
                    groupedSessions={groupedSessions}
                  />
                  <CourseMetric
                    studyTime={studyTime["month"]}
                    timeframe="month"
                    courses={courses}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="min-w-96">
              <CardContent className="flex flex-col mt-6">
                <h2 className="text-xl font-semibold tracking-tight mb-2">
                  Lifetime Stats
                </h2>

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
              </CardContent>
            </Card>
          </div>
          <Card className="w-full h-full">
            <CardContent className="flex flex-col mt-6">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                This Year
              </h2>
              <div className="text-md">something here</div>
              <YearHeatmap data={testData} />
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
