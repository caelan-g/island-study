export type sessionProps = {
  id: string;
  start_time: string;
  end_time: string;
  course_id: string; // Optional, if not always present
  user_id: string; // Optional, if not always present
  description?: string;
};

export type GroupedSession = {
  date: string;
  sessions: sessionProps[];
};

export type TimeMetrics = {
  today: number; // Total seconds for today
  week: number; // Total seconds for the last 7 days
  month: number; // Total seconds for the last 30 days
};
