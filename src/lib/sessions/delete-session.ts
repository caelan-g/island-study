import { createClient } from "@/lib/supabase/client";
import { sessionProps } from "@/components/types/session";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function deleteSession(session: sessionProps, user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", session.id)
        .single();

      if (error) console.log(error);
      return data;
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
