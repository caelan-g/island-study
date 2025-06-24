"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  mode?: "time" | "duration";
  className?: string;
}

interface PickerColumnProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

function PickerColumn({
  values,
  selectedIndex,
  onChange,
  className,
}: PickerColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const itemHeight = 40;
  const visibleItems = 5;
  const centerIndex = Math.floor(visibleItems / 2);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      if (!containerRef.current) return;

      const scrollTop = index * itemHeight;
      if (smooth) {
        containerRef.current.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      } else {
        containerRef.current.scrollTop = scrollTop;
      }
    },
    [itemHeight]
  );

  useEffect(() => {
    scrollToIndex(selectedIndex, false);
  }, [selectedIndex, scrollToIndex]);

  const applyMomentum = useCallback(() => {
    if (!containerRef.current || isDragging.current) return;

    const container = containerRef.current;
    const currentScrollTop = container.scrollTop;
    const maxScrollTop = (values.length - 1) * itemHeight;

    // Apply velocity to scroll position
    const newScrollTop = currentScrollTop - velocity.current * 16; // 16ms frame time

    // Clamp to bounds
    const clampedScrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop));
    container.scrollTop = clampedScrollTop;

    // Apply friction to velocity
    velocity.current *= 0.7;

    // Continue momentum if velocity is significant
    if (Math.abs(velocity.current) > 0.2) {
      animationFrame.current = requestAnimationFrame(applyMomentum);
    } else {
      // Momentum has stopped, now snap to nearest item with softer easing
      const nearestIndex = Math.round(clampedScrollTop / itemHeight);
      const clampedIndex = Math.max(
        0,
        Math.min(nearestIndex, values.length - 1)
      );

      // Softer snapping with custom easing
      const targetScrollTop = clampedIndex * itemHeight;
      const currentScroll = container.scrollTop;
      const distance = targetScrollTop - currentScroll;

      if (Math.abs(distance) > 1) {
        // Smooth easing towards target
        container.scrollTop = currentScroll + distance * 0.15;
        animationFrame.current = requestAnimationFrame(applyMomentum);
      } else {
        // Final snap
        container.scrollTop = targetScrollTop;
        onChange(clampedIndex);
      }
    }
  }, [values.length, itemHeight, onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    // Cancel any ongoing momentum animation
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = containerRef.current.scrollTop;
    velocity.current = 0;
    lastY.current = e.clientY;
    lastTime.current = Date.now();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const deltaY = e.clientY - startY.current;
    const newScrollTop = startScrollTop.current - deltaY;

    containerRef.current.scrollTop = Math.max(
      0,
      Math.min(newScrollTop, (values.length - 1) * itemHeight)
    );

    // Calculate velocity more accurately
    const now = Date.now();
    const timeDelta = now - lastTime.current;
    if (timeDelta > 0) {
      const yDelta = e.clientY - lastY.current;
      velocity.current = (yDelta / timeDelta) * 16; // Convert to pixels per frame
    }
    lastY.current = e.clientY;
    lastTime.current = now;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // Start momentum animation
    applyMomentum();
  };

  const handleScroll = () => {
    if (isDragging.current || !containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const currentIndex = Math.round(scrollTop / itemHeight);

    if (
      currentIndex !== selectedIndex &&
      Math.abs(scrollTop - currentIndex * itemHeight) < 5
    ) {
      onChange(currentIndex);
    }
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        ref={containerRef}
        className="h-[200px] overflow-y-scroll scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div style={{ height: centerIndex * itemHeight }} />
        {values.map((value, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center text-2xl font-medium transition-all duration-300 select-none",
              "h-10",
              index === selectedIndex
                ? "text-foreground scale-110"
                : "text-muted-foreground scale-95"
            )}
            style={{ height: itemHeight }}
          >
            {value}
          </div>
        ))}
        <div style={{ height: centerIndex * itemHeight }} />
      </div>

      {/* Selection indicator */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y border-border/20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}

export default function TimePicker({
  value = "12:00 AM",
  onChange,
  mode = "time",
  className,
}: TimePickerProps) {
  const hours =
    mode === "time"
      ? Array.from({ length: 12 }, (_, i) => (i + 1).toString())
      : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const parseValue = (val: string) => {
    if (mode === "duration") {
      const [h, m] = val.split(":").map(Number);
      return { hour: h, minute: m, period: 0 };
    } else {
      const match = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        const hour = Number.parseInt(match[1]);
        const minute = Number.parseInt(match[2]);
        const period = match[3].toUpperCase() === "PM" ? 1 : 0;
        return { hour, minute, period };
      }
    }
    return { hour: mode === "time" ? 12 : 0, minute: 0, period: 0 };
  };

  const formatValue = (hour: number, minute: number, period: number) => {
    if (mode === "duration") {
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    } else {
      const displayHour = hour === 0 ? 12 : hour;
      const periodStr = periods[period];
      return `${displayHour}:${minute
        .toString()
        .padStart(2, "0")} ${periodStr}`;
    }
  };

  const parsed = parseValue(value);
  const [selectedHour, setSelectedHour] = useState(
    mode === "time" ? (parsed.hour === 0 ? 11 : parsed.hour - 1) : parsed.hour
  );
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  const handleChange = useCallback(
    (newHour: number, newMinute: number, newPeriod: number) => {
      const actualHour = mode === "time" ? newHour + 1 : newHour;
      const formattedValue = formatValue(actualHour, newMinute, newPeriod);
      onChange?.(formattedValue);
    },
    [mode, onChange]
  );

  const handleHourChange = (index: number) => {
    setSelectedHour(index);
    handleChange(index, selectedMinute, selectedPeriod);
  };

  const handleMinuteChange = (index: number) => {
    setSelectedMinute(index);
    handleChange(selectedHour, index, selectedPeriod);
  };

  const handlePeriodChange = (index: number) => {
    setSelectedPeriod(index);
    handleChange(selectedHour, selectedMinute, index);
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center">
        {mode === "duration" && (
          <div className="text-sm text-muted-foreground hidden">hours</div>
        )}
        <PickerColumn
          values={hours}
          selectedIndex={selectedHour}
          onChange={handleHourChange}
          className="w-16"
        />

        <div className="text-2xl font-bold text-muted-foreground mb-1">:</div>

        <PickerColumn
          values={minutes}
          selectedIndex={selectedMinute}
          onChange={handleMinuteChange}
          className="w-16"
        />
        {mode === "duration" && (
          <div className="text-sm text-muted-foreground">hours</div>
        )}

        {mode === "time" && (
          <>
            <div className="w-4" />
            <PickerColumn
              values={periods}
              selectedIndex={selectedPeriod}
              onChange={handlePeriodChange}
              className="w-16"
            />
          </>
        )}
      </div>
    </div>
  );
}
