"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-nav";
import "@/app/globals.css";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="ml-4 mr-12 w-full my-4 overflow-x-hidden">
        {children}
      </main>
    </SidebarProvider>
  );
}
