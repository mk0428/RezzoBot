import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "RezzoBot | Free ATS Resume Checker & AI Resume Optimizer",
  description:
    "Check your resume's ATS score for free. Get instant keyword matching against any job description, AI-powered optimization, and export to PDF/DOCX.",
  keywords: [
    "free ATS resume checker",
    "resume score",
    "ATS resume test",
    "resume keyword match",
    "AI resume optimizer",
    "resume analyzer free",
  ],
  openGraph: {
    title: "RezzoBot | Free ATS Resume Checker",
    description:
      "Check your resume's ATS score for free. Get instant keyword matching and AI optimization.",
    url: "https://rezzobot.com",
    siteName: "RezzoBot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RezzoBot | Free ATS Resume Checker",
    description:
      "Check your resume's ATS score for free. Get instant keyword matching and AI-powered optimization.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rezzobot.com",
  },
};

import { Analytics } from "@vercel/analytics/react";
import TrackingPing from "./components/TrackingPing";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "RezzoBot",
              url: "https://rezzobot.com",
              description:
                "Free ATS resume checker and AI resume optimizer. Score your resume against any job description.",
              applicationCategory: "Career Development",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free ATS resume check",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <TrackingPing />
      </body>
    </html>
  );
}
