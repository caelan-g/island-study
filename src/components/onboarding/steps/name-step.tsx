"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/components/types/onboarding";

export default function NameStep({ form }: StepProps) {
  return (
    <>
      <h2 className="text-md tracking-tight">Welcome to Islands</h2>
      <h2 className="text-xl font-semibold tracking-tight">
        What&apos;s your name?
      </h2>
      <div className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs font-bold">Name</Label>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
