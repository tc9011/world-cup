import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

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
    default: "2026 World Cup Guide | Schedule & Standings",
    template: "%s | 2026 World Cup Guide"
  },
  description: "Comprehensive guide for the 2026 FIFA World Cup in USA, Mexico, and Canada. Interactive match schedule, live standings, knockout bracket, and venue information.",
  keywords: ["World Cup 2026", "FIFA World Cup", "Schedule", "Standings", "Bracket", "USA", "Mexico", "Canada", "Football", "Soccer"],
  authors: [{ name: "2026 World Cup Guide" }],
  creator: "2026 World Cup Guide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://2026-world-cup-guide.vercel.app",
    title: "2026 World Cup Guide | Schedule & Standings",
    description: "The ultimate interactive guide for the 2026 FIFA World Cup. Track every match, group standings, and the road to the final.",
    siteName: "2026 World Cup Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 World Cup Guide | Schedule & Standings",
    description: "The ultimate interactive guide for the 2026 FIFA World Cup. Track every match, group standings, and the road to the final.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
