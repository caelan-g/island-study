import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { islandProps } from "@/components/types/island";
import { IslandTimeMetric } from "@/components/metrics/islands/island-time-metric";
import { IslandLevelMetric } from "@/components/metrics/islands/island-level-metric";
import { IslandXPMetric } from "@/components/metrics/islands/island-xp-metric";
import IslandTag from "@/components/ui/island-tag";
import { X } from "lucide-react";
import PerspectiveCarousel from "@/components/ui/perspective-carousel";

interface IslandSelectProps extends islandProps {
  onDeselect: () => void;
}

export default function IslandSelect({
  onDeselect,
  ...island
}: IslandSelectProps) {
  return (
    <Card
      className="h-full w-96 relative cursor-default"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <button
        onClick={onDeselect}
        className="absolute top-2 right-2 z-30 bg-background/50 backdrop-blur-sm rounded-full p-1"
      >
        <X size={20} />
      </button>
      <CardHeader>
        <CardTitle className="flex flex-row gap-4">
          {new Date(island.created_at).toLocaleDateString()}
          <IslandTag type={island.type} />
          {island.active ? (
            <p className="text-sm select-none rounded-full text-emerald-500 border-emerald-500 border bg-emerald-100 dark:bg-emerald-500 dark:text-background flex px-2 py-1">
              Active
            </p>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-6">
        <div className="absolute flex flex-row gap-8 z-100 px-6">
          <IslandLevelMetric level={island.level} />
          <IslandXPMetric
            threshold={island.threshold}
            level={island.level}
            xp={island.xp}
          />
          <IslandTimeMetric
            threshold={island.threshold}
            level={island.level}
            xp={island.xp}
          />
        </div>
        <div className="w-full">
          {island.previous_urls && island.previous_urls.length > 0 ? (
            <PerspectiveCarousel
              urls={[...island.previous_urls, island.current_url]}
            />
          ) : (
            <PerspectiveCarousel urls={[island.current_url]} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
