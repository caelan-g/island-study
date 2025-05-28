import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useFetchByCourse = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("start_time, end_time, course_id, description")
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
        return 0;
      }

      if (data) {
        const groupedByCourse: Record<string, any[]> = {};

        for (const session of data) {
          const courseId = session.course_id;
          if (!groupedByCourse[courseId]) {
            groupedByCourse[courseId] = [];
          }
          groupedByCourse[courseId].push(session);
        }
        console.log(groupedByCourse);
        return groupedByCourse;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
  return 0;
};
