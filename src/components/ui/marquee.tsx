"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ImageItem {
  id: string | number;
  src: string;
  alt: string;
}

interface InfiniteMarqueeCTAProps {
  images?: ImageItem[];
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function InfiniteMarqueeCTA({
  images = [],
}: InfiniteMarqueeCTAProps) {
  // Generate default images if none provided
  const defaultImages: ImageItem[] = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    src: `/placeholder.svg?height=400&width=300&query=abstract-design-${i}`,
    alt: `Design ${i + 1}`,
  }));

  const imageList = images.length > 0 ? images : defaultImages;

  // Auto-split images into 3 columns
  const splitIntoColumns = (items: ImageItem[]) => {
    const columns: [ImageItem[], ImageItem[], ImageItem[]] = [[], [], []];

    items.forEach((item, index) => {
      columns[index % 3].push(item);
    });

    return columns;
  };

  const [column1Images, column2Images, column3Images] =
    splitIntoColumns(imageList);

  const renderColumn = (
    images: ImageItem[],
    animationClass: string,
    columnKey: string
  ) => (
    <div className="flex-1 relative overflow-hidden">
      <div className={`${animationClass} flex flex-col gap-4 p-4`}>
        {/* Render images once */}
        {images.map((image, index) => (
          <div
            key={`${columnKey}-${image.id}-${index}-a`}
            className="relative rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex-shrink-0"
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-64 object-contain pixelated"
              loading="lazy"
            />
          </div>
        ))}
        {/* Render images a second time for the seamless loop */}
        {images.map((image, index) => (
          <div
            key={`${columnKey}-${image.id}-${index}-b`}
            className="relative rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex-shrink-0"
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-64 object-contain pixelated"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative w-full min-h-6xl overflow-hidden bg-gradient-to-br pb-24">
      {/* Background Marquee Columns */}
      <div className="hidden lg:absolute inset-0 lg:flex">
        {/* Column 1 - Reverse animation */}
        {renderColumn(column1Images, "animate-marquee-reverse", "col1")}

        {/* Column 2 - Reverse animation (delayed) */}
        {renderColumn(column2Images, "animate-marquee-reverse-delayed", "col2")}

        {/* Column 3 - Reverse animation (slow) */}
        {renderColumn(column3Images, "animate-marquee-reverse-slow", "col3")}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent" />

      {/* Call to Action Content */}
      <div className="relative z-10 flex items-center justify-center lg:min-h-screen p-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className=" bg-white rounded-3xl p-12 shadow-2xl">
            <h1 className="text-4xl font-semibold mb-6">Start Tracking</h1>
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="group relative overflow-hidden px-12 py-6 text-lg font-semibold rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started
                <span className="relative z-10 flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            <p className="text-xs font-light mt-4 text-foreground/70">
              Please note: Islands is still in BETA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
