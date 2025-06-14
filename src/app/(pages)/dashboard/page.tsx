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
import { useState, useEffect } from "react";
import { SessionButton } from "@/components/session-button";
import { RadialChart } from "@/components/charts/radial";
import { SessionDialog } from "@/components/session-dialog";
import { courseProps } from "@/components/types/course";
import Image from "next/image";
import { userProps } from "@/components/types/user";
import { islandProps } from "@/components/types/island";
import { fetchActiveIsland } from "@/lib/island/fetch-active-island";

export default function Dashboard() {
  const [openSessionDialog, setOpenSessionDialog] = useState(false);

  //const [progressValue, setProgressValue] = useState<number>(0);
  const [studyTime, setTotal] = useState<{ today: number; total: number }>({
    today: 0,
    total: 0,
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

  const loadDatabases = async () => {
    Promise.all([
      fetchUser(),
      checkSession(),
      fetchTotal(),
      fetchCourses(),
      fetchActiveIsland(),
    ])
      .then(
        ([userData, activeSession, sessionData, courseData, islandData]) => {
          if (userData) setUser(userData);
          setActiveSession(activeSession ? true : false);
          if (sessionData) setTotal(sessionData);
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
  };

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
    loadDatabases();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-row gap-2">
          <SessionButton />
          {!activeSession ? (
            <Button
              variant="secondary"
              onClick={() => setOpenSessionDialog(true)}
            >
              Add Session
            </Button>
          ) : null}

          <SessionDialog
            open={openSessionDialog}
            onOpenChange={(open: boolean) => {
              setOpenSessionDialog(open);
              if (!open) {
                handleSessionSubmit(); // Refresh data when dialog closes
              }
            }}
            courses={courses}
            onSubmitSuccess={handleSessionSubmit}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Card className="w-[512px]">
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
                  width={512}
                  height={262}
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
                  className={`bg-muted [&>div]:bg-muted-foreground ${
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
            <CardContent className="h-full">
              <div className="flex flex-col py-auto gap-2 justify-center h-full">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="">
                    <div className="min-w-48 p-">
                      <RadialChart
                        chartData={[
                          {
                            today: studyTime["today"],
                            goal: user?.goal ?? 0,
                            fill: "var(--color-safari)",
                          },
                        ]}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-row gap-4">
          <Card className="grow min-w-96">
            <CardContent>
              {loading ? (
                <SplineAreaChart />
              ) : (
                <SplineAreaChart data={chartCourses} />
              )}
            </CardContent>
          </Card>
          <Card className="grow">
            <CardContent>
              <StackedBarChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
