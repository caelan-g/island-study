import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Updates the creation date of user's active island to 7 days ago
 *
 * Process:
 * 1. Calculates date from 7 days ago
 * 2. Updates active island's created_at date
 * 3. Returns updated island data
 *
 * Database update:
 * - Sets created_at to 7 days ago
 * - Only updates active island
 * - Matches user_id and active=true
 *
 * Error handling:
 * - Shows toast notifications
 * - Logs errors to console
 * - Returns undefined on error
 *
 * @param user - The authenticated user object
 * @returns The updated island data or undefined
 */
export async function weekEndIsland(user: User | null) {
  if (user) {
    try {
      // Get date from 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Update the active island's created_at date
      const { data, error } = await supabase
        .from("islands")
        .update({
          created_at: sevenDaysAgo.toISOString(),
        })
        .eq("user_id", user.id)
        .eq("active", true);

      if (error) {
        console.log(error);
        toast.error("Failed to update island. Try again.");
      } else {
        toast.success("Island week completed");
      }
      return data;
    } catch (error) {
      console.error("Error updating island date:", error);
      toast.error("Something went wrong. Please refresh.");
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to update island");
  }
}
