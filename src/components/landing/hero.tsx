import { Button } from "@/components/ui/button";
import ImageCarousel from "@/components/ui/image-carousel";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative pb-24 lg:pb-0 lg:min-h-screen w-full mx-8">
      {/* Text and buttons aligned to the left */}
      <div className="flex flex-row w-full">
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
        <Image
          src="/images/landing/dashboarddesktopremoved.png"
          alt="dashboard"
          width={2902}
          height={1838}
          className="w-[1280px] max-h-screen object-cover object-top absolute hidden lg:block left-[40rem] [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"
        />
      </div>
      <div className="absolute bottom-20 text-xs lg:w-full justify-center text-neutral-600 lg:flex hidden">
        <ArrowDownIcon className="h-5 w-5 mr-1 animate-bounce" />
      </div>

      {/* Image carousel positioned in the middle right */}
      <div className="lg:absolute  lg:left-[41.92rem] lg:top-[16rem] lg:transform lg:-translate-y-1/2 w-86 pt-12 lg:pt-0 lg:w-[600px] z-5">
        <ImageCarousel />
      </div>
    </div>
  );
}
