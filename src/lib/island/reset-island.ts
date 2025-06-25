import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Resets the active state of a user's island
 *
 * Process:
 * 1. Finds user's active island
 * 2. Sets active state to false
 * 3. Returns updated island data
 *
 * Database update:
 * - Updates active field to false
 * - Matches user_id and active=true
 * - Returns modified island data
 *
 * Error handling:
 * - Shows toast notifications
 * - Logs errors to console
 * - Returns undefined on error
 *
 * @param user - The authenticated user object
 * @returns The updated island data or undefined
 */
export async function resetIsland(user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("islands")
        .update({ active: false })
        .eq("user_id", user.id)
        .eq("active", true);

      if (error) {
        console.log(error);
        toast.error("Failed to reset island. Try again.");
      } else {
        toast.success("Island reset complete");
      }
      return data;
    } catch {
      toast.error("Something went wrong. Please refresh.");
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to reset island");
  }
}
