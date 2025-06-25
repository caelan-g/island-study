import { createClient } from "@/lib/supabase/client";
import { courseProps } from "@/components/types/course";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Deletes a course from the database
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Deletes course from database
 * 3. Returns deleted course data
 *
 * Database operation:
 * - Deletes single course by id
 * - Requires user authentication
 * - Returns deleted course data
 *
 * @param course - The course object to delete
 * @param user - The authenticated user object
 * @returns The deleted course data or undefined
 */
export async function deleteCourse(course: courseProps, user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .delete()
        .eq("id", course.id)
        .single();

      if (error) {
        console.log(error);
        toast.error("Failed to delete course. Please try again.");
      } else {
        toast.success("Course deleted successfully");
      }
      return data;
    } catch {
      toast.error("Something went wrong. Try refreshing.");
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to delete courses");
  }
}
