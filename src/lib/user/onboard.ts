import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function onboardUser(name: string, goal: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data: islandData, error: islandError } = await supabase
        .from("islands")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (islandError) {
        console.error("Error fetching island data:", islandError);
        return;
      }

      if (islandData) {
        const { error } = await supabase
          .from("islands")
          .update({ threshold: goal })
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error updating island threshold:", error);
          return;
        }
      }

      const { error } = await supabase
        .from("users")
        .update({ name: name, goal: goal, has_onboarded: true })
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error);
        return;
      }

      await supabase.auth.updateUser({
        data: { has_onboarded: true },
      });

      return true;
    } catch (err) {
      console.error(err);
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
