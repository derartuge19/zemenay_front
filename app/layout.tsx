import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalStyles } from "./global-styles";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Zemenay Tech Blog",
  description: "A modern blog platform built with Next.js and Supabase",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GlobalStyles />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col",
        "text-foreground bg-background", // Ensure text and background colors are set
        inter.variable
      )}>
        <Providers>
          <div className="flex-1">
            <Navbar />
            <main className="min-h-[calc(100vh-200px)]">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}