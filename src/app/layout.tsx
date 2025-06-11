"use client";
import { Providers } from "@/app/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-nav";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();

  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <title>study app</title>
      </head>
      <body>
        {!loading && (
          <>
            {isAuthenticated ? (
              <SidebarProvider>
                <AppSidebar />
                <main className="ml-4 mr-12 w-full my-4">
                  <Providers>{children}</Providers>
                </main>
              </SidebarProvider>
            ) : (
              <main className="w-full">
                <Providers>{children}</Providers>
              </main>
            )}
          </>
        )}
        <Toaster />
      </body>
    </html>
  );
}
