import { createClient } from "@/lib/supabase/client";
import { sessionProps } from "@/components/types/session";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient();

/**
 * Deletes a study session
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Deletes specified session
 * 3. Returns deleted session data
 *
 * Database delete:
 * - Matches session id
 * - Returns deleted session
 *
 * @param session - The session to delete
 * @param user - The authenticated user object
 * @returns Deleted session data or undefined
 */
export async function deleteSession(session: sessionProps, user: User | null) {
  if (!user) {
    toast.error("Please log in to delete sessions");
    return;
  }

  try {
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", session.id)
      .single();

    if (error) {
      console.log(error);
      toast.error("Failed to delete session. Try again.");
    }
  } catch (error) {
    console.error("Session deletion failed:", error);
    toast.error("Can't delete session. Please try again.");
    return;
  }
}
