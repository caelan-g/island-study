import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateUserSubscription } from "@/lib/supabase/update-user-subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log("very=fying webhook");
  const body = await req.text();
  const hdrs = await headers(); // ✅ await here
  const sig = hdrs.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`✅ Received webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const mode = session.mode;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!userId) {
          throw new Error(`Missing critical data: userId: ${userId}`);
        }

        if (session.subscription && userId) {
          await stripe.subscriptions.update(session.subscription as string, {
            metadata: { user_id: userId },
          });
        }

        await updateUserSubscription(
          userId,
          "active",
          customerId,
          subscriptionId
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!userId || !customerId) {
          throw new Error(
            `Missing critical data for subscription update: userId: ${userId}, customerId: ${customerId}`
          );
        }

        console.log(
          "Updating subscription for customer.subscription.updated..."
        );
        await updateUserSubscription(
          userId,
          subscription.status,
          customerId,
          subscription.id
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!userId || !customerId) {
          throw new Error(
            `Missing critical data for subscription deletion: userId: ${userId}, customerId: ${customerId}`
          );
        }

        console.log(
          "Updating subscription for customer.subscription.deleted..."
        );
        await updateUserSubscription(
          userId,
          subscription.status,
          customerId,
          subscription.id
        );
        break;
      }
    }
  } catch (error: any) {
    console.error(`Webhook handler error: ${error.message}`);
    return new NextResponse(`Webhook handler error: ${error.message}`, {
      status: 400,
    });
  }

  return new NextResponse(null, { status: 200 });
}
