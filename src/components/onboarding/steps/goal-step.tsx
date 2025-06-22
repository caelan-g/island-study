"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TimePicker from "@/components/ui/time-picker";
import { StepProps } from "@/components/types/onboarding";

// Helper function to convert seconds to HH:mm format
const secondsToTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Helper function to convert HH:mm format to seconds
const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};

export default function GoalStep({ form }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        How much do you aim to study each day?
      </h2>

      <div className="py-4">
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TimePicker
                  mode="duration"
                  value={secondsToTimeString(field.value)}
                  onChange={(value) => {
                    field.onChange(timeStringToSeconds(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
