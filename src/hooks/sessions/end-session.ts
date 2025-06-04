import { createClient } from "@/lib/supabase/client";
import { UUID } from "crypto";
import { useCheckSession } from "./check-session";
import { toast } from "sonner";

const supabase = createClient();

export async function useEndSession(
  session_id: string,
  start_time: Date,
  end_time: Date,
  course_id: string,
  description?: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const active = await useCheckSession();
      if (session_id !== "") {
        const { data, error } = await supabase
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
        const { data, error } = await supabase
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
        const { data, error } = await supabase.from("sessions").insert({
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
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
