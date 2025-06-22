"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/onboarding/step-indicator";
import NameStep from "@/components/onboarding/steps/name-step";
import GoalStep from "@/components/onboarding/steps/goal-step";
import CoursesStep from "@/components/onboarding/steps/courses-step";
import CompletionStep from "@/components/onboarding/steps/completion-step";
import { onboardUser } from "@/lib/user/onboard";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  goal: z
    .number()
    .min(1200, "Please set at least a 20 minute goal")
    .max(46800, "Maximum goal is 13 hours ~ you need to live as well!"),

  // Account Info
  hasCourse: z.boolean().refine((val) => val === true, {
    message: "You must create at least one course",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Name",
      validationFields: ["name"],
    },
    {
      title: "Goal",
      validationFields: ["goal"],
    },
    {
      title: "Courses",
      validationFields: ["hasCourse"],
    },
    { title: "Complete", validationFields: [] },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      goal: 3600,
      hasCourse: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await onboardUser(data.name, data.goal);
      // Force a hard navigation to ensure state is refreshed
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error("Failed to complete onboarding");
    }
  };

  const goToNextStep = async () => {
    const currentStepFields = steps[currentStep].validationFields;

    // Validate only the fields for the current step
    const result = await form.trigger(
      currentStepFields as Array<keyof FormValues>
    );

    if (result) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    // Only allow going to steps that are less than or equal to the current step
    // This prevents skipping ahead without validation
    if (step <= currentStep || form.formState.isValid) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <NameStep form={form} />;
      case 1:
        return <GoalStep form={form} />;
      case 2:
        return <CoursesStep form={form} />;
      case 3:
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex items-center ">
      <Card className="w-lg h-auto mx-auto my-auto ">
        <CardHeader>
          <StepIndicator
            steps={steps.map((step) => step.title)}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </CardHeader>
        <Form {...form}>
          <form
            className="mt-8 space-y-6 h-full flex flex-col justify-between"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                goToNextStep();
              }
            }}
          >
            <CardContent className="flex-1">{renderStepContent()}</CardContent>

            <CardFooter className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" className="w-full" onClick={goToNextStep}>
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  Complete
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
