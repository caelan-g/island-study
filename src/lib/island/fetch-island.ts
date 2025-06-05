import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function fetchIsland() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("islands")
        .select()
        .eq("user_id", user.id)
        .eq("active", true);

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
