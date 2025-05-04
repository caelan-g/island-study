import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
export const Logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error:", error);
    return error;
  }
  redirect("/auth/login");
};
