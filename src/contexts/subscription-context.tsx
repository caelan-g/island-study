"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

type SubscriptionStatus =
  | "active"
  | "trialing"
  | "expired"
  | "lifetime"
  | "influencer"
  | "none"
  | null;

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  endDate: string | null;
  subscriptionLoading: boolean;
  refetch: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptionStatus: null,
  endDate: null,
  subscriptionLoading: true,
  refetch: async () => {},
});

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();

  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [subscriptionLoading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscriptionStatus(null);
      setEndDate(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("subscription_status, trial_end")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) {
      setSubscriptionStatus("expired");
      setEndDate(null);
    } else {
      //console.log(data);
      setEndDate(data.trial_end);
      if (["active", "lifetime"].includes(data.subscription_status)) {
        setSubscriptionStatus("active");
      } else if (
        data.subscription_status === "trialing" &&
        data.trial_end &&
        new Date(data.trial_end) > new Date()
      ) {
        setSubscriptionStatus("trialing");
      } else if (data.subscription_status === "influencer") {
        setSubscriptionStatus("influencer");
      } else {
        setSubscriptionStatus("expired");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) fetchSubscription();
  }, [authLoading, user]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionStatus,
        endDate,
        subscriptionLoading,
        refetch: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
