import type { UseFormReturn } from "react-hook-form";

export type StepProps = {
  form: UseFormReturn<{
    name: string;
    goal: number;
    hasCourse: boolean;
  }>;
};
