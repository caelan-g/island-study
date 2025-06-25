import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient();
/**
 * Checks for an active session for the user
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Queries for sessions with no end time
 * 3. Returns active session or false
 *
 * Database query:
 * - Matches user_id
 * - Checks for null end_time
 * - Returns single active session
 *
 * @param user - The authenticated user object
 * @returns Active session object or false
 */
export const checkSession = async (user: User | null) => {
  if (!user) {
    toast.error("Please log in first");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .is("end_time", null);

    if (error) {
      console.log(error);
      toast.error("Failed to check session. Try refreshing.");
    }
    // Check if there is an active session
    if (data && data.length > 0) {
      return data[0];
    } else {
      return false;
    }
  } catch (error) {
    console.error("Session check failed:", error);
    toast.error("Can't check session. Please refresh.");
    return;
  }
};
