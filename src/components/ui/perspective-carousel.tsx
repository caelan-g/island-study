"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PerspectiveCarousel({ urls }: { urls: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const images = urls.map((url, i) => ({
    id: i + 1,
    src: url,
    alt: `Image ${i + 1}`,
  }));

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diff = startX - currentX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Determine if drag was significant enough to change slide
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (dragOffset < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (dragOffset < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    setDragOffset(0);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener("mouseup", handleMouseUpGlobal);
    return () => document.removeEventListener("mouseup", handleMouseUpGlobal);
  }, [isDragging, dragOffset, currentIndex]);

  const getImageStyle = (index: number) => {
    const position = index - currentIndex;
    const offset = isDragging ? -dragOffset / 5 : 0;

    let scale = 1;
    let opacity = 1;
    let zIndex = 1;
    const translateX = position * 600 + offset;

    if (position === 0) {
      // Center image
      scale = 1;
      opacity = 1;
      zIndex = 3;
    } else if (Math.abs(position) === 1) {
      // Adjacent images
      scale = 0.8;
      opacity = 0.7;
      zIndex = 2;
    } else if (Math.abs(position) === 2) {
      // Second adjacent images
      scale = 0.6;
      opacity = 0.4;
      zIndex = 1;
    } else {
      // Hidden images
      scale = 0.4;
      opacity = 0;
      zIndex = 0;
    }

    return {
      transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: isDragging ? "none" : "all 0.3s ease-in-out",
    };
  };

  return (
    <div className="w-full grow mx-auto">
      <div className="relative">
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative h-80 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="absolute left-1/2 top-1/2 "
              style={getImageStyle(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={512}
                height={256}
                className="pixelated floating pointer-events-none select-none"
                unoptimized
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-[100]"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 " />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-[100]"
          onClick={handleNext}
          disabled={currentIndex === images.length - 1}
        >
          <ChevronRight className="h-4 w-4 " />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-1 h-1 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-gray-800 scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Current Image Counter */}
      <div className="flex flex-row justify-center items-center my-4">
        <div className="z-10 font-bold text-background">{currentIndex + 1}</div>
        <span className="rotate-45 rounded-sm bg-primary size-6 absolute"></span>
      </div>
    </div>
  );
}
