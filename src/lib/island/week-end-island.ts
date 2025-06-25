import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function weekEndIsland(user: User | null) {
  if (user) {
    try {
      // Get date from 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Update the active island's created_at date
      const { data, error } = await supabase
        .from("islands")
        .update({
          created_at: sevenDaysAgo.toISOString(),
        })
        .eq("user_id", user.id)
        .eq("active", true);

      if (error) {
        console.log(error);
      }
      return data;
    } catch (error) {
      console.error("Error updating island date:", error);
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
