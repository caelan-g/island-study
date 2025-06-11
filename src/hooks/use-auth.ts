import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchUser } from "@/lib/user/fetch-user";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check initial auth state
    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        const user = await fetchUser();
        setIsAuthenticated(!!user);
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const checkAuth = async () => {
    const user = await fetchUser();
    setIsAuthenticated(!!user);
    setLoading(false);
  };

  return { isAuthenticated, loading };
}
