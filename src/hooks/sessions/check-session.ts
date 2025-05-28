import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useCheckSession = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .is("end_time", null);

      if (error) {
        console.log(error);
      }
      // Check if there is an active session
      if (data && data.length > 0) {
        return data[0];
      } else {
        return false;
      }
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
};
