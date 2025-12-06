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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
  : new URL('https://world-cup.tc9011.com');

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "2026 FIFA World Cup Guide | Schedule & Standings",
    template: "%s | 2026 FIFA World Cup Guide"
  },
  description: "Comprehensive guide for the 2026 FIFA World Cup in USA, Mexico, and Canada. Interactive match schedule, live standings, knockout bracket, and venue information.",
  keywords: ["2026 FIFA World Cup", "FIFA World Cup", "Schedule", "Standings", "Bracket", "USA", "Mexico", "Canada", "Football", "Soccer"],
  authors: [{ name: "2026 FIFA World Cup Guide" }],
  creator: "2026 FIFA World Cup Guide",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "2026 FIFA World Cup Guide | Schedule & Standings",
    description: "The ultimate interactive guide for the 2026 FIFA World Cup. Track every match, group standings, and the road to the final.",
    siteName: "2026 FIFA World Cup Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 FIFA World Cup Guide | Schedule & Standings",
    description: "The ultimate interactive guide for the 2026 FIFA World Cup. Track every match, group standings, and the road to the final.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Placeholder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "FIFA World Cup 2026",
    "startDate": "2026-06-11",
    "endDate": "2026-07-19",
    "location": {
      "@type": "Place",
      "name": "North America",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "USA, Mexico, Canada"
      }
    },
    "description": "The 2026 FIFA World Cup will be the 23rd FIFA World Cup, a quadrennial international men's football championship contested by the national teams of the member associations of FIFA.",
    "organizer": {
      "@type": "Organization",
      "name": "FIFA",
      "url": "https://www.fifa.com"
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
