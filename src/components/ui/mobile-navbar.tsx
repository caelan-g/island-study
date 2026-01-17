"use client";

import { useState } from "react";
import {
  Home,
  Table,
  Settings,
  TreePalm,
  GraduationCap,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useSubscription } from "@/contexts/subscription-context";
import TrialCounter from "@/components/ui/trial-counter";
import InfluencerBadge from "./influencer-badge";
import { navItems } from "@/app/data/nav-items";

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user: authUser, loading: authLoading } = useAuth();
  const { subscriptionStatus, endDate, subscriptionLoading } =
    useSubscription();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-xl font-semibold">
            Islands.
          </a>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="relative z-50"
            aria-label="Toggle menu"
          >
            <Menu
              className={`h-6 w-6 transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
          </Button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[200] bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-2 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center h-full px-8 pb-24">
          <nav className="w-full max-w-sm">
            <ul className="space-y-8">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.title}>
                    <a
                      href={item.url}
                      onClick={toggleMenu}
                      className="flex items-center space-x-2 text-xl font-medium text-gray-900 transition-colors duration-200 group"
                    >
                      <div className="flex items-center justify-center w-12 h-12  transition-colors duration-200">
                        <IconComponent className="h-5 w-5  transition-colors duration-200" />
                      </div>
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })}
              {subscriptionStatus == "active" && (
                <li className="flex">
                  <span className="text-sm font-semibold items-center flex rounded-full px-2 py-1 bg-[var(--chart-green)]/20 border-[var(--chart-green)] border text-[var(--chart-green)]">
                    Subscribed
                  </span>
                </li>
              )}
              {subscriptionStatus == "influencer" && (
                <li className="flex">
                  <InfluencerBadge />
                </li>
              )}
              {authUser &&
                !authLoading &&
                !subscriptionLoading &&
                subscriptionStatus &&
                (subscriptionStatus === "trialing" ||
                  subscriptionStatus === "expired") && (
                  <li className="flex" onClick={toggleMenu}>
                    <TrialCounter
                      subscriptionStatus={subscriptionStatus}
                      endDate={endDate}
                    />
                  </li>
                )}
            </ul>
          </nav>

          <div className="absolute bottom-8 text-center">
            <p className="text-sm text-gray-500">© 2025 Islands</p>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
