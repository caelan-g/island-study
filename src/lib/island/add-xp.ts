import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// [] what if multiple levels are achieved in one go?

export async function addXP(
  supabase: SupabaseClient,
  userId: string,
  duration: number,
  user: User | null
) {
  if (user) {
    const { data: island, error: fetchError } = await supabase
      .from("islands")
      .select()
      .eq("user_id", userId)
      .eq("active", true)
      .single();

    if (fetchError) {
      console.error(fetchError);
      toast.error("Failed to fetch island xp");
      return;
    }
    if (island.level < 7) {
      if (island.xp + duration >= island.threshold) {
        let level = island.level;
        let total = duration + island.xp;
        while (total >= island.threshold) {
          level += 1;
          total -= island.threshold;
        }
        //assume user only reaches one level at a time
        console.log(island);
        if (island.next_url) {
          //toast.success("next url found");
          const { error } = await supabase
            .from("islands")
            .update({
              xp: total,
              current_url: island.next_url,
              next_url: null,
              level: level,
              previous_urls: [
                ...(island.previous_urls || []),
                island.current_url,
              ],
            })
            .eq("user_id", userId)
            .eq("active", true);

          if (error) {
            console.error(error);
            toast.error("Failed to update island");
          }
        }
      } else {
        const { error } = await supabase
          .from("islands")
          .update({ xp: (island?.xp || 0) + duration })
          .eq("user_id", userId)
          .eq("active", true);

        if (error) {
          console.error(error);
          toast.error("Failed to update island xp");
        }
      }
    }
  } else {
    console.error("No user logged in");
    toast.error("No user logged in");
  }
  return;
}
