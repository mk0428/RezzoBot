import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Resume Scanner — Check Your Resume for ATS Keywords Instantly | RezzoBot',
  description: 'Scan your resume against any job description with our free resume scanner. Get instant keyword matching, missing skills detection, and an ATS score. No signup required.',
  keywords: ['resume scanner', 'free resume scanner', 'resume keyword scanner', 'scan resume online', 'ATS resume scanner', 'resume scanning tool', 'keyword scan resume', 'resume checker online'],
  openGraph: {
    title: 'Free Resume Scanner — Check ATS Keywords Instantly',
    description: 'Upload your resume and scan it against any job description. Free, no signup, instant results.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a resume scanner?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A resume scanner is a tool that extracts keywords and qualifications from your resume and compares them against a target job description. It quickly identifies which terms match and which are missing, helping you optimize your resume for ATS screening.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does a free resume scanner work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A free resume scanner like RezzoBot uses AI to parse your uploaded resume, extract skills and keywords, then compare them against a job description you provide. It returns a match score, a list of matched keywords, and specific missing keywords you need to add.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is a resume scanner the same as an ATS checker?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They are very similar. A resume scanner focuses on keyword extraction and comparison, while an ATS checker also evaluates formatting and structure compatibility. RezzoBot does both in one scan.'
      }
    },
  ],
};

export default function ResumeScannerPage() {
  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/blog" className="text-blue-600 font-bold text-sm hover:underline">← Back to Blog</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pb-20">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            Resume Scanner: Check Your Resume for ATS Keywords Instantly
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-400 font-medium mb-6">
            <span>July 23, 2026</span>
            <span>5 min read</span>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            A resume scanner is the fastest way to check if your resume contains the keywords recruiters and ATS systems are looking for. Here's how to use one effectively.
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <h2>What Is a Resume Scanner?</h2>
          <p>
            A resume scanner is a tool that extracts all the text from your resume and scans it against a target job description. It identifies which keywords, skills, and qualifications you have — and more importantly, which ones you're missing.
          </p>
          <p>
            Think of it as a pre-submission check. Before you click "apply," a resume scanner tells you how likely your resume is to pass the automated screening.
          </p>

          <h2>Why Use a Resume Scanner?</h2>
          <p>
            ATS systems scan resumes for specific keywords before forwarding them to recruiters. If your resume doesn't contain the right terms, it gets rejected in seconds — regardless of your actual qualifications.
          </p>
          <p>
            A resume scanner helps you:
          </p>
          <ul>
            <li><strong>See exactly which keywords match</strong> — confirm your resume aligns with the job</li>
            <li><strong>Find missing keywords</strong> — identify gaps you didn't know existed</li>
            <li><strong>Get a quantitative score</strong> — measure your fit, not guess it</li>
            <li><strong>Scan multiple versions</strong> — test different resume versions against different jobs</li>
          </ul>

          <h2>How RezzoBot's Resume Scanner Works</h2>
          <p>
            RezzoBot's free resume scanner is built for speed and accuracy:
          </p>
          <ol>
            <li><strong>Upload your resume</strong> — PDF or DOCX format</li>
            <li><strong>Paste the job description</strong> — LinkedIn, company site, any source</li>
            <li><strong>Instant scan results</strong> — match score, keyword analysis, and improvement suggestions</li>
          </ol>
          <p>
            The entire process takes under 30 seconds. No account needed.
          </p>

          <h2>What to Look for in a Resume Scanner</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-bold text-sm">Capability</th>
                <th className="text-left p-3 font-bold text-sm">Why It Matters</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 font-medium">Real JD matching</td>
                <td className="p-3 text-gray-600">The scanner should use the actual job description, not generic keywords.</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-medium">Keyword-level detail</td>
                <td className="p-3 text-gray-600">A score alone isn't useful. You need to see exactly what's missing.</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-medium">Actionable fixes</td>
                <td className="p-3 text-gray-600">Each missing keyword should come with a suggestion for where to add it.</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-medium">No signup required</td>
                <td className="p-3 text-gray-600">You should be able to scan your resume immediately, not after creating an account.</td>
              </tr>
            </tbody>
          </table>

          <h2>Resume Scanner vs ATS Checker vs Resume Analyzer</h2>
          <p>
            These tools overlap, but here's how they differ:
          </p>
          <ul>
            <li><strong>Resume Scanner</strong> — fast keyword extraction and comparison, best for quick checks</li>
            <li><strong>ATS Checker</strong> — evaluates ATS compatibility including format and structure</li>
            <li><strong>Resume Analyzer</strong> — broader evaluation including experience relevance and skill gaps</li>
          </ul>
          <p>
            RezzoBot combines all three approaches in a single scan, giving you a complete picture in one click.
          </p>

          <h2>When Should You Scan Your Resume?</h2>
          <p>
            The best time to scan your resume is <strong>before every application</strong>. Job descriptions vary widely — a resume that's perfect for one role may miss key terms for another.
          </p>
          <p>
            Key moments to scan:
          </p>
          <ul>
            <li>Before applying to a new role</li>
            <li>After making changes to your resume</li>
            <li>When switching industries or roles</li>
            <li>If you've submitted 10+ applications without responses</li>
          </ul>

          <h2>Try It Free</h2>
          <p>
            No signup, no credit card. Upload your resume, paste a job description, and see your keyword match instantly.
          </p>
          <div className="mt-8">
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg"
            >
              Scan Your Resume Free →
            </Link>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Related Articles</h3>
            <ul className="space-y-2">
              <li><Link href="/blog/resume-analyzer" className="text-blue-600 hover:underline">Free Resume Analyzer: Check Against Any Job Description</Link></li>
              <li><Link href="/blog/ats-resume-format" className="text-blue-600 hover:underline">How to Format Your Resume for ATS in 2026</Link></li>
              <li><Link href="/blog/5-ats-mistakes" className="text-blue-600 hover:underline">5 Common ATS Resume Mistakes That Cost You Interviews</Link></li>
              <li><Link href="/blog/ats-resume-checker" className="text-blue-600 hover:underline">What Is an ATS Resume Checker and Do You Really Need One?</Link></li>
              <li><Link href="/blog/ats-score-guide" className="text-blue-600 hover:underline">ATS Match Score: What's a Good Score and How to Improve It</Link></li>
              <li><Link href="/blog/best-free-ats-checkers" className="text-blue-600 hover:underline">Best Free ATS Resume Checkers in 2026 — Tested & Compared</Link></li>
              <li><Link href="/blog/resume-stand-out-ats" className="text-blue-600 hover:underline">How to Make Your Resume Stand Out to ATS in 2026</Link></li>
              <li><Link href="/blog/rezi-vs-jobscan-vs-teal-vs-rezzobot" className="text-blue-600 hover:underline">Rezi vs Jobscan vs Teal vs RezzoBot — Best Free ATS Checker</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
