"use client";
import { Providers } from "@/app/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-nav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <title>study app</title>
      </head>
      <body>
        <SpeedInsights />
        <Analytics />
        <Providers>
          <div className="min-h-screen">
            <SidebarProvider>
              <AppSidebar />
              <main className="ml-4 mr-12 w-full my-4 overflow-x-hidden">
                {children}
              </main>
            </SidebarProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}
