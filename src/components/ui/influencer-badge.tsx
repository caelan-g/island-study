import { Star } from "lucide-react";
export default function InfluencerBadge() {
  return (
    <span className="rounded-full bg-amber-100 border border-yellow-500 text-yellow-500 px-2 py-1 text-xs font-semibold flex items-center gap-1">
      <Star size={14} /> Influencer
    </span>
  );
}
