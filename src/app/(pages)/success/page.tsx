import { redirect } from "next/navigation";

import { stripe } from "../../../lib/stripe";

export default async function Success({
  searchParams: { session_id },
}: {
  searchParams: { session_id: string };
}) {
  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, customer_details } = session;
  const customerEmail: string | null = customer_details?.email ?? null;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    );
  }
}
