import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SessionCardSkeleton() {
  return (
    <Card className="w-full transition-colors">
      <CardHeader>
        <CardTitle className="">
          <Skeleton className="h-12 w-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-8 w-full" />
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
