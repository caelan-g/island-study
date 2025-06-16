import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function fetchIslands(user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("islands")
        .select("*")
        .eq("user_id", user.id);

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
