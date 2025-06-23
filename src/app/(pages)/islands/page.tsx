"use client";
import { useState, useEffect } from "react";
import { islandProps } from "@/components/types/island";
import { fetchIslands } from "@/lib/island/fetch-islands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import PerspectiveCarousel from "@/components/ui/perspective-carousel";
import { IslandLevelMetric } from "@/components/metrics/islands/island-level-metric";
import { IslandXPMetric } from "@/components/metrics/islands/island-xp-metric";

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
              <Card key={island.id}>
                <CardHeader>
                  <CardTitle className="flex flex-row gap-4">
                    {new Date(island.created_at).toLocaleDateString()}
                    {island.active ? (
                      <p className="text-sm rounded-md bg-emerald-100 flex px-2 py-1 ml-2">
                        Active
                      </p>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-row overflow-x-hidden">
                  <div className="w-full">
                    {island.previous_urls && island.previous_urls.length > 0 ? (
                      <PerspectiveCarousel
                        urls={[...island.previous_urls, island.current_url]}
                      />
                    ) : (
                      <PerspectiveCarousel urls={[island.current_url]} />
                    )}
                  </div>
                  <div className="absolute ml-6 flex flex-row gap-8 z-100">
                    <IslandLevelMetric level={island.level} />
                    <IslandXPMetric
                      threshold={island.threshold}
                      level={island.level}
                      xp={island.xp}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
