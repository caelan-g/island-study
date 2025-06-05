import { createClient } from "@/lib/supabase/client";
import { sessionProps } from "@/components/types/session";

const supabase = createClient();

export async function deleteSession(session: sessionProps) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", session.id)
        .single();

      if (error) {
        console.log(error);
      }
      return data;
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
