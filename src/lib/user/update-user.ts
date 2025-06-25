import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient();

/**
 * Updates user profile information
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Updates user name and goal
 * 3. Handles errors with notifications
 *
 * Database update:
 * - Updates name and goal fields
 * - Matches user by id
 * - Single row update
 *
 * @param id - User's unique identifier
 * @param name - New display name
 * @param goal - New daily study goal in seconds
 * @param user - Authenticated user object
 * @returns void
 */
export const updateUser = async (
  id: string,
  name: string,
  goal: number,
  user: User | null
) => {
  if (user) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ name: name, goal: goal })
        .eq("id", id);

      if (error) {
        console.log(error);
        toast.error("Failed to update profile. Try again.");
      } else {
        toast.success("Profile updated");
      }
    } catch {
      toast.error("Can't save changes. Please refresh.");
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to update profile");
  }
};
