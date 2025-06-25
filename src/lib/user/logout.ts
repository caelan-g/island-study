import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

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

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error:", error);
      toast.error("Failed to log out. Try again.");
      return error;
    }

    toast.success("Logged out successfully");
    redirect("/auth/login");
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Can't log out. Please refresh.");
    return error;
  }
};
