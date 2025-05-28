"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchCourses } from "@/hooks/courses/fetch-courses";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEndSession } from "@/hooks/sessions/end-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { start } from "repl";
import { useState, useEffect } from "react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useCheckSession } from "@/hooks/sessions/check-session";
import { Toaster } from "sonner";

type ActiveSession = {
  start_time: string;
  end_time: string;
  course_id: string; // Assuming course_id is part of the active session
  // Add other session fields if needed
};

type SessionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SessionDialog({ open, onOpenChange }: SessionDialogProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null
  );

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
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      description: "",
      course: "",
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  useEffect(() => {
    if (activeSession) {
      console.log("Active session:", activeSession); // Debug log
      form.reset({
        ...form.getValues(),
        startTime: new Date(activeSession.start_time),
        endTime: new Date(), // Set end time to current time
        course: activeSession.course_id || "", // Assuming course_id is part of activeSession
      });
    }
  }, [activeSession, form]);

  useEffect(() => {
    if (open && !activeSession) {
      form.setValue("startTime", new Date());
    }
    form.setValue("endTime", new Date());
  }, [open, form]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [active, courseData] = await Promise.all([
          useCheckSession(),
          useFetchCourses(),
        ]);

        if (courseData) setCourses(courseData);
        if (active) {
          console.log("Setting active session:", active); // Debug log
          setActiveSession(active);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    initializeData();
  }, []);

  function onSubmit(values: z.infer<typeof sessionSchema>) {
    useEndSession(
      values.startTime,
      values.endTime,
      values.course, // This is already the course ID from the Select component
      values.description
    );
    onOpenChange(false); // Close the dialog
    //window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Add your study session</DialogTitle>
            <DialogDescription>
              Fill in the details of your study session to keep track of your
              progress.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent className="z-100">
                        <SelectGroup>
                          <SelectLabel>Courses</SelectLabel>
                          {courses.map((course) => (
                            <SelectItem value={course.id} key={course.name}>
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
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="startTime" className="text-xs font-bold">
                      Start Time
                    </Label>
                    <DateTimePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="endTime" className="text-xs font-bold">
                      End Time
                    </Label>
                    <DateTimePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Create</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
