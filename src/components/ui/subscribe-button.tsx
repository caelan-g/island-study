"use client";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
export default function SubscribeButton({
  priceId,
}: {
  priceId: string | undefined;
}) {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const { user: authUser, loading: authLoading } = useAuth();

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and checkout when you’re ready."
    );
  }
  return (
    <>
      <form action="/api/checkout_sessions" method="POST">
        {authUser && <input type="hidden" name="user_id" value={authUser.id} />}
        {authUser && priceId && (
          <input type="hidden" name="price_id" value={priceId} />
        )}
        <Button
          type="submit"
          role="link"
          className="w-full"
          disabled={authLoading || !authUser || !priceId}
        >
          Subscribe
        </Button>
      </form>
    </>
  );
}
