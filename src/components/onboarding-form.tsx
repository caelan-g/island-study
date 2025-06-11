"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/step-indicator";
import NameStep from "@/components/steps/name-step";
import GoalStep from "@/components/steps/goal-step";
import CoursesStep from "@/components/steps/courses-step";
import CompletionStep from "@/components/steps/completion-step";
import { onboardUser } from "@/lib/user/onboard";

// Define the schema for the entire form
const formSchema = z.object({
  //name
  //goal
  //courses
  //submit
  // Personal Info
  name: z.string().min(2, "First name must be at least 2 characters"),
  goal: z
    .number()
    .min(1200, "Please set at least a 20 minute goal")
    .max(89940, "Maximum goal is 12 hours ~ you need to live as well!"),

  // Account Info
  hasCourse: z.boolean().refine((val) => val === true, {
    message: "You must create at least one course",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Name Step",
      validationFields: ["name"],
    },
    {
      title: "Goal Step",
      validationFields: ["goal"],
    },
    {
      title: "Course Setup",
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

  const onSubmit = (data: FormValues) => {
    onboardUser(data.name, data.goal);
    window.location.href = "/dashboard";
    return;
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
    <div className="rounded-lg border bg-card p-6 shadow-sm w-[30em] min-h-[30em] mx-auto mt-24">
      <StepIndicator
        steps={steps.map((step) => step.title)}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      <Form {...form}>
        <form className="mt-8 space-y-6 h-full flex flex-col justify-between">
          {renderStepContent()}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
            >
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={goToNextStep}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                Complete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
