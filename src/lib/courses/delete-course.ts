import { createClient } from "@/lib/supabase/client";
import { courseProps } from "@/components/types/course";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function deleteCourse(course: courseProps, user: User | null) {
  if (user) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .delete()
        .eq("id", course.id)
        .single();

      if (error) console.log(error);
      return data;
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
}
