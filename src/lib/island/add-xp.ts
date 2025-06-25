import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

/**
 * Adds experience points (XP) to a user's active island and handles level-up logic
 *
 * Process:
 * 1. Fetches the user's active island
 * 2. Calculates new XP total and potential level ups
 * 3. Updates island data including:
 *    - XP amount
 *    - Island level
 *    - Island images (current, next, previous)
 *
 * Level-up conditions:
 * - XP must exceed threshold
 * - Island level must be less than 7
 * - Next island image must be available
 *
 * @param supabase - Supabase client instance
 * @param userId - User's unique identifier
 * @param duration - Amount of XP to add (in seconds)
 * @param user - Authenticated user object
 * @returns void
 */
export async function addXP(
  supabase: SupabaseClient,
  userId: string,
  duration: number,
  user: User | null
) {
  if (user) {
    // Fetch user's active island
    const { data: island, error: fetchError } = await supabase
      .from("islands")
      .select()
      .eq("user_id", userId)
      .eq("active", true)
      .single();

    if (fetchError) {
      console.error(fetchError);
      toast.error("Failed to fetch island xp. Please try again later.");
      return;
    }

    // Handle level-up logic if not max level
    if (island.level < 7) {
      // Check if new XP total exceeds threshold
      if (island.xp + duration >= island.threshold) {
        let level = island.level;
        let total = duration + island.xp;

        // Calculate new level and remaining XP
        while (total >= island.threshold) {
          level += 1;
          total -= island.threshold;
        }

        // Update island if next evolution is available
        if (island.next_url) {
          const { error } = await supabase
            .from("islands")
            .update({
              xp: total, // Set new XP total
              current_url: island.next_url, // Evolve to next island
              next_url: null, // Clear next evolution
              level: level, // Update level
              previous_urls: [
                // Store previous forms
                ...(island.previous_urls || []),
                island.current_url,
              ],
            })
            .eq("user_id", userId)
            .eq("active", true);

          if (error) {
            console.error(error);
            toast.error("Failed to update island. Please try again later.");
          }
        }
      } else {
        // If no level-up, just add XP
        const { error } = await supabase
          .from("islands")
          .update({ xp: (island?.xp || 0) + duration })
          .eq("user_id", userId)
          .eq("active", true);

        if (error) {
          console.error(error);
          toast.error("Failed to update island xp. Please try again,");
        }
      }
    }
  } else {
    console.error("No user logged in");
    toast.error("No user logged in. Please login to continue.");
  }
  return;
}
