import { toast } from "sonner";
import { stripe } from "../stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Updates the subscription info for a user in Supabase
 * @param userId - Your Supabase user ID (from metadata.user_id)
 * @param subscriptionStatus - Stripe subscription status ("active", "trialing", "canceled", etc.)
 * @param stripeCustomerId - Stripe customer ID (cus_...)
 * @param stripeSubscriptionId - Stripe subscription ID (sub_...)
 *
 *
 */
export async function updateUserSubscription(
  userId: string,
  subscriptionStatus: string,
  stripeCustomerId: string | undefined,
  stripeSubscriptionId: string | undefined
) {
  // Adjust these column names to match your DB schema
  console.log("updating user");
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        is_subscribed: ["active", "trialing"].includes(subscriptionStatus),
        subscription_status: subscriptionStatus,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        trial_end: null,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      toast.error("Failed to update user subscription");
      return;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Something went wrong while updating user subscription");
    return;
  }
}
