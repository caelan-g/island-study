import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const fetchUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
