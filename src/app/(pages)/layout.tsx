"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-nav";
import { MobileNavbar } from "@/components/ui/mobile-navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/ui/footer";
import "@/app/globals.css";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use the existing hook to determine if on mobile
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      {/* Only render AppSidebar on desktop */}
      {!isMobile && <AppSidebar />}

      {/* Only render MobileNavbar on mobile */}
      {isMobile && <MobileNavbar />}

      <main
        className="pl-2 pr-2 lg:pr-12 w-full py-4 overflow-x-hidden lg:pt-0 pt-16"
        suppressHydrationWarning
      >
        {children}
        <Footer />
      </main>
    </SidebarProvider>
  );
}
