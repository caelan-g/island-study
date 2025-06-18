"use client";

import { useState, useRef, useEffect } from "react";

interface StopwatchProps {
  startTime?: Date;
}

export default function Stopwatch({ startTime = new Date() }: StopwatchProps) {
  const [now, setNow] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate elapsed time from the provided start time
  const elapsedTime = Math.max(0, now - startTime.getTime());

  useEffect(() => {
    // Set up the interval when the component mounts
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime]); // Add startTime as dependency to reset interval if startTime changes

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="font-bold tabular-nums" aria-live="polite">
      {formatTime(elapsedTime)}
    </div>
  );
}
