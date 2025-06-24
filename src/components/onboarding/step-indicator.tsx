"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="relative w-full">
      <div className="flex items-center justify-between w-full gap-2">
        {steps.map((step, index) => (
          <div key={index} className="items-center w-full">
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                "z-10 flex w-full items-center justify-center transition-all",
                currentStep >= index ? "cursor-pointer" : "cursor-default"
              )}
            >
              <Progress
                className="w-full [&>div]:bg-primary]"
                value={currentStep >= index ? 100 : 0}
              />
            </button>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{
            y: 20,
            opacity: 0,
            scale: 1,
          }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}
          exit={{
            y: -20,
            opacity: 0,
            scale: 1.2,
            transition: {
              duration: 0.2,
            },
          }}
          className="relative"
        >
          <Image
            src={`/images/onboarding/step-${currentStep + 1}.png`}
            alt={`Step ${currentStep + 1}`}
            width={128}
            height={64}
            className="w-72 mx-auto h-auto mt-4 floating pixelated"
            unoptimized
          />
          <motion.div
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5 }}
            className="bg-primary/20 rounded-full blur-2xl pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
