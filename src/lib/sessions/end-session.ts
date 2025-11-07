import { createClient } from "@/lib/supabase/client";
import { checkSession } from "./check-session";
import { toast } from "sonner";
import { addXP } from "@/lib/island/add-xp";
import { User } from "@supabase/supabase-js";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Ends or updates a study session
 *
 * Process:
 * 1. Calculates session duration
 * 2. Updates existing session or creates new one
 * 3. Adds XP based on duration
 *
 * Database operations:
 * - Updates session if session_id provided
 * - Updates active session if exists
 * - Creates new session if no active session
 *
 * @param session_id - Optional ID of session to update
 * @param start_time - Session start time
 * @param end_time - Session end time
 * @param course_id - Course ID for the session
 * @param user - Authenticated user object
 * @param description - Optional session description
 */
export async function endSession(
  session_id: string,
  start_time: Date,
  end_time: Date,
  course_id: string,
  user: User | null,
  subscriptionStatus: string | null,
  description?: string
) {
  if (user) {
    if (subscriptionStatus == "active" || subscriptionStatus == "trialing") {
      try {
        const duration = Math.floor(
          (new Date(end_time).getTime() - new Date(start_time).getTime()) / 1000
        );
        const active = await checkSession(user);
        if (session_id !== "") {
          const { error } = await supabase
            .from("sessions")
            .update({
              start_time: new Date(start_time).toISOString(),
              end_time: new Date(end_time).toISOString(),
              description: description,
              course_id: course_id,
            })
            .eq("id", session_id);

          if (error) {
            console.log(error);
            toast.error("Failed to save session. Try again.");
            return false;
          } else {
            toast.success("Session saved");
            return true;
          }
        }
        if (active) {
          const { error } = await supabase
            .from("sessions")
            .update({
              start_time: new Date(start_time).toISOString(),
              end_time: new Date(end_time).toISOString(),
              description: description,
              course_id: course_id,
            })
            .eq("id", active.id);

          if (error) {
            console.log(error);
            toast.error("Failed to save session. Try again.");
            return false;
          } else {
            toast.success("Session saved");
            return true;
          }
        } else {
          const { error } = await supabase.from("sessions").insert({
            user_id: user.id,
            start_time: new Date(start_time).toISOString(),
            end_time: new Date(end_time).toISOString(),
            description: description,
            course_id: course_id,
          });

          if (error) {
            console.log(error);
            toast.error("Failed to save session. Try again.");
            return false;
          } else {
            toast.success("Session created");
          }
        }
        await addXP(supabase, user.id, duration, user);
        return true;
      } catch (error) {
        console.error("Session end failed:", error);
        toast.error("Can't save session. Please refresh.");
        return false;
      }
    } else {
      toast.error("You need an active subscription to save sessions.");
      return false;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to save sessions");
    return false;
  }
}
