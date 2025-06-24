import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-row text-xl font-semibold tracking-tight gap-2 justify-between px-6 py-5">
        <div className="flex gap-2">
          <div className="size-4 rounded-sm my-auto ">
            <Skeleton className="h-full w-full rounded-sm" />
          </div>
          <span>
            <Skeleton className="h-5 w-32" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
