import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neural Nexus — AIML Club of CBIT",
  description: "The official website of the AIML Club at CBIT. Join us to explore, innovate, and create with Artificial Intelligence.",
  keywords: ["AIML", "CBIT", "Neural Nexus", "AI Club", "Machine Learning", "Hackathons"],
};

import { BackgroundGrid } from "@/components/ui/background-grid";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-white relative`}
      >
        <BackgroundGrid />
        <FloatingNavbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
