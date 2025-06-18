"use client";
import { Providers } from "@/app/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";

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
        <SpeedInsights />
        <Analytics />
        <AuthProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
