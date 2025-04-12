import { cn } from "@/lib/utils";
import { Providers } from "@/app/theme-provider";

import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <body className="mx-4 lg:mx-48">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
