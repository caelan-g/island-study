import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GroupedSession } from "@/components/types/session";
import { CourseTopMetric } from "@/components/metrics/course-top-metric";
import { TimeMetric } from "@/components/metrics/time-metric";
import { courseProps } from "@/components/types/course";
import { IslandLevelMetric } from "@/components/metrics/islands/island-level-metric";
import { IslandXPMetric } from "@/components/metrics/islands/island-xp-metric";
import { islandProps } from "@/components/types/island";
import Image from "next/image";
import { motion } from "framer-motion";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupedSessions: GroupedSession[];
  studyTime: number; // Total study time in seconds
  goal: number; // User's study goal in seconds
  courses: courseProps[]; // List of courses for the user
  island: islandProps | null; // Island data for the user, can be null if not available
}

export default function ReviewDialog({
  open,
  onOpenChange,
  groupedSessions,
  studyTime,
  goal,
  courses,
  island,
}: ReviewDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] lg:min-w-1/2 lg:min-h-1/2">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold tracking-tight">
            Your Week in Review
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Here&apos;s how you did this week
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="relative">
          {/* Island Image */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute top-0 right-0 w-2/3 z-[-10]"
          >
            <Image
              src={island?.current_url || "/images/loading_island.png"}
              alt={`Level ${island?.level || 1} Island`}
              width={512}
              height={256}
              className="floating pixelated"
              unoptimized
            />
          </motion.div>

          {/* Metrics */}
          <div className="flex flex-col justify-center py-4 gap-4 z-20 max-w-80">
            <CourseTopMetric
              timeframe="week"
              courses={courses}
              groupedSessions={groupedSessions}
            />
            <TimeMetric studyTime={studyTime} goal={goal} timeframe="week" />
            <IslandLevelMetric level={island?.level || 0} />
            <IslandXPMetric
              level={island?.level || 0}
              xp={island?.xp || 0}
              threshold={island?.threshold || 0}
            />
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Keep Studying
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
