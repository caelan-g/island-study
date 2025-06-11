"use client";
import { Providers } from "@/app/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-nav";
import "@/app/globals.css";

export default function RootLayout({
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
        <Providers>
          <div className="min-h-screen">
            <SidebarProvider>
              <AppSidebar />
              <main className="ml-4 mr-12 w-full my-4">{children}</main>
            </SidebarProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}
