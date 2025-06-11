import { createServerClient } from "@supabase/ssr";
import { NextApiRequest, NextApiResponse } from "next";

export function createServerSupabaseClient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string) {
          res.setHeader("Set-Cookie", `${name}=${value}; Path=/`);
        },
        remove(name: string) {
          res.setHeader("Set-Cookie", `${name}=; Path=/; Max-Age=0`);
        },
      },
    }
  );
}
