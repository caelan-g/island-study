"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormControl } from "@/components/ui/form";

type Period = "AM" | "PM";

interface TimePickerProps {
  value?: number; // time in seconds
  onChange?: (seconds: number) => void;
  className?: string;
  use24Hour?: boolean;
  field?: ControllerRenderProps<
    {
      goal: number;
      name: string;
      hasCourse: boolean;
    },
    "goal"
  >;
}

export default function TimePicker({
  value = 0,
  onChange,
  className,
  use24Hour = true,
  field,
}: TimePickerProps) {
  // Use field value if available, otherwise use direct value prop
  const currentValue = field?.value ?? value;

  const [selectedHour, setSelectedHour] = useState(() =>
    Math.floor(currentValue / 3600)
  );
  const [selectedMinute, setSelectedMinute] = useState(() =>
    Math.floor((currentValue % 3600) / 60)
  );
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  const hours = use24Hour
    ? Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
    : Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  useEffect(() => {
    setSelectedHour(Math.floor(currentValue / 3600));
    setSelectedMinute(Math.floor((currentValue % 3600) / 60));
  }, [currentValue]);

  // Convert 24-hour to 12-hour format
  useEffect(() => {
    if (!use24Hour) {
      const hour24 = Math.floor(value / 3600);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? "PM" : "AM";
      setSelectedHour(hour12);
      setSelectedPeriod(period);
    } else {
      setSelectedHour(Math.floor(value / 3600));
    }
    setSelectedMinute(Math.floor((value % 3600) / 60));
  }, [value, use24Hour]);

  // Update form when time changes
  useEffect(() => {
    const totalSeconds = selectedHour * 3600 + selectedMinute * 60;

    if (field) {
      field.onChange(totalSeconds);
    } else {
      onChange?.(totalSeconds);
    }
  }, [selectedHour, selectedMinute, field, onChange]);

  const handleHourScroll = (element: HTMLDivElement) => {
    const itemHeight = 40;
    const scrollTop = element.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, hours.length - 1));
    setSelectedHour(Number.parseInt(hours[clampedIndex]));

    element.scrollTo({
      //top: clampedIndex * itemHeight,
      //behavior: "smooth",
    });
  };

  const handleMinuteScroll = (element: HTMLDivElement) => {
    const itemHeight = 40;
    const scrollTop = element.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, minutes.length - 1));
    setSelectedMinute(Number.parseInt(minutes[clampedIndex]));

    element.scrollTo({
      //top: clampedIndex * itemHeight,
      //behavior: "smooth",
    });
  };

  const handlePeriodScroll = (element: HTMLDivElement) => {
    const itemHeight = 40;
    const scrollTop = element.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, periods.length - 1));
    setSelectedPeriod(periods[clampedIndex] as Period);

    element.scrollTo({
      //top: clampedIndex * itemHeight,
      //behavior: "smooth",
    });
  };

  const renderColumn = (
    items: string[],
    selectedValue: string | number,
    onScroll: (element: HTMLDivElement) => void,
    ref: React.RefObject<HTMLDivElement | null>
  ) => (
    <div className="relative h-[200px] overflow-hidden">
      <div
        ref={ref}
        className="h-full overflow-y-scroll scrollbar-hide scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
        onScroll={(e) => onScroll(e.currentTarget)}
      >
        <div className="py-20">
          {items.map((item) => {
            const isSelected =
              item === selectedValue.toString() ||
              (typeof selectedValue === "number" &&
                Number.parseInt(item) === selectedValue);
            return (
              <div
                key={item}
                className={cn(
                  "h-10 flex items-center justify-center text-2xl p-[0.5px] font-medium transition-all duration-200",
                  "scroll-snap-align-center",
                  isSelected
                    ? "text-foreground scale-110"
                    : "text-muted-foreground scale-90 opacity-60"
                )}
                style={{ scrollSnapAlign: "center" }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
      {/* Selection indicator */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y border-border/20 pointer-events-none" />
      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );

  return (
    <FormItem className={className}>
      <FormControl>
        <div
          className={cn(
            "flex items-center justify-center bg-background ",
            className
          )}
        >
          <div className="flex items-center space-x-4 p-4">
            {use24Hour ? (
              <div className="text-sm bottom-1/2 text-white relative">
                hours
              </div>
            ) : null}
            {/* Hours */}
            <div className="flex flex-col items-center">
              {renderColumn(
                hours,
                use24Hour ? selectedHour : selectedHour,
                handleHourScroll,
                hourRef
              )}
            </div>

            {/* Separator */}
            <div className="text-2xl bottom-[2px] relative text-muted-foreground">
              :
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              {renderColumn(
                minutes,
                selectedMinute,
                handleMinuteScroll,
                minuteRef
              )}
            </div>

            {use24Hour ? (
              <div className="text-sm bottom-1/2 text-muted-foreground relative">
                hours
              </div>
            ) : null}

            {/* AM/PM for 12-hour format */}
            {!use24Hour && (
              <>
                <div className="w-px h-32 bg-border mx-2" />
                <div className="flex flex-col items-center">
                  {renderColumn(
                    periods,
                    selectedPeriod,
                    handlePeriodScroll,
                    periodRef
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </FormControl>
    </FormItem>
  );
}
