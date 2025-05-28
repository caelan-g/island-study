"use client";
import { cn } from "@/lib/utils";
import { Providers } from "@/app/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-nav";
import { Toaster } from "@/components/ui/sonner";

import "@/app/globals.css";
import App from "next/app";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="ml-4 mr-12 w-full my-4">
            <Providers>{children}</Providers>
          </main>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
