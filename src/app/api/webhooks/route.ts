import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateUserSubscription } from "@/lib/supabase/update-user-subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await updateUserSubscription(
        session.metadata.user_id,
        session.customer,
        session.subscription,
        session.status
      );
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      console.log("here");
      await updateUserSubscription(
        subscription.metadata.user_id,
        subscription.customer,
        subscription.id,
        subscription.status
      );
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await updateUserSubscription(
        subscription.metadata.user_id,
        subscription.customer,
        subscription.id,
        subscription.status
      );
      break;
    }
  }

  return new NextResponse(null, { status: 200 });
}
