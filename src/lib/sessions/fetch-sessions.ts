import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function fetchSessions(user: User | null, number?: number) {
  if (user) {
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
        }
        return data;
      }
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
