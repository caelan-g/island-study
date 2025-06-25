"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ImageCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of island images - using placeholder images for demo
  const islandImages = [
    "/images/landing/1.png",
    "/images/landing/2.png",
    "/images/landing/3.png",
    "/images/landing/4.png",
    "/images/landing/5.png",
    "/images/landing/6.png",
    "/images/landing/7.png",
    "/images/landing/8.png",
    "/images/landing/9.png",
    "/images/landing/10.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % islandImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [islandImages.length]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-full aspect-[2/1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
              y: -5,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <Image
              src={islandImages[currentImageIndex] || "/placeholder.svg"}
              alt={`Pixel art island ${currentImageIndex + 1}`}
              width={512}
              height={256}
              className="w-full h-full object-contain pixelated floating"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
