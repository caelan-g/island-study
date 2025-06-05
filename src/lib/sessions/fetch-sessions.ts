import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function fetchSessions() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select()
        .eq("user_id", user.id)
        .order("start_time", { ascending: false });

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
