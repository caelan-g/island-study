import { NextResponse } from "next/server";
import { userProps } from "@/components/types/user";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const user: userProps = JSON.parse(formData.get("user") as string);
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    if (!user) {
      return NextResponse.json({ error: "No user" }, { status: 401 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user?.stripe_customer_id,
      return_url: "https://islands.study/settings",
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
