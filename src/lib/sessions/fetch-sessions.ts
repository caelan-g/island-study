import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient();

/**
 * Fetches user's study sessions
 *
 * Process:
 * 1. Verifies user authentication
 * 2. Queries sessions table with optional limit
 * 3. Returns ordered session data
 *
 * Database query:
 * - Matches user_id
 * - Orders by start_time descending
 * - Optional limit parameter
 *
 * @param user - The authenticated user object
 * @param number - Optional limit on number of sessions
 * @returns Array of session objects or undefined
 */
export async function fetchSessions(user: User | null, number?: number) {
  if (!user) {
    toast.error("Please log in to view sessions");
    return;
  }

  try {
    if (number) {
      const { data, error } = await supabase
        .from("sessions")
        .select()
        .eq("user_id", user.id)
        .order("start_time", { ascending: false })
        .limit(number);

      if (error) {
        console.log(error);
        toast.error("Failed to load sessions. Try refreshing.");
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from("sessions")
        .select()
        .eq("user_id", user.id)
        .order("start_time", { ascending: false });

      if (error) {
        console.log(error);
        toast.error("Failed to load sessions. Try refreshing.");
      }
      return data;
    }
  } catch (error) {
    console.error("Session fetch failed:", error);
    toast.error("Can't load sessions. Please refresh.");
    return;
  }
}
