import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

interface StripeError {
  message: string;
  statusCode?: number;
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    const formData = await req.formData();
    const userId = formData.get("user_id") as string;
    const priceId = formData.get("price_id") as string;
    const mode =
      priceId === process.env.NEXT_PUBLIC_LIFETIME_PRICE_ID
        ? "payment"
        : "subscription";

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Create Checkout Sessions from body params.
    console.log(userId);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscribe/?canceled=true`,
      metadata: {
        user_id: userId,
      },
      automatic_tax: { enabled: true },
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
