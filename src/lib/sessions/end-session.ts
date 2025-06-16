import { createClient } from "@/lib/supabase/client";
import { checkSession } from "./check-session";
import { toast } from "sonner";
import { addXP } from "@/lib/island/add-xp";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function endSession(
  session_id: string,
  start_time: Date,
  end_time: Date,
  course_id: string,
  user: User | null,
  description?: string
) {
  if (user) {
    try {
      const duration = Math.floor(
        (new Date(end_time).getTime() - new Date(start_time).getTime()) / 1000
      );
      const active = await checkSession(user);
      if (session_id !== "") {
        const { error } = await supabase
          .from("sessions")
          .update({
            start_time: new Date(start_time).toISOString(),
            end_time: new Date(end_time).toISOString(),
            description: description,
            course_id: course_id,
          })
          .eq("id", session_id);

        if (error) {
          console.log(error);
          toast.error("Failed to end session");
        } else {
          toast.success("Session updated");
        }
        return;
      }
      if (active) {
        const { error } = await supabase
          .from("sessions")
          .update({
            start_time: new Date(start_time).toISOString(),
            end_time: new Date(end_time).toISOString(),
            description: description,
            course_id: course_id,
          })
          .eq("id", active.id);

        if (error) {
          console.log(error);
          toast.error("Failed to end session");
        } else {
          toast.success("Session created");
        }
      } else {
        const { error } = await supabase.from("sessions").insert({
          user_id: user.id,
          start_time: new Date(start_time).toISOString(),
          end_time: new Date(end_time).toISOString(),
          description: description,
          course_id: course_id,
        });

        if (error) {
          console.log(error);
          toast.error("Failed to end session");
        } else {
          toast.success("Session created");
        }
      }
      await addXP(supabase, user.id, duration, user);
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
