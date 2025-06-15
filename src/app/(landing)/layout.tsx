"use client";
import { LandingNavigationMenu } from "@/components/ui/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNavigationMenu />
      <main className="w-full">{children}</main>
    </div>
  );
}
