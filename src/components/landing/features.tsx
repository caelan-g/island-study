"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Zap, Shield, Users, BarChart } from "lucide-react";

const features = [
  {
    id: "analytics",
    title: "Island Evolutions",
    description:
      "Watch your island transform as you hit your study goals. Each evolution is uniquely generated using AI, creating a personalized visual journey of your academic progress.",
    image: "/images/features/evolutions.jpg",
    icon: BarChart,
    benefits: [
      "Completely unique island transformations",
      "Weekly resets",
      "Archipelago view to see all islands",
    ],
  },
  {
    id: "performance",
    title: "Study Timing",
    description:
      "Track your study sessions with precision timing tools. Set goals, monitor progress, and build consistent study habits with our intuitive timer system.",
    image: "/images/features/timer.jpg",
    icon: Zap,
    benefits: [
      "Session timing and tracking",
      "Customizable study goal setting",
      "Island evolutions based on study performance",
    ],
  },
  {
    id: "security",
    title: "Data Analytics",
    description:
      "Gain insights into your study patterns with comprehensive analytics. Visualize your progress across courses and identify areas for improvement.",
    image: "/images/features/coursegraph.jpg",
    icon: Shield,
    benefits: [
      "Course-specific progress visualization",
      "Study pattern analysis and insights",
      "Performance trends over time",
    ],
  },
  {
    id: "collaboration",
    title: "Week in Review",
    description:
      "Get comprehensive weekly summaries of your study achievements. Review your progress, celebrate milestones, and plan for the week ahead.",
    image: "/images/features/review.jpg",
    icon: Users,
    benefits: ["Weekly progress summaries", "Achievement milestone tracking"],
  },
];

export default function StickyFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveFeature(index);
          }
        },
        {
          threshold: 0.5,
          rootMargin: "-20% 0px -20% 0px",
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section className="w-full lg:py-48 py-12">
      <div className="container mx-auto px-4">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="space-y-6">
                {/* Mobile Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-contain bg-white"
                    priority={index === 0}
                    unoptimized
                  />
                </div>

                {/* Mobile Content */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-primary/20 to-transparent" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/sign-up">
                    <Button className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Layout - Sticky */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
          {/* Sticky Image Container */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeFeature === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-contain bg-white"
                    priority={index === 0}
                    unoptimized
                  />
                  <div className="absolute inset-0 " />
                </div>
              ))}
            </div>
          </div>

          {/* Features Content */}
          <div className="space-y-72">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  ref={(el) => {
                    sectionRefs.current[index] = el;
                  }}
                  className="space-y-6 min-h-screen flex flex-col justify-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-primary/20 to-transparent" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/sign-up">
                    <Button className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
