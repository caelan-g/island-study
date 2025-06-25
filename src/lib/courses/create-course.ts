import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Creates a new course for a user
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Inserts new course into courses table
 * 3. Handles errors with toast notifications
 *
 * Database insert:
 * - Sets user_id from authenticated user
 * - Sets course name and colour from parameters
 * - Creates single course entry
 *
 * Error handling:
 * - Shows toast notifications for errors
 * - Logs database errors to console
 * - Returns early on authentication failure
 *
 * @param name - The name of the course
 * @param colour - The colour code for the course
 * @param user - The authenticated user object from Supabase Auth
 * @returns void
 */
export const createCourse = async (
  name: string,
  colour: string,
  user: User | null
) => {
  if (!user) {
    console.error("No user logged in");
    toast.error("Please log in to create a course");
    return;
  }

  try {
    const { error } = await supabase
      .from("courses")
      .insert({ user_id: user.id, name, colour });

    if (error) {
      console.error("Failed to create course:", error);
      toast.error("Failed to create course");
      return;
    }

    toast.success("Course created successfully");
  } catch (error) {
    console.error("Unexpected error creating course:", error);
    toast.error("Something went wrong while creating the course");
  }
};
