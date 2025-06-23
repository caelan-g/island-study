"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
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
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { useAuth } from "@/contexts/auth-context";
import { deleteSession } from "@/lib/sessions/delete-session";
import { Check, Trash } from "lucide-react";

type SessionDialogProps = {
  courses: courseProps[]; // Array of courses to select from
  sessionProps: sessionProps | null; // Optional, if you want to pass session data
  onSubmitSuccess?: () => void;
};

//add sessionProps then add an if statement if theres session to show extra buttons/different text - do same for courses form

export function EditSessionCard({
  courses,
  sessionProps,
  onSubmitSuccess,
}: SessionDialogProps) {
  const { user: authUser } = useAuth();

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

  const resetFormWithCurrentTime = useCallback(() => {
    if (!sessionProps) {
      const now = new Date();
      form.reset({
        description: "",
        course: "",
        startTime: now,
        endTime: now,
      });
    } else {
      form.reset({
        description: sessionProps.description || "",
        course: sessionProps.course_id || "",
        startTime: new Date(sessionProps.start_time),
        endTime: new Date(sessionProps.end_time),
      });
    }
  }, [form, sessionProps]);

  // Reset form when session gets selected
  useEffect(() => {
    resetFormWithCurrentTime();
  }, [sessionProps, resetFormWithCurrentTime]);

  async function onSubmit(values: z.infer<typeof sessionSchema>) {
    try {
      await endSession(
        sessionProps ? sessionProps.id : "",
        values.startTime,
        values.endTime,
        values.course,
        authUser,
        values.description
      );
      // Only call onSubmitSuccess if the endSession was successful
      if (onSubmitSuccess) {
        onSubmitSuccess();
        console.log("Session ended successfully");
        toast.success("Session ended successfully");
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }

  const handleDelete = async () => {
    try {
      if (!sessionProps) {
        toast.error("No session selected to delete");
        return;
      }
      await deleteSession(sessionProps, authUser);
      toast.success("Session deleted");
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session");
    }
  };

  return (
    <Card className="w-lg mb-auto align-top">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onClick={(e) => e.stopPropagation()}
        >
          <CardContent>
            {sessionProps ? (
              <CardHeader className="px-0">
                <CardTitle>Edit your study session</CardTitle>
                <CardDescription>
                  Modify the details of your study session.
                </CardDescription>
              </CardHeader>
            ) : (
              <CardHeader className="px-0">
                <CardTitle>Select a study session to edit</CardTitle>
                <CardDescription>
                  Fill in the details of your study session to keep track of
                  your progress.
                </CardDescription>
              </CardHeader>
            )}

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
                        <div className="flex gap-2">
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
          </CardContent>
          <CardFooter className="flex justify-between gap-2 w-full">
            {sessionProps ? (
              <>
                <Button type="submit" className="w-full">
                  <Check />
                  Save
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete()}
                >
                  <Trash />
                  Delete
                </Button>
              </>
            ) : null}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
