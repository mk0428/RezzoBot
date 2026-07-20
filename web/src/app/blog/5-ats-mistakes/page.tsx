import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '5 Common ATS Resume Mistakes That Cost You Interviews | RezzoBot',
  description: 'Avoid these 5 ATS resume mistakes that prevent your application from reaching human recruiters. Fix them and improve your interview rate.',
  openGraph: {
    title: '5 Common ATS Resume Mistakes That Cost You Interviews',
    description: 'Avoid these 5 ATS resume mistakes and improve your interview rate.',
  },
};

export default function PostPage() {
  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-2xl mx-auto px-4 py-20">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 font-bold text-sm hover:underline">← Back to Blog</Link>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          5 Common ATS Resume Mistakes That Cost You Interviews
        </h1>
        <div className="text-sm text-gray-400 font-medium mb-8">July 20, 2026 · 5 min read</div>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg font-medium text-gray-600">
            You spend hours perfecting your resume. You tailor it to the role. You proofread three times. Then — radio silence. No callback. No rejection. Nothing.
          </p>
          <p>
            If this sounds familiar, you might be making one of these ATS-killing mistakes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Mistake #1: Using the Wrong Resume Format</h2>
          <p>This is the #1 reason resumes fail ATS parsing.</p>
          <p><strong>What goes wrong:</strong> Two-column layouts, tables, text boxes, headers/footers with important info, graphics, icons, and charts confuse the parser.</p>
          <p><strong>Why:</strong> ATS parsers read left-to-right, top-to-bottom. When content is in a table or text box, the parser cannot figure out the reading order. Important information gets scrambled or lost.</p>
          <p><strong>The fix:</strong> Use a simple, single-column layout with standard section headers (Experience, Education, Skills). No columns, no text boxes, no embedded images.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Mistake #2: Keyword Mismatch</h2>
          <p>Your resume says "led," but the job description says "managed." The ATS sees them as different things.</p>
          <p><strong>What goes wrong:</strong> You have the experience but use different terminology. Or you bury important keywords in paragraphs instead of making them scannable.</p>
          <p><strong>The fix:</strong> Mirror the exact language from the job description when it aligns with your experience. Put key skills in a dedicated section.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Mistake #3: No Quantified Results</h2>
          <p>"I was responsible for..." vs "Managed a team of 15, reducing costs by 22% in 6 months."</p>
          <p><strong>What goes wrong:</strong> Describing duties instead of impact. ATS systems weight quantified achievements higher because numbers stand out as concrete proof.</p>
          <p><strong>The fix:</strong> For every bullet point, ask: How many? How much? How fast? Add numbers wherever possible.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Mistake #4: Inconsistent Formatting</h2>
          <p>Mixed date formats (Jan 2024 vs 01/2024), different bullet styles, random capitalization.</p>
          <p><strong>What goes wrong:</strong> ATS systems flag inconsistency as a quality signal. It suggests the resume was rushed or copied from multiple sources.</p>
          <p><strong>The fix:</strong> Pick one format and use it everywhere. Consistent formatting signals professionalism.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Mistake #5: One Resume for Every Application</h2>
          <p>Your resume for a software engineering role should not be the same as one for a product management role.</p>
          <p><strong>What goes wrong:</strong> Different roles require different keyword sets and different emphasis. Generic resumes score lower against every JD.</p>
          <p><strong>The fix:</strong> Start with a master resume, then customize for each application. At minimum, adjust your skills section and top 3 bullet points for each role.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How to Check If Your Resume Has These Problems</h2>
          <p>
            The fastest way: run it through a free ATS checker. RezzoBot compares your resume against any job description and gives you a match score. It shows exactly which keywords match, which are missing, and how to improve.
          </p>
          <p>And it is free for one analysis per day — no credit card, no signup required.</p>

          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="font-bold text-gray-900">Check your resume for ATS issues</p>
            <p className="text-gray-600 mt-1">Get your free ATS score in under 30 seconds.</p>
            <a
              href="https://rezzobot.vercel.app/upload"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Run Free ATS Check
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
