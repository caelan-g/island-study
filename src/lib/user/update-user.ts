import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export const updateUser = async (
  id: string,
  name: string,
  goal: number,
  user: User | null
) => {
  if (user) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ name: name, goal: goal })
        .eq("id", id);

      if (error) {
        console.log(error);
      }
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
};
