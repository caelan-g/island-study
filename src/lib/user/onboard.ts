import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

/**
 * Handles new user onboarding process
 *
 * Process:
 * 1. Updates island settings (threshold)
 * 2. Updates user profile (name, goal)
 * 3. Marks user as onboarded
 *
 * Database updates:
 * - Sets island threshold
 * - Sets user name and goal
 * - Updates onboarding status
 *
 * @param name - User's display name
 * @param goal - Daily study goal in seconds
 * @returns true if successful, undefined if failed
 */
export async function onboardUser(name: string, goal: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data: islandData, error: islandError } = await supabase
        .from("islands")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (islandError) {
        console.error("Error fetching island data:", islandError);
        toast.error("Setup failed. Please try again.");
        return;
      }

      if (islandData) {
        const { error } = await supabase
          .from("islands")
          .update({ threshold: goal })
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error updating island threshold:", error);
          toast.error("Couldn't save your goal. Try again.");
          return;
        }
      }

      const { error } = await supabase
        .from("users")
        .update({ name: name, goal: goal, has_onboarded: true })
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error);
        toast.error("Couldn't save your profile. Refresh.");
        return;
      }

      await supabase.auth.updateUser({
        data: { has_onboarded: true },
      });

      toast.success("Welcome to Islands!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Setup failed. Please refresh.");
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to continue");
  }
}
