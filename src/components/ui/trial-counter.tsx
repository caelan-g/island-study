import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { userProps } from "@/components/types/user";
import { TriangleAlert } from "lucide-react";

export default function TrialCounter({
  subscriptionStatus,
  endDate,
}: {
  endDate: string | null;
  subscriptionStatus: string | null;
}) {
  if (subscriptionStatus == "trialing" && endDate) {
    const trialEndDate = new Date(endDate).getTime();
    const trialDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const trialStartDate = trialEndDate - trialDuration;
    const now = new Date().getTime();

    const elapsedTime = now - trialStartDate;
    const percentageRemaining = 100 - (elapsedTime / trialDuration) * 100;
    const expired = percentageRemaining <= 0;
    return (
      <div className="rounded-lg border w-full p-2 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-sm font-semibold items-center flex">
            Free Trial{" "}
            {expired ? (
              <TriangleAlert className="text-red-500 inline size-4 ml-1" />
            ) : null}
          </span>
          <span className="text-sm">
            {expired ? "Ended" : "Ends"}{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date(endDate))}
          </span>
        </div>
        {expired ? null : (
          <Progress
            value={percentageRemaining}
            max={100}
            className="w-full h-1 rounded-full mt-1 mb-1 bg-muted [&>div]:bg-[var(--chart-green)]"
          />
        )}

        <Button asChild>
          <Link href="/subscribe" className="w-full">
            Upgrade Now
          </Link>
        </Button>
      </div>
    );
  } else if (subscriptionStatus == "expired") {
    const expired = true;
    return (
      <div className="rounded-lg border w-full p-2 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-sm font-semibold items-center flex">
            Subscription
            {expired ? (
              <TriangleAlert className="text-red-500 inline size-4 ml-1" />
            ) : null}
          </span>
          <span className="text-sm">Expired</span>
        </div>

        <Button asChild>
          <Link href="/subscribe" className="w-full">
            Renew Now
          </Link>
        </Button>
      </div>
    );
  } else {
    return null;
  }
}
