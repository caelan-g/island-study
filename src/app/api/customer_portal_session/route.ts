import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

interface StripeError {
  message: string;
  statusCode?: number;
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "https://islands.study";
    const formData = await req.formData();
    const customerId = formData.get("customer_id") as string;

    if (!customerId) {
      return NextResponse.json(
        { error: "Stripe Customer ID is missing" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    const error = err as StripeError;
    console.error(`Checkout session error: ${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
