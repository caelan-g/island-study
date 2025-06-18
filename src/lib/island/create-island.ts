/*
"use client";
import { createClient } from "@/lib/supabase/client";
import { evolutionPrompts } from "@/app/data/island-prompts";
import { fetchUser } from "@/lib/user/fetch-user";
import { User } from "@supabase/supabase-js";

export async function createIsland(user: User | null) {
  const supabase = createClient();
  if (user) {
    const { data, error } = await supabase.storage
      .from("base")
      .createSignedUrl("private/light_island.png", 60);

    if (error || !data?.signedUrl) {
      return new Response("Failed to get signed URL", { status: 500 });
    }
    try {
      const response = await fetch("/api/retro-diffusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: evolutionPrompts[0][1],
          strength: evolutionPrompts[0][0],
          signedUrl: data.signedUrl,
        }),
      });
      //console.log(evolutionPrompts[0][0], evolutionPrompts[0][1]);

      if (response.ok) {
        const result = await response.json();
        const user = await fetchUser(authUser);
        //console.log(result.publicUrl);

        try {
          const { error } = await supabase.from("islands").insert({
            user_id: user.id,
            threshold: user.goal,
            current_url: result.publicUrl,
          });

          if (error) {
            console.error(error);
          }
        } catch {
          return;
        }
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error("no user logged in");
  }
}
*/
