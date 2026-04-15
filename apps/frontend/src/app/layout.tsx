import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "../contexts/AppProvider";
import Header from "@/components/layout/Header";
import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/next';
import BackendWakingUp from "@/components/layout/BackendWakingUp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blogging App",
  description: "Blog publishing workflow with author and admin review flows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <AppProvider>
            <Header />
            <main
              className="mt-16 bg-white dark:bg-gray-900"
            >
              {children}
            </main>
            <BackendWakingUp />
          </AppProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
