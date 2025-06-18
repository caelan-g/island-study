import { createClient } from "@/lib/supabase/client";
import { checkSession } from "./check-session";
import { User } from "@supabase/supabase-js";

const supabase = createClient();
export const startSession = async (course_id: string, user: User | null) => {
  if (user) {
    const active = await checkSession(user);
    if (!active.start_time) {
      try {
        const { error } = await supabase
          .from("sessions")
          .insert({ user_id: user.id, course_id: course_id });

        if (error) {
          console.log(error);
        }
      } catch {
        return;
      }
    } else {
      console.log("session already active");
    }
  } else {
    console.log("no user logged in");
  }
};
