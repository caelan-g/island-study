"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-nav";
import "@/app/globals.css";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="pl-2 pr-12 w-full py-4 overflow-x-hidden">
        {children}
      </main>
    </SidebarProvider>
  );
}
