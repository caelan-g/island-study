export function IslandXPMetric({
  threshold,
  level,
  xp,
  loading,
}: {
  threshold: number;
  level: number;
  xp: number;
  loading: boolean;
}) {
  const total = threshold * (level - 1) + xp;
  const rounded = total > 999 ? (total / 1000).toFixed(1) + "k" : total;
  return (
    <div>
      <p className="text-xs text-muted-foreground">Total XP</p>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold">{rounded}</p>
      </div>
    </div>
  );
}
