"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { endSession } from "@/lib/sessions/end-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect, useCallback } from "react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { checkSession } from "@/lib/sessions/check-session";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { useAuth } from "@/contexts/auth-context";
import { useSubscription } from "@/contexts/subscription-context";

type ActiveSession = {
  start_time: string;
  end_time: string;
  course_id: string; // Assuming course_id is part of the active session
  // Add other session fields if needed
};

type SessionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: courseProps[]; // Array of courses to select from
  sessionProps?: sessionProps; // Optional, if you want to pass session data
  onSubmitSuccess?: () => void;
};

//add sessionProps then add an if statement if theres session to show extra buttons/different text - do same for courses form

export function SessionDialog({
  open,
  onOpenChange,
  courses,
  sessionProps,
  onSubmitSuccess,
}: SessionDialogProps) {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null
  );
  const { user: authUser } = useAuth();
  const { subscriptionStatus, endDate, subscriptionLoading } =
    useSubscription();

  useEffect(() => {
    const checkForActiveSession = async () => {
      try {
        const active = await checkSession(authUser);
        if (active) {
          setActiveSession(active);
        } else {
          setActiveSession(null);
        }
      } catch (error) {
        console.error("Error checking for active session:", error);
        setActiveSession(null);
      }
    };

    if (!sessionProps && open) {
      checkForActiveSession();
    }
  }, [open, sessionProps, authUser]);

  const sessionSchema = z.object({
    description: z
      .string()
      .max(50, {
        message: "Description is too long!",
      })
      .optional(),
    course: z
      .string()
      .refine((val) => courses.some((course) => course.id === val), {
        message: "Please select a valid course",
      }),
    startTime: z.date(),
    endTime: z.date(),
  });

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(
      sessionSchema.refine((data) => data.startTime < data.endTime, {
        message: "Start time must be before end time",
        path: ["endTime"],
      })
    ),
    defaultValues: sessionProps
      ? {
          description: sessionProps.description || "",
          course: sessionProps.course_id || "",
          startTime: new Date(sessionProps.start_time),
          endTime: new Date(sessionProps.end_time),
        }
      : {
          description: "",
          course: "",
          startTime: new Date(),
          endTime: new Date(),
        },
  });

  // Move form reset logic to a separate function
  const resetFormWithCurrentTime = useCallback(() => {
    if (!sessionProps) {
      if (activeSession) {
        form.reset({
          description: "",
          course: activeSession.course_id,
          startTime: new Date(activeSession.start_time),
          endTime: new Date(), // Current time
        });
      } else {
        const now = new Date();
        form.reset({
          description: "",
          course: "",
          startTime: now,
          endTime: now,
        });
      }
    } else {
      form.reset({
        description: sessionProps.description || "",
        course: sessionProps.course_id || "",
        startTime: new Date(sessionProps.start_time),
        endTime: new Date(sessionProps.end_time),
      });
    }
  }, [form, activeSession, sessionProps]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetFormWithCurrentTime();
    }
  }, [open, resetFormWithCurrentTime]);

  async function onSubmit(values: z.infer<typeof sessionSchema>) {
    try {
      if (
        await endSession(
          sessionProps ? sessionProps.id : "",
          values.startTime,
          values.endTime,
          values.course,
          authUser,
          subscriptionStatus,
          values.description
        )
      ) {
        // Only call onSubmitSuccess if the endSession was successful
        if (onSubmitSuccess) {
          const sound = "/sounds/quick-tone.mp3";
          new Audio(sound).play();
          onSubmitSuccess();
        }
        form.reset();
        onOpenChange(false);
      } else {
        const sound = "/sounds/error-tone.mp3";
        new Audio(sound).play();
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-50">
        <Form {...form}>
          <DialogHeader>
            {sessionProps ? (
              <>
                <DialogTitle>Edit your study session</DialogTitle>
                <DialogDescription>
                  Modify the details of your study session.
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Add your study session</DialogTitle>
                <DialogDescription>
                  Fill in the details of your study session to keep track of
                  your progress.
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="description" className="text-xs font-bold">
                      Description
                    </Label>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="course" className="text-xs font-bold">
                      Course
                    </Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="min-w-[300px]">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent className="z-100">
                        <SelectGroup>
                          <SelectLabel>Courses</SelectLabel>
                          {courses.map((course) => (
                            <SelectItem value={course.id} key={course.id}>
                              <div
                                className="size-4 rounded-sm"
                                style={{ backgroundColor: course.colour }}
                              />
                              <span>{course.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field: startField }) => (
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field: endField }) => (
                      <FormItem>
                        <Label className="text-xs font-bold">Duration</Label>
                        <div className="flex lg:flex-row flex-col gap-2">
                          <DateTimePicker
                            value={startField.value}
                            onChange={(date) => startField.onChange(date)}
                          />
                          <span className="text-xs font-bold my-auto align-middle">
                            to
                          </span>
                          <DateTimePicker
                            value={endField.value}
                            onChange={(date) => endField.onChange(date)}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" className="w-full">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" className="w-full">
                {sessionProps ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
