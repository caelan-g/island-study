"use client";
import { ThemeProvider } from "next-themes";
import { createContext } from "react";

export const ThemeContext = createContext({});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
}
