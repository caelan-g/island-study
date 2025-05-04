"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Logout } from "@/hooks/logout";
import DraggableImageCard from "@/components/draggable-image";
import { fetchCourses } from "@/hooks/courses/fetch-courses";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

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

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. An async function inside useEffect to handle the async operation
    const fetchXP = async () => {
      // Call the async function and await its result
      const progress = await updateXP();
      // 3. Update the state with the resolved numerical value
      setProgressValue(progress);
    };

    // Call the async function when the component mounts
    fetchXP();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      const data = await fetchCourses();
      if (data) setCourses(data);
      setLoading(false);
    };
    loadCourses();
  }, []);

  const log15Minutes = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("temp").select("total");
    if (error) {
      console.error("Error:", error);
      return;
    }

    let newTotal = parseInt(data[0].total) + 15;
    console.log("newTotal", newTotal);
    const { error: updateError } = await supabase
      .from("temp")
      .update({ total: newTotal })
      .eq("id", 1);
    if (updateError) {
      console.error("Error:", updateError);
      return;
    }
    console.log("Successfully updated total");
    // Update the progress bar with the new total
    setProgressValue(newTotal);
  };

  const updateXP = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("temp")
      .select("total")
      .eq("id", 1);
    if (error) {
      console.error("Error:", error);
      return;
    }
    return parseInt(data[0].total);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Card className="w-[512px]">
            <CardHeader>
              <CardTitle>My Island</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <DraggableImageCard />

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
          <Card className="grow">
            <CardHeader>
              <CardTitle>Graphs</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => log15Minutes()}>Log 15 Minutes</Button>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-row gap-4">
          <Card>
            <CardHeader className="">
              <div className="font-bold text-xl">Courses</div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col my-2 min-w-96 gap-2">
                {loading ? (
                  <div className="animate-pulse bg-neutral-100 rounded-xl p-4">
                    loading...
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.name}
                      className="flex flex-row text-xl font-bold"
                    >
                      <div
                        className="size-8 rounded-sm"
                        style={{ backgroundColor: course.colour }}
                      />
                      <span>{course.name}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
