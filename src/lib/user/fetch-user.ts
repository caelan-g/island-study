import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export const fetchUser = async (user: User | null | null) => {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error);
      }
      return data;
    } catch (err) {
      console.error(err);
      return;
    }
  } else {
    console.log("no user logged in");
  }
};
