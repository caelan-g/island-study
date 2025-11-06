"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { userProps } from "@/components/types/user";
import { fetchUser } from "@/lib/user/fetch-user";
import { toast } from "sonner";

export default function ManageSubscriptionButton() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<userProps | null>(null);
  const [loading, setLoading] = useState(false);

  const initializeUser = useCallback(async () => {
    try {
      if (!authUser) return;
      const userData = await fetchUser(authUser);
      if (userData) setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
      toast.error("Failed to load user data");
    }
  }, [authUser]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const handleManageSubscription = async () => {
    if (!user?.stripe_customer_id) {
      toast.error("Customer ID missing. Please contact support.");
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("customer_id", user.stripe_customer_id);

      const res = await fetch("/api/customer_portal_session", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url; // redirect to Stripe portal
      } else {
        toast.error(data.error || "Unable to open billing portal");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (canceled) {
    toast.error("Order canceled — continue shopping and checkout when ready.");
  }

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={authLoading || !authUser || !user || loading}
    >
      {loading ? "Opening..." : "Manage Subscription"}
    </Button>
  );
}
