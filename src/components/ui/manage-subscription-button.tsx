"use client";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { userProps } from "@/components/types/user";
import { fetchUser } from "@/lib/user/fetch-user";
export default function ManageSubscriptionButton() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<userProps | null>(null);

  const initializeUser = useCallback(async () => {
    try {
      const userData = await fetchUser(authUser);
      if (userData) setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, [authUser]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and checkout when you’re ready."
    );
  }
  return (
    <>
      <form action="/api/customer_portal_session" method="POST">
        {user && (
          <input type="hidden" name="user" value={JSON.stringify(user)} />
        )}
        <Button
          type="submit"
          role="link"
          disabled={authLoading || !authUser || !user}
        >
          Manage Subscription
        </Button>
      </form>
    </>
  );
}
