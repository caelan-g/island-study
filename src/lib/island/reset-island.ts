import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function resetIsland(user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("islands")
        .update({ active: false })
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
