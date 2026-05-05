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
  title: {
    default: "Tech Blog – Web Development, React, Next.js Guides",
    template: "%s | Tech Blog",
  },
  description:
    "Learn React, Next.js, JavaScript, and system design with practical guides, tutorials, and real-world examples.",
  keywords: [
    "React tutorials",
    "Next.js blog",
    "frontend development",
    "JavaScript guides",
    "web development blog"
  ],
  authors: [{ name: "Himanshu Kumar" }],
  openGraph: {
    title: "Tech Blog",
    description:
      "Practical guides on React, Next.js, and modern web development.",
    url: "https://blogging-app-frontend-ten.vercel.app/",
    siteName: "Tech Blog",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
