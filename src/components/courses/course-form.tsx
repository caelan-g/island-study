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

interface CourseFormProps {
  onSuccess?: () => void;
  parentForm?: boolean; // Add this prop
}

export function CourseForm({ onSuccess, parentForm = false }: CourseFormProps) {
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
    defaultValues: {
      name: "",
      colour: "",
    },
  });

  async function onSubmit(values: z.infer<typeof courseSchema>) {
    try {
      await createCourse(values.name, values.colour, authUser);
      form.reset(); // Reset form after successful submission
      onSuccess?.(); // Call the callback if provided
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  }
  return (
    <>
      {parentForm ? (
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a colour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Colours</SelectLabel>
                      {colours.map((colour) => (
                        <SelectItem value={colour.colour} key={colour.name}>
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
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
            Create Course
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grow">
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a colour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Colours</SelectLabel>
                          {colours.map((colour) => (
                            <SelectItem value={colour.colour} key={colour.name}>
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

            <Button type="submit">Create</Button>
          </form>
        </Form>
      )}
    </>
  );
}
