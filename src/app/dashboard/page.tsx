"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
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
import { createClient } from "@supabase/supabase-js";
export default function Dashboard() {
  interface FormData {
    prompt: string;
    strength: number;
  }

  const evolveIsland = async (data: FormData) => {
    try {
      const imageName = "island.png"; // Just the image name (without "/images/")

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

  const log15Minutes = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("temp").select("*").eq("id", 1);
    if (error) {
      console.error("Error:", error);
    }
    let newTotal = data[0].total + 15;
    const { error } = await supabase.from("temp").update({ total: newTotal });
    if (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex flex-row gap-4">
        <Card className="w-[512px]">
          <CardHeader>
            <CardTitle>My Island</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Image
              src="/images/generated_image.png"
              alt="My Island"
              width={512}
              height={262}
              unoptimized
              className="pixelated my-12 rounded-2xl"
            />

            <div className="flex flex-row justify-between space-x-4">
              <p className="text-sm font-bold">XP</p>
              <Progress value={66} />
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
    </div>
  );
}
