import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function onboardUser(name: string, goal: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ name: name, goal: goal, has_onboarded: true })
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
}
