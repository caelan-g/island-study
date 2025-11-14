import { cn } from "@/lib/utils";
export default function IslandCheck({ nextUrl }: { nextUrl: string }) {
  return (
    <div className="bg-white border rounded-md px-2 py-1 flex gap-1 items-center">
      <p className="text-sm font-medium">next ready</p>
      <span
        className={cn(
          "rounded-full h-4 w-4 block",
          nextUrl ? "bg-emerald-500" : "bg-red-500"
        )}
      ></span>
    </div>
  );
}
