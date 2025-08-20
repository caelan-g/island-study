import { Button } from "@/components/ui/button";
import ImageCarousel from "@/components/ui/image-carousel";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative lg:min-h-screen w-full mx-8">
      {/* Text and buttons aligned to the left */}
      <div className="lg:pl-36 flex flex-col w-full lg:max-w-1/3 pl-auto z-100">
        <div className="font-semibold text-5xl md:text-6xl lg:text-8xl tracking-tight pt-24 lg:pt-48">
          Islands.
        </div>
        <div className="font-normal text-xl md:text-2xl lg:text-3xl tracking-tighter mt-2">
          Gamified study tracking.
        </div>
        <div className="flex flex-row gap-4 mt-8">
          <Link href="/auth/sign-up">
            <Button size="lg" variant="default">
              Start Studying
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
      <div className="lg:absolute lg:right-[5%] xl:right-[7%] 2xl:right-[15%] lg:top-1/2 lg:transform lg:-translate-y-1/2 w-86 pt-12 lg:pt-0 lg:w-[700px] xl:w-[800px] 2xl:w-[1000px] z-5">
        <ImageCarousel />
      </div>
    </div>
  );
}
