import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

/**
 * Handles user logout process
 *
 * Process:
 * 1. Signs out user from Supabase auth
 * 2. Clears local session data
 * 3. Redirects to login page
 *
 * Error handling:
 * - Shows toast notifications
 * - Logs errors to console
 * - Returns error object if failed
 *
 * @returns Error object if logout fails
 */
export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error:", error);
    return error;
  }
  redirect("/auth/login");
};
