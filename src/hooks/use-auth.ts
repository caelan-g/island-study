import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchUser } from "@/lib/user/fetch-user";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    console.log("Auth hook initialized");

    const checkAuth = async () => {
      try {
        const user = await fetchUser();
        if (mounted) {
          console.log("Auth check completed:", !!user);
          setIsAuthenticated(!!user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed:", event);
      if (!mounted) return;

      try {
        if (event === "SIGNED_IN") {
          const user = await fetchUser();
          setIsAuthenticated(!!user);
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading };
}
