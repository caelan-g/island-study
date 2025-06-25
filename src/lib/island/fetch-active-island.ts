import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Fetches the currently active island for a user
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Queries islands table for user's active island
 * 3. Returns island data or null if not found
 *
 * Database query conditions:
 * - Matches user_id with authenticated user
 * - Island must have active = true
 * - Expects only one active island (single())
 *
 * Error handling:
 * - Logs database errors to console
 * - Returns undefined on any error
 * - Logs authentication status
 *
 * @param user - The authenticated user object from Supabase Auth
 * @returns The active island data or undefined if not found/error
 */
export async function fetchActiveIsland(user: User | null) {
  if (user) {
    try {
      // Query for user's active island
      const { data, error } = await supabase
        .from("islands")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true)
        .single();

      if (error) {
        console.log(error);
      }
      return data;
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("No user logged in. Please login to continue.");
    return undefined;
  }
}
