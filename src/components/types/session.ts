export type sessionProps = {
  id: string;
  start_time: string;
  end_time: string;
  course_id: string; // Optional, if not always present
  user_id: string; // Optional, if not always present
  description?: string;
};
