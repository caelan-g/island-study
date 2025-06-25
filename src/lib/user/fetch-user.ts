import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Fetches user data from the Supabase database
 * @param user - The authenticated user object from Supabase Auth
 * @returns The user data from the database or null if no user is logged in
 *
 * This function:
 * 1. Checks if a user is authenticated
 * 2. Queries the users table for the user's data
 * 3. Returns the user data or null
 *
 * Error handling:
 * - Logs database errors to console
 * - Shows toast notification if no user is logged in
 * - Returns null on failure
 */
export const fetchUser = async (user: User | null | null) => {
  if (user) {
    try {
      // Query users table for authenticated user's data
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error);
      }
      return data;
    } catch (err) {
      // Log any unexpected errors
      console.error(err);
      toast.error(
        "An error occurred while fetching user data. Please try again."
      );
      return;
    }
  } else {
    // Show error if no user is authenticated
    toast.error("No user logged in. Please login to continue.");
    return null;
  }
};
