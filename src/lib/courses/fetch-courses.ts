import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Fetches all courses for a user
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Queries courses table for all user's courses
 * 3. Returns array of courses sorted alphabetically
 *
 * Database query:
 * - Matches user_id with authenticated user
 * - Orders results by course name ascending
 * - Returns all matching courses
 *
 * Error handling:
 * - Shows toast notifications for errors
 * - Logs database errors to console
 * - Returns undefined on any error
 *
 * @param user - The authenticated user object from Supabase Auth
 * @returns Array of course data or undefined if error occurs
 */
export async function fetchCourses(user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select()
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (error) {
        console.log(error);
        toast.error("Failed to fetch courses. Please try again later.");
      }
      return data;
    } catch {
      toast.error(
        "Something went wrong while fetching courses. Try again later."
      );
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to view courses");
  }
}
