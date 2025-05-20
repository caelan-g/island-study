import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const fetchTotal = async (type: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("start_time, end_time, course_id")
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
        return 0;
      }
      if (!data) return 0;

      let studyTime = { total: 0, today: 0 };
      for (let i = 0; i < data.length; i++) {
        // Convert timestamptz strings to Date objects and calculate difference in milliseconds
        const startDate = new Date(data[i].start_time);
        const endDate = new Date(data[i].end_time);
        studyTime["total"] += (endDate.getTime() - startDate.getTime()) / 1000; // Convert to seconds
      }
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      for (let i = 0; i < data.length; i++) {
        const startDate = new Date(data[i].start_time);
        const endDate = new Date(data[i].end_time);
        if (startDate >= startOfDay) {
          if (endDate > startDate) {
            studyTime["today"] +=
              (endDate.getTime() - startDate.getTime()) / 1000; // Convert to seconds
          }
        }
      }

      return studyTime;
    } catch {
      return;
    }
  } else {
    console.log("no user logged in");
  }
};
