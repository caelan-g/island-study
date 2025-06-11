export type islandProps = {
  id: string;
  user_id: string;
  total_xp: number;
  threshold: number;
  current_url: string;
  type: string;
  active: boolean;
  created_at: string;
  next_url?: string; // Optional, if not always present
  previous_urls?: Array<string>; // Optional, if not always present
};
