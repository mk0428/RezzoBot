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
    "ATS resume checker",
    "free ATS resume checker",
    "resume score checker",
    "resume ai checker",
    "AI resume optimizer",
    "resume keyword match",
    "online resume checker",
    "resume ATS scanner",
    "how to make your resume stand out",
    "check resume for ATS",
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
  verification: {
    google: "SX6NKmYUc-nY8yr4bq6XT8eUBkYQaFcljKmOm_Iv56k",
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
              "@type": "SoftwareApplication",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is an ATS resume checker?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "An ATS resume checker is a tool that analyzes your resume against a job description and scores how well it matches. It checks for keyword alignment, formatting issues, and missing qualifications that could cause your resume to be rejected by Applicant Tracking Systems.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is RezzoBot free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. RezzoBot offers a free ATS resume check that scores your resume and shows matched and missing keywords. Paid plans unlock AI-powered resume optimization and PDF/DOCX export.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I check if my resume is ATS friendly?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Upload your resume and the job description you're targeting to a free ATS checker like RezzoBot. It will show you an ATS match score, highlight which keywords from the job description your resume includes, and point out what's missing.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does ATS resume scoring work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "ATS resume scoring compares the keywords, skills, and qualifications in your resume against those in a target job description. The score reflects how closely your resume matches what the ATS is looking for. Higher scores mean better chances of passing automated screening.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What makes a resume ATS friendly?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "An ATS-friendly resume uses a simple single-column layout with standard section headers (Experience, Education, Skills), includes keywords from the job description naturally, avoids tables and graphics, and uses standard fonts. Complex formatting is the #1 reason resumes get rejected by ATS.",
                  },
                },
              ],
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
