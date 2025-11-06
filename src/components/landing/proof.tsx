import { Button } from "@/components/ui/button";
import { ScrollCounter } from "@/components/ui/scroll-counter";
import Link from "next/link";

export default function Proof() {
  return (
    <div className="flex flex-col items-center tracking-tight pt-0 lg:pt-24">
      <div className="text-xl lg:text-3xl font-semibold tracking-tight mb-4">
        Trusted by students worldwide
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl">
        <div className="text-center">
          <ScrollCounter
            target={2231}
            duration={1500}
            suffix=""
            className="text-5xl lg:text-6xl font-bold text-primary mb-4"
          />
          <p className="text-muted-foreground text-lg">Students Onboarded</p>
        </div>

        <div className="text-center">
          <ScrollCounter
            target={10152}
            duration={1500}
            suffix=""
            className="text-5xl lg:text-6xl font-bold text-primary mb-4"
          />
          <p className="text-muted-foreground text-lg">Total Hours Tracked</p>
        </div>

        <div className="text-center">
          <ScrollCounter
            target={3876}
            duration={1500}
            suffix=""
            className="text-5xl lg:text-6xl font-bold text-primary mb-4"
          />
          <p className="text-muted-foreground text-lg">Islands Generated</p>
        </div>
      </div>
    </div>
  );
}
