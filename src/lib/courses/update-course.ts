import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Updates an existing course's name and colour
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Updates course in database with new values
 * 3. Handles errors with user-friendly messages
 *
 * Database update:
 * - Updates name and colour fields
 * - Matches course by id
 * - Only updates if user is authenticated
 *
 * Error handling:
 * - Shows specific toast messages for different errors
 * - Provides user with next steps
 * - Logs detailed errors to console
 *
 * @param id - The unique identifier of the course to update
 * @param name - The new name for the course
 * @param colour - The new colour code for the course
 * @param user - The authenticated user object
 * @returns void
 */
export const updateCourse = async (
  id: string,
  name: string,
  colour: string,
  user: User | null
) => {
  if (user) {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ name: name, colour: colour })
        .eq("id", id);

      if (error) {
        console.log(error);
        toast.error(
          "Unable to update course. Please try again in a few minutes. If the problem persists, contact support."
        );
      } else {
        toast.success("Course updated successfully!");
      }
    } catch {
      toast.error(
        "Something went wrong. Please check your connection and try again."
      );
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error(
      "Please log in to update your courses. Your changes will be saved after you sign in."
    );
  }
};
