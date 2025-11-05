"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreePalm,
  Home,
  Table,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";

const features = [
  {
    id: "home",
    icon: Home,
    title: "Dashboard Overview",
    description:
      "Get a comprehensive view of your study progress, tasks, and upcoming deadlines. Track your learning journey and stay organized in one place.",
    image: "/images/landing/dashboarddesktop.jpg",
  },
  {
    id: "link",
    icon: Table,
    title: "Session Management",
    description:
      "Plan and track your study sessions effectively. Set goals, monitor your focus time, and analyze your studying patterns for better productivity.",
    image: "/images/landing/sessionsdesktop.jpg",
  },
  {
    id: "calendar",
    icon: TreePalm,
    title: "Your Archipelago",
    description:
      "Navigate through your personalized learning islands. Each island represents a subject area, helping you visualize and organize your study journey.",
    image: "/images/landing/archipelagodesktop.jpg",
  },
  {
    id: "bookmark",
    icon: GraduationCap,
    title: "Course Manager",
    description:
      "Organize and manage all your courses in one place. Track assignments, deadlines, and materials for each subject to stay on top of your studies.",
    image: "/images/landing/coursesdesktop.jpg",
  },
  {
    id: "trending",
    icon: Settings,
    title: "Settings",
    description:
      "Customize your study environment to match your learning style. Adjust notifications, themes, and preferences for an optimal study experience.",
    image: "/images/landing/settingsdesktop.jpg",
  },
];

export default function Component() {
  const [activeFeature, setActiveFeature] = useState(features[0]); // Default to market intelligence

  return (
    <div className="min-h-screen  text-gray-900 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Main heading */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Level up your studying.
        </motion.h1>

        {/* Central content area */}
        <div className="block lg:relative w-full max-w-6xl mx-auto">
          {/* Central image */}
          <div className="flex justify-center mb-8 lg:absolute w-full ">
            <div className="relative w-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature.id}
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  className="w-full h-full object-cover rounded-2xl border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 lg:block hidden">
                <div className="h-64 bg-gradient-to-t from-white to-transparent" />
                <div className="bg-white h-48" />
              </div>
            </div>
          </div>

          {/* Feature description */}
          <div className="block lg:relative lg:mt-[22rem] lg:right-8 max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-lg"
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
                  {activeFeature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {activeFeature.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation bar */}
          <div className="flex justify-center mt-6 lg:mt-12 lg:mx-0 ml-8">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full p-3 border border-white/30 shadow-lg">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <motion.button
                    key={feature.id}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      activeFeature.id === feature.id
                        ? "bg-black text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
                    }`}
                    onMouseEnter={() => setActiveFeature(feature)}
                  >
                    <IconComponent className="lg:w-12 lg:h-12 w-6 h-6" />
                  </motion.button>
                );
              })}
            </div>

            {/* Search button */}
            <div className="ml-2 lg:ml-4 lg:mr-0 mr-8 px-6 items-center bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg text-gray-600  transition-all duration-300">
              <LogOut className="lg:w-12 lg:h-12 w-6 h-6 my-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
