"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import TimePicker from "@/components/ui/time-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
//import TimePicker from "@/components/ui/time-picker"; - if or when
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateTimePicker({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Format time string for TimePicker
  const formatTimeString = (date: Date | undefined): string => {
    if (!date) return "12:00 AM";
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle time changes from TimePicker
  const handleTimeChange = (timeString: string) => {
    if (!value) return;

    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    const newDate = new Date(value);
    let adjustedHours = hours;

    // Adjust hours based on AM/PM
    if (period === "PM" && hours !== 12) {
      adjustedHours += 12;
    } else if (period === "AM" && hours === 12) {
      adjustedHours = 0;
    }

    newDate.setHours(adjustedHours);
    newDate.setMinutes(minutes);
    onChange(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (value) {
        newDate.setHours(value.getHours());
        newDate.setMinutes(value.getMinutes());
      }
      onChange(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-row gap-2 p-3">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="border-l my-auto align-middle">
            <TimePicker
              mode="time"
              value={formatTimeString(value)}
              onChange={handleTimeChange}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
