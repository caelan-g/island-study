import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function fetchCourses(user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select()
        .eq("user_id", user.id)
        .order("name", { ascending: true });

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
