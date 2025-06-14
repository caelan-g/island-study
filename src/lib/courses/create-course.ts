import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const createCourse = async (name: string, colour: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { error } = await supabase
        .from("courses")
        .insert({ user_id: user.id, name: name, colour: colour });

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
