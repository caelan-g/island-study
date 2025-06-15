"use client";

import { useState, useRef, useEffect } from "react";

interface StopwatchProps {
  startTime?: Date;
}

export default function Stopwatch({ startTime = new Date() }: StopwatchProps) {
  //const [isRunning, setIsRunning] = useState(false);
  const [now, setNow] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate elapsed time from the provided start time
  const elapsedTime = Math.max(0, now - startTime.getTime());

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    //const ms = Math.floor((milliseconds % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  /*

  const handleStart = () => {
    setIsRunning(true);
    setNow(Date.now());

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Update the current time every second
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setNow(startTime.getTime());
  }; */

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Initialize now with start time on mount
  useEffect(() => {
    setNow(Date.now());
  }, [startTime]);

  return (
    <div className="font-bold tabular-nums" aria-live="polite">
      {formatTime(elapsedTime)}
    </div>
  );
}
