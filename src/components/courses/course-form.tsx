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
import { createCourse } from "@/lib/courses/create-course";
import { useAuth } from "@/contexts/auth-context";
import { z } from "zod";
import { courseSchema, colours } from "@/components/types/course";

interface CourseFormProps {
  onSuccess?: () => void;
  parentForm?: boolean; // Add this prop
}

export function CourseForm({ onSuccess, parentForm = false }: CourseFormProps) {
  const { user: authUser } = useAuth();

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
          <Button
            type="button"
            variant="accent"
            onClick={form.handleSubmit(onSubmit)}
            className="mt-4"
          >
            Create
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
