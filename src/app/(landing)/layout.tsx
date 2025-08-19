"use client";
import Footer from "@/components/ui/footer";
import { LandingNavigationMenu } from "@/components/ui/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      <LandingNavigationMenu />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
