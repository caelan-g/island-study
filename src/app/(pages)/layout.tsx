"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-nav";
import Footer from "@/components/ui/footer";
import "@/app/globals.css";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main
        className="pl-2 pr-2 lg:pr-12 w-full py-4 overflow-x-hidden"
        suppressHydrationWarning
      >
        {children}
        <Footer />
      </main>
    </SidebarProvider>
  );
}
