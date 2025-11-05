import { createClient } from "@supabase/supabase-js";

// IMPORTANT: This client is for server-side use only and should never be exposed to the client.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
