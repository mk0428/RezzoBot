'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar } from 'lucide-react';

const posts = [
  {
    slug: 'ats-resume-checker',
    title: 'What Is an ATS Resume Checker and Do You Really Need One?',
    excerpt: 'An ATS resume checker simulates how applicant tracking systems read your resume. Learn how these tools work and whether you need one.',
    date: 'July 20, 2026',
    readTime: '4 min read',
  },
  {
    slug: '5-ats-mistakes',
    title: '5 Common ATS Resume Mistakes That Cost You Interviews',
    excerpt: 'Most resumes get rejected by ATS systems before a human ever sees them. Here are the 5 most common mistakes and how to fix them.',
    date: 'July 20, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'ats-score-guide',
    title: "ATS Match Score: What's a Good Score and How to Improve It",
    excerpt: "Learn what an ATS match score means, what score you should aim for, and 5 proven ways to improve your resume score.",
    date: 'July 20, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'ats-resume-format',
    title: 'How to Format Your Resume for ATS in 2026 (A Complete Guide)',
    excerpt: "PDF vs DOCX? Single column vs multi-column? Learn the exact resume format that passes ATS parsers every time.",
    date: 'July 22, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'best-free-ats-checkers',
    title: 'Best Free ATS Resume Checkers in 2026 — Tested & Compared',
    excerpt: 'We tested 5 free ATS resume checkers head-to-head. See which one gives you the most actionable feedback for zero dollars.',
    date: 'July 22, 2026',
    readTime: '7 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-20">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">RezzoBot Blog</h1>
        <p className="text-lg text-gray-500 font-medium mb-12 max-w-2xl">
          ATS tips, resume optimization guides, and career advice to help you land more interviews.
        </p>
        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={'/blog/' + post.slug}
              className="block group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center space-x-4 text-sm text-gray-400 font-medium mb-3">
                <span className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">{post.excerpt}</p>
              <div className="mt-4 flex items-center space-x-1 text-blue-600 font-bold text-sm group-hover:space-x-2 transition-all">
                <span>Read more</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
