import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Fetches all islands belonging to a user
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Queries islands table for all user's islands
 * 3. Returns array of island data or undefined
 *
 * Database query:
 * - Matches user_id with authenticated user
 * - Returns all matching islands
 * - No filtering or sorting applied
 *
 * Error handling:
 * - Shows toast notifications for errors
 * - Logs database errors to console
 * - Returns undefined on any error
 *
 * @param user - The authenticated user object from Supabase Auth
 * @returns Array of island data or undefined if error occurs
 */
export async function fetchIslands(user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("islands")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to fetch islands");
        return;
      }
      return data;
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong while fetching islands");
      return;
    }
  } else {
    console.log("No user logged in");
    toast.error("Please log in to view islands");
    return;
  }
}
