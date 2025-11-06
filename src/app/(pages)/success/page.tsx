import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session_id = params.session_id;

  if (!session_id || typeof session_id !== "string") {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, customer_details } = session;
  const customerEmail = customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <section
        id="success"
        className="flex flex-col items-center justify-center min-h-screen text-center"
      >
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-700">
            We appreciate your business! A confirmation email will be sent to{" "}
            <span className="font-semibold">{customerEmail}</span>.
          </p>
          <p className="text-gray-600 mt-2">
            If you have any questions, please email{" "}
            <a
              href="mailto:orders@example.com"
              className="text-blue-500 hover:underline"
            >
              orders@example.com
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return redirect("/");
}
