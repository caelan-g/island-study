"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TimePicker from "@/components/ui/time-picker";
import { StepProps } from "@/components/types/onboarding";

export default function GoalStep({ form }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        How much do you aim to study each day?
      </h2>
      <p className="text-sm text-muted-foreground">
        You can change this later...
      </p>

      <div className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TimePicker use24Hour={true} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
