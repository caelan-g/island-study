import { sessionProps } from "@/components/types/session";
import { TimeMetrics } from "@/components/types/session";
import { toast } from "sonner";

/**
 * Processes session data to calculate metrics and group by day
 *
 * Process:
 * 1. Calculates time metrics (today, week, month)
 * 2. Groups sessions by day
 * 3. Fills missing days with placeholder sessions
 *
 * Time calculations:
 * - Today: Sessions from start of current day
 * - Week: Sessions from 7 days ago
 * - Month: Sessions from 30 days ago
 *
 * Returns:
 * - Array containing time metrics and grouped sessions
 * - [timeMetrics, groupedArray]
 *
 * @param sessions - Array of session objects to process
 * @returns [TimeMetrics, GroupedSession[]] or undefined if error
 */
export const processSessionData = (
  sessions: sessionProps[],
  duration: "all" | "month" = "month",
) => {
  if (!sessions) {
    toast.error("No session data found");
    return;
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate time metrics
    const timeMetrics = sessions.reduce(
      (acc: TimeMetrics, session) => {
        const sessionStart = new Date(session.start_time);
        const duration = session.end_time
          ? (new Date(session.end_time).getTime() - sessionStart.getTime()) /
            1000
          : 0;

        if (sessionStart >= today) {
          acc.today += duration;
        }
        if (sessionStart >= weekAgo) {
          acc.week += duration;
        }
        if (sessionStart >= monthAgo) {
          acc.month += duration;
        }
        return acc;
      },
      { today: 0, week: 0, month: 0 },
    );

    // Group sessions by day
    const grouped = sessions.reduce(
      (acc: { [key: string]: sessionProps[] }, session) => {
        if (!session.end_time) return acc;
        const date = new Date(session.start_time).toLocaleDateString("en-US");
        if (!acc[date]) acc[date] = [];
        acc[date]?.push(session);
        return acc;
      },
      {},
    );

    // Fill in missing days with a placeholder session
    const baseDate = new Date();
    for (let i = 0; i < 16; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US");
      if (!grouped[dateStr]) {
        // Create placeholder session with proper dates
        const placeholderSession: sessionProps = {
          id: `placeholder-${dateStr}`,
          start_time: date.toISOString(),
          end_time: date.toISOString(),
          course_id: "",
          user_id: "",
        };
        grouped[dateStr] = [placeholderSession];
      }
    }
    let groupedArray;
    if (duration === "month") {
      groupedArray = Object.entries(grouped)
        .map(([date, sessions]) => ({
          date,
          sessions,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30);
    } else {
      groupedArray = Object.entries(grouped)
        .map(([date, sessions]) => ({
          date,
          sessions,
        }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    }

    return [timeMetrics, groupedArray];
  } catch (error) {
    console.error("Error processing session data:", error);
    toast.error("Failed to load sessions. Please refresh.");
    return;
  }
};
