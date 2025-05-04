import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const fetchCourses = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select()
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
};
