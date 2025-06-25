import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageCarousel from "@/components/ui/image-carousel";

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full mx-8">
      {/* Text and buttons aligned to the left */}
      <div className="lg:pl-36 relative z-10 max-w-md">
        <div className="font-semibold text-5xl md:text-6xl lg:text-8xl tracking-tight pt-24 lg:pt-48">
          Islands.
        </div>
        <div className="font-normal text-xl md:text-2xl lg:text-3xl tracking-tight mt-2">
          Your study. Your island.
        </div>
        <div className="flex flex-row gap-4 mt-8">
          <Link href="/auth/sign-up">
            <Button size="lg" variant="default">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="secondary">
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Image carousel positioned in the middle right */}
      <div className="lg:absolute lg:right-10 lg:top-1/2 lg:transform lg:-translate-y-1/2 w-80 pt-12 lg:pt-0 lg:w-[900px] z-5">
        <ImageCarousel />
      </div>
    </div>
  );
}
