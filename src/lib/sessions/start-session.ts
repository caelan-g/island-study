import { createClient } from "@/lib/supabase/client";
import { checkSession } from "./check-session";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient();
/**
 * Starts a new study session
 *
 * Process:
 * 1. Checks for existing active session
 * 2. Creates new session if none active
 * 3. Links session to course
 *
 * Database insert:
 * - Sets user_id and course_id
 * - Creates new session entry
 *
 * @param course_id - The course to study
 * @param user - The authenticated user object
 */
export const startSession = async (course_id: string, user: User | null) => {
  if (!user) {
    toast.error("Please log in to start studying");
    return;
  }

  const active = await checkSession(user);
  if (active && active.start_time) {
    console.log("Session already active");
    return;
  }

  try {
    const { error } = await supabase
      .from("sessions")
      .insert({ user_id: user.id, course_id: course_id });

    if (error) {
      console.log(error);
      toast.error("Failed to start session. Try again.");
    }
  } catch (error) {
    console.error("Session start failed:", error);
    toast.error("Can't start session. Please try again.");
    return;
  }
};
