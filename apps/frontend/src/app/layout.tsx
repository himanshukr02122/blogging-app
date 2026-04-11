import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "../contexts/AppProvider";
import Header from "@/components/layout/Header";
import { Providers } from "./providers";
import ThemeToggle from "@/components/ui/ThemeMode";

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
              className="mt-18 bg-white dark:bg-gray-900"
            >
              {children}
            </main>
            <div      
              className="fixed bottom-8 right-8 z-10"
            >
              <ThemeToggle />
            </div>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
