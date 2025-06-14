"use client";
import { useState, useEffect } from "react";
import { islandProps } from "@/components/types/island";
import { fetchIslands } from "@/lib/island/fetch-islands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Islands() {
  const [islands, setIslands] = useState<islandProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIslands = async () => {
      setLoading(true);
      const data = await fetchIslands();
      if (data) setIslands(data);
      setLoading(false);
    };
    loadIslands();
  }, []);
  return (
    <>
      {loading ? (
        <>
          <Card className="bg-muted animate-pulse">
            <CardHeader></CardHeader>
            <CardContent className="min-h-48"></CardContent>
          </Card>
        </>
      ) : (
        <>
          {islands.map((island) => (
            <Card key={island.id}>
              <CardHeader>
                <CardTitle>{island.created_at}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Image
                    src={island.current_url}
                    alt="Island"
                    width={512}
                    height={262}
                    className="pixelated pointer-events-none select-none"
                    unoptimized
                  />
                </div>
                <div className="flex flex-row justify-center items-center">
                  <div className="z-10 font-bold text-background">
                    {island.level}
                  </div>
                  <span className="rotate-45 rounded-sm bg-primary size-6 absolute"></span>
                </div>
                {[...(island.previous_urls || [])].reverse().map((url) => (
                  <div key={url}>
                    <Image
                      src={url}
                      alt="Island"
                      width={256}
                      height={128}
                      className="pixelated pointer-events-none select-none"
                      unoptimized
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </>
  );
}
