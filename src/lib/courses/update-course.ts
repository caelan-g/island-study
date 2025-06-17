import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export const updateCourse = async (
  id: string,
  name: string,
  colour: string,
  user: User | null
) => {
  if (user) {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ name: name, colour: colour })
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
