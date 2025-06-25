import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Supabase client instance for database operations
 */
const supabase = createClient();

/**
 * Fetches total study time for user
 *
 * Process:
 * 1. Fetches all user sessions
 * 2. Calculates total study time
 * 3. Calculates today's study time
 *
 * Time calculations:
 * - Total: Sum of all session durations
 * - Today: Sessions since start of current day
 * - All times converted to seconds
 *
 * @param user - The authenticated user object
 * @returns Object with total and today's study time
 */
export const fetchTotal = async (user: User | null) => {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("start_time, end_time, course_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to load study time. Try refreshing.");
        return 0;
      }
      if (!data) return 0;

      const studyTime = { total: 0, today: 0 };
      for (let i = 0; i < data.length; i++) {
        // Convert timestamptz strings to Date objects and calculate difference in milliseconds
        const startDate = new Date(data[i].start_time);
        const endDate = new Date(data[i].end_time);
        studyTime["total"] += (endDate.getTime() - startDate.getTime()) / 1000; // Convert to seconds
      }
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      for (let i = 0; i < data.length; i++) {
        const startDate = new Date(data[i].start_time);
        const endDate = new Date(data[i].end_time);
        if (startDate >= startOfDay) {
          if (endDate > startDate) {
            studyTime["today"] +=
              (endDate.getTime() - startDate.getTime()) / 1000; // Convert to seconds
          }
        }
      }

      return studyTime;
    } catch (error) {
      console.error("Failed to fetch total:", error);
      toast.error("Can't load study time. Please refresh.");
      return;
    }
  } else {
    console.log("no user logged in");
    toast.error("Please log in to view stats");
  }
};
