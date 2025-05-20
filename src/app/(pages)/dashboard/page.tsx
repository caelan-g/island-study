"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DraggableImageCard from "@/components/draggable-image";
import { fetchCourses } from "@/hooks/courses/fetch-courses";
import { fetchTotal } from "@/hooks/user/fetch-total";
import { fetchUser } from "@/hooks/user/fetch-user";
import { timeFilter } from "@/hooks/time-filter";
import { StackedBarChart } from "@/components/charts/stacked-bar";
import { SplineAreaChart } from "@/components/charts/spline-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { SessionButton } from "@/components/session-button";
import { RadialChart } from "@/components/charts/radial";
import Image from "next/image";

export default function Dashboard() {
  interface FormData {
    prompt: string;
    strength: number;
  }

  const evolveIsland = async (data: FormData) => {
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
  };

  const [progressValue, setProgressValue] = useState<number>(0);
  const [studyTime, setTotal] = useState<{ today: number; total: number }>({
    today: 0,
    total: 0,
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [chartCourses, setChartCourses] = useState<{
    course: string[];
    total: number[];
  }>({ course: [], total: [] });
  const [user, setUser] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDatabases = async () => {
      setLoading(true);
      const userData = await fetchUser();
      if (userData) setUser(userData);

      const sessionData = await fetchTotal("studyTime");
      if (sessionData) setTotal(sessionData);

      const courseData = await fetchCourses();
      if (courseData) setCourses(courseData);
      let courseDataDictionary: { course?: string[]; total?: number[] } = {};
      if (courseData) {
        for (let i = 0; i < courseData.length; i++) {
          if (
            !courseDataDictionary["course"] ||
            !courseDataDictionary["total"]
          ) {
            courseDataDictionary["course"] = [];
            courseDataDictionary["total"] = [];
          }
          courseDataDictionary["course"].push(courseData[i].name);
          courseDataDictionary["total"].push(courseData[i].total);
        }
      }
      setChartCourses(courseDataDictionary);

      setLoading(false);
    };
    loadDatabases();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-row gap-2">
          <SessionButton />
          <Button variant="secondary">Add Session</Button>
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
                <Progress value={progressValue} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  evolveIsland({
                    prompt:
                      "Some cut down trees. Tree stumps. Stacked logs. Dirt paths. No structures. Jungle has been pushed back.",
                    strength: 0.65,
                  })
                }
              >
                Evolve island
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardContent className="h-full">
              <div className="flex flex-col align-middle py-auto min-w-96 gap-2 justify-center">
                {loading ? (
                  <div className="animate-pulse bg-neutral-100 rounded-xl p-4">
                    loading...
                  </div>
                ) : (
                  <RadialChart
                    chartData={[
                      {
                        today: studyTime["today"],
                        goal: user[0].goal,
                        fill: "var(--color-safari)",
                      },
                    ]}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-row gap-4">
          <Card className="grow">
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
