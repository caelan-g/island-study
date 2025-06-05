"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFetchCourses } from "@/hooks/courses/fetch-courses";
import { useFetchTotal } from "@/hooks/user/fetch-total";
import { useFetchUser } from "@/hooks/user/fetch-user";
import { StackedBarChart } from "@/components/charts/stacked-bar";
import { SplineAreaChart } from "@/components/charts/spline-area";
import { useCheckSession } from "@/hooks/sessions/check-session";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { SessionButton } from "@/components/session-button";
import { RadialChart } from "@/components/charts/radial";
import { SessionDialog } from "@/components/session-dialog";
import { courseProps } from "@/components/types/course";
import Image from "next/image";

export default function Dashboard() {
  /*const evolveIsland = async (data: FormData) => {
    try {
      const imageName = "light_island.png"; // Just the image name (without "/images/")

      const response = await fetch("/api/retro-diffusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: data.prompt,
          strength: data.strength,
          imagePath: imageName, // Extract the base64 string without the data URL part
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }; */

  const [openSessionDialog, setOpenSessionDialog] = useState(false);

  //const [progressValue, setProgressValue] = useState<number>(0);
  const [studyTime, setTotal] = useState<{ today: number; total: number }>({
    today: 0,
    total: 0,
  });
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [chartCourses, setChartCourses] = useState<{
    course: string[];
    total: number[];
  }>({ course: [], total: [] });
  const [user, setUser] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDatabases = async () => {
    Promise.all([
      useFetchUser(),
      useCheckSession(),
      useFetchTotal("studyTime"),
      useFetchCourses(),
    ])
      .then(([userData, activeSession, sessionData, courseData]) => {
        if (userData) setUser(userData);
        setActiveSession(activeSession ? true : false);
        if (sessionData) setTotal(sessionData);
        if (courseData) {
          setCourses(courseData);
          const courseNames = courseData.map((course) => course.name);
          const courseTotals = courseData.map((course) => course.total);
          setChartCourses({ course: courseNames, total: courseTotals });
        }
        setLoading(false);
      })
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
                  src="/images/light_island.png"
                  alt="My Island"
                  width={512}
                  height={262}
                  className="pixelated floating pointer-events-none select-none"
                  unoptimized
                />
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <p className="text-sm font-bold">XP</p>
                <Progress value={0} />
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
                            goal: user[0].goal,
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
