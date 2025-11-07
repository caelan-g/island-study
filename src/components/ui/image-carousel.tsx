"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayIcon, PlusIcon } from "lucide-react";

const islandData = [
  {
    src: "/images/landing/1.png",
    level: 2,
    xp: 587,
    maxxp: 2800,
    daysRemaining: 2,
  },
  {
    src: "/images/landing/2.png",
    level: 6,
    xp: 7842,
    maxxp: 8600,
    daysRemaining: 3,
  },
  {
    src: "/images/landing/3.png",
    level: 4,
    xp: 2438,
    maxxp: 4200,
    daysRemaining: 1,
  },
  {
    src: "/images/landing/4.png",
    level: 3,
    xp: 235,
    maxxp: 4500,
    daysRemaining: 5,
  },
  {
    src: "/images/landing/5.png",
    level: 5,
    xp: 935,
    maxxp: 1100,
    daysRemaining: 4,
  },
  {
    src: "/images/landing/6.png",
    level: 6,
    xp: 7842,
    maxxp: 8600,
    daysRemaining: 1,
  },
  {
    src: "/images/landing/7.png",
    level: 6,
    xp: 5604,
    maxxp: 13000,
    daysRemaining: 2,
  },
  {
    src: "/images/landing/8.png",
    level: 5,
    xp: 1254,
    maxxp: 8300,
    daysRemaining: 3,
  },
  {
    src: "/images/landing/9.png",
    level: 6,
    xp: 140,
    maxxp: 5600,
    daysRemaining: 6,
  },
  {
    src: "/images/landing/10.png",
    level: 3,
    xp: 2478,
    maxxp: 6400,
    daysRemaining: 4,
  },
  {
    src: "/images/landing/14.png",
    level: 7,
    xp: 7845,
    maxxp: 8200,
    daysRemaining: 4,
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % islandData.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentIsland = islandData[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-full aspect-[2/1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
              y: -5,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <Image
              src={currentIsland.src || "/placeholder.svg"}
              alt={`Pixel art island ${currentIndex + 1}`}
              width={512}
              height={256}
              className="w-full h-full object-contain pixelated floating -z-50"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full hidden lg:flex flex-col gap-2 mt-6">
        <div className="flex flex-row justify-center items-center">
          <div className="z-10 font-bold text-background">
            {currentIsland.level}
          </div>
          <span className="rotate-45 rounded-sm bg-primary size-6 absolute"></span>
        </div>
        <div className="flex flex-row justify-between space-x-4 items-center">
          <div className="flex flex-col w-full">
            <Progress
              className="bg-muted [&>div]:bg-muted-foreground"
              value={(currentIsland.xp / currentIsland.maxxp) * 100}
              max={(currentIsland.maxxp / currentIsland.maxxp) * 100}
            />
            <div className="flex flex-row justify-between">
              <p className="text-xs tracking-tight whitespace-nowrap">
                {currentIsland.daysRemaining} days remaining
              </p>

              <p className="text-xs whitespace-nowrap tracking-tight">
                {currentIsland.xp} / {currentIsland.maxxp} XP
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-row gap-2 w-full mt-2">
        <Button className="w-full" asChild>
          <a href="/auth/sign-up" className="flex items-center">
            <PlayIcon fill={"white"} />
            Start
          </a>
        </Button>
        <Button variant="secondary" className="w-full">
          <a href="/auth/sign-up" className="flex items-center gap-1">
            <PlusIcon strokeWidth={2.5} />
            Add
          </a>
        </Button>
      </div>
    </div>
  );
}
