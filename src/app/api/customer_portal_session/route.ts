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
      return NextResponse.json({
        success: false,
        error: "Stripe Customer ID is missing",
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    const error = err as StripeError;
    console.error(`Checkout session error: ${error.message}`);
    return NextResponse.json({ success: false, error: error.message });
  }
}
