"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                currentStep >= index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              )}
              aria-current={currentStep === index ? "step" : undefined}
            >
              {index + 1}
            </button>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                currentStep >= index
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Progress line */}
      <div className="absolute left-0 top-5 -z-0 h-0.5 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
