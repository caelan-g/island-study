"use client";
import { useState, useEffect } from "react";
import { islandProps } from "@/components/types/island";
import { fetchIslands } from "@/lib/island/fetch-islands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import PerspectiveCarousel from "@/components/ui/perspective-carousel";

export default function Islands() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [islands, setIslands] = useState<islandProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIslands = async () => {
      setLoading(true);
      const data = await fetchIslands(authUser);
      if (data) setIslands(data.reverse());
      setLoading(false);
    };
    if (!authLoading && authUser) {
      loadIslands();
    }
  }, [authLoading, authUser]);
  return (
    <>
      {loading ? (
        <>
          <Card className="bg-muted animate-pulse">
            <CardHeader>trading card maybe</CardHeader>
            <CardContent className="min-h-48"></CardContent>
          </Card>
        </>
      ) : (
        <div className="">
          <div className="text-2xl font-bold">My Islands</div>
          <div className="space-y-4">
            {islands.map((island) => (
              <div className="flex flex-row" key={island.id}>
                <div className="relative w-full">
                  {island.previous_urls && island.previous_urls.length > 0 ? (
                    <PerspectiveCarousel
                      urls={[...island.previous_urls, island.current_url]}
                    />
                  ) : (
                    <PerspectiveCarousel urls={[island.current_url]} />
                  )}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {new Date(island.created_at).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0"></CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
