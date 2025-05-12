import { createClient } from "@/lib/supabase/client";
import { UUID } from "crypto";
import { checkSession } from "./check-session";

const supabase = createClient();

export const endSession = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const active = await checkSession();
      if (active) {
        const { data, error } = await supabase
          .from("sessions")
          .update({ end_time: new Date().toISOString() })
          .eq("id", active.id);

        if (error) {
          console.log(error);
        }
      } else {
        console.log("no session active");
      }
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
};
