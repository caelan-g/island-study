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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCourse } from "@/lib/courses/create-course";
import { useAuth } from "@/contexts/auth-context";
import { courseProps } from "@/components/types/course";
import { useEffect } from "react";
import { updateCourse } from "@/lib/courses/update-course";
import { toast } from "sonner";

export function CourseDialog({
  open,
  onOpenChange,
  onSubmitSuccess,
  course,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: () => void;
  course: courseProps | null;
}) {
  const { user: authUser } = useAuth();
  const colours = [
    { name: "Blue", colour: "#AEC6CF" },
    { name: "Green", colour: "#B2F2BB" },
    { name: "Yellow", colour: "#FFFACD" },
    { name: "Pink", colour: "#FFB6C1" },
    { name: "Purple", colour: "#D7BDE2" },
    { name: "Orange", colour: "#FFDAB9" },
    { name: "Mint", colour: "#AAF0D1" },
    { name: "Lavender", colour: "#E6E6FA" },
    { name: "Coral", colour: "#F7CAC9" },
    { name: "Teal", colour: "#B2DFDB" },
  ];

  const colourHexValues = colours.map((c) => c.colour);

  const courseSchema = z.object({
    name: z
      .string()
      .min(3, {
        message: "Username must be at least 2 characters.",
      })
      .max(50),
    colour: z.string().refine((val) => colourHexValues.includes(val), {
      message: "Please select a valid colour",
    }),
  });

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          name: course.name,
          colour: course.colour,
        }
      : {
          name: "",
          colour: "",
        },
  });

  async function onSubmit(values: z.infer<typeof courseSchema>) {
    if (course === null) {
      try {
        await createCourse(values.name, values.colour, authUser);
      } catch (error) {
        toast.error("Failed to create course");
        console.error("Error creating course:", error);
        return; // Exit early if there's an error
      }
    } else {
      try {
        await updateCourse(course.id, values.name, values.colour, authUser);
      } catch (error) {
        toast.error("Failed to update course");
        console.error("Error updating course:", error);
        return; // Exit early if there's an error
      }
    }

    onOpenChange(false);
    if (onSubmitSuccess) {
      toast.success("Successfully updated courses");
      onSubmitSuccess(); // Call the callback after successful submission
    }
  }

  useEffect(() => {
    if (course === null) {
      form.reset({
        name: "",
        colour: "",
      });
    } else {
      form.reset({
        name: course.name,
        colour: course.colour,
      });
    }
  }, [form, course]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <DialogHeader>
              <DialogTitle>
                {course ? "Edit your course" : "Create a new course"}
              </DialogTitle>
              <DialogDescription>
                Make a new course to allocate study time towards.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name" className="text-xs font-bold">
                        Name
                      </Label>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colour"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="colour" className="text-xs font-bold">
                        Colour
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a colour" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Colours</SelectLabel>
                            {colours.map((colour) => (
                              <SelectItem
                                value={colour.colour}
                                key={colour.name}
                              >
                                <div
                                  className="size-4 rounded-sm"
                                  style={{ backgroundColor: colour.colour }}
                                />
                                <span>{colour.name}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary" className="w-full">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" className="w-full">
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
