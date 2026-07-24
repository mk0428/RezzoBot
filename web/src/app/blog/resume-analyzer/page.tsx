import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Resume Analyzer — Check Your Resume Against Any Job Description | RezzoBot',
  description: 'Upload your resume and get a free AI-powered analysis. See which keywords match your target job, what\'s missing, and exactly how to fix it. No signup required.',
  keywords: ['resume analyzer', 'free resume analyzer', 'resume analysis tool', 'AI resume analyzer', 'resume checker', 'analyze resume online', 'resume keyword analyzer', 'resume review tool'],
  openGraph: {
    title: 'Free Resume Analyzer — AI-Powered Resume Analysis',
    description: 'Upload your resume and get a detailed ATS analysis against any job description. Free, no signup.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a resume analyzer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A resume analyzer is a tool that scans your resume and compares it against a target job description. It identifies keyword matches, missing skills, and formatting issues that could prevent your resume from passing ATS screening.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there a free resume analyzer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. RezzoBot offers a free resume analyzer that checks your resume against any job description and shows your ATS match score, matched keywords, and missing keywords with specific suggestions for improvement.'
      }
    },
    {
      '@type': 'Question',
      name: 'How accurate are AI resume analyzers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI resume analyzers like RezzoBot use the same keyword-matching logic that real ATS systems use. They accurately identify which keywords from a job description are present or missing in your resume, giving you a reliable match score.'
      }
    },
  ],
};

export default function ResumeAnalyzerPage() {
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
            Free Resume Analyzer: Check Your Resume Against Any Job Description
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-400 font-medium mb-6">
            <span>July 23, 2026</span>
            <span>5 min read</span>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            A resume analyzer is a tool that scans your resume against a job description and shows you exactly which keywords match, what is missing, and how to improve your score — before a recruiter ever sees it. Here is how to use one effectively.
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <h2>What Is a Resume Analyzer?</h2>
          <p>
            A resume analyzer is a tool that scans your resume and compares it against a target job description. It checks for keyword alignment, skills matching, experience relevance, and formatting compatibility. The result is a score and a list of specific improvements you can make.
          </p>
          <p>
            Unlike a simple spell-check or grammar checker, a resume analyzer evaluates your resume the way an ATS (Applicant Tracking System) does. It looks for the exact keywords, phrases, and qualifications that employers are screening for.
          </p>

          <h2>Why Use a Resume Analyzer?</h2>
          <p>
            According to recruiting data, 75% of resumes are rejected by ATS systems before a human sees them. The #1 reason? <strong>Keyword mismatch</strong> — your resume doesn't include the terms the employer is searching for.
          </p>
          <p>
            A resume analyzer solves this by:
          </p>
          <ul>
            <li><strong>Comparing your resume</strong> against a real job description — not generic advice</li>
            <li><strong>Showing your match score</strong> — exactly how aligned your resume is with the role</li>
            <li><strong>Listing matched keywords</strong> — what you're doing right</li>
            <li><strong>Listing missing keywords</strong> — what you need to add</li>
            <li><strong>Giving actionable suggestions</strong> — specific fixes, not vague tips</li>
          </ul>

          <h2>How RezzoBot's Resume Analyzer Works</h2>
          <p>
            RezzoBot's free resume analyzer is designed to be instant and actionable:
          </p>
          <ol>
            <li><strong>Upload your resume</strong> — PDF or DOCX, no signup required</li>
            <li><strong>Paste the job description</strong> — the exact role you're targeting</li>
            <li><strong>Get your analysis</strong> — score, keyword match report, and specific suggestions</li>
          </ol>
          <p>
            The analysis highlights exactly which keywords from the job description your resume already contains and which ones you're missing. Each missing keyword comes with a suggested fix.
          </p>

          <h2>What Makes a Good Resume Analysis?</h2>
          <p>
            Not all resume analyzers are created equal. Here's what to look for:
          </p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-bold text-sm">Feature</th>
                <th className="text-left p-3 font-bold text-sm">Why It Matters</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 font-medium">Job-specific matching</td>
                <td className="p-3 text-gray-600">Generic tips won't help. Your analysis should be tailored to each job.</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-medium">Keyword-level detail</td>
                <td className="p-3 text-gray-600">You need to see exactly which words are matched and missing, not just a score.</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-medium">Actionable suggestions</td>
                <td className="p-3 text-gray-600">Knowing you're missing a keyword is useless without knowing where to put it.</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-medium">Free to try</td>
                <td className="p-3 text-gray-600">You should be able to analyze your resume without committing to a subscription.</td>
              </tr>
            </tbody>
          </table>

          <h2>Resume Analyzer vs ATS Checker vs Resume Scanner</h2>
          <p>
            These terms are often used interchangeably, but they have subtle differences:
          </p>
          <ul>
            <li><strong>Resume Analyzer</strong> — broad evaluation of your resume's fit for a specific role</li>
            <li><strong>ATS Checker</strong> — specifically tests whether your resume will pass automated screening</li>
            <li><strong>Resume Scanner</strong> — quickly extracts and checks keywords from your resume against a job</li>
          </ul>
          <p>
            RezzoBot combines all three: it analyzes your resume, checks ATS compatibility, and scans for keyword matches in one step.
          </p>

          <h2>Try It Free</h2>
          <p>
            No signup, no credit card. Just upload your resume, paste a job description, and get your analysis in seconds.
          </p>
          <div className="mt-8">
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg"
            >
              Analyze Your Resume Free →
            </Link>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Related Articles</h3>
            <ul className="space-y-2">
              <li><Link href="/blog/5-ats-mistakes" className="text-blue-600 hover:underline">5 Common ATS Resume Mistakes That Cost You Interviews</Link></li>
              <li><Link href="/blog/ats-score-guide" className="text-blue-600 hover:underline">ATS Match Score: What's a Good Score and How to Improve It</Link></li>
              <li><Link href="/blog/best-free-ats-checkers" className="text-blue-600 hover:underline">Best Free ATS Resume Checkers in 2026 — Tested & Compared</Link></li>
              <li><Link href="/blog/ats-resume-checker" className="text-blue-600 hover:underline">What Is an ATS Resume Checker and Do You Really Need One?</Link></li>
              <li><Link href="/blog/resume-scanner" className="text-blue-600 hover:underline">Resume Scanner: Check Your Resume for ATS Keywords Instantly</Link></li>
              <li><Link href="/blog/ats-resume-format" className="text-blue-600 hover:underline">How to Format Your Resume for ATS in 2026</Link></li>
              <li><Link href="/blog/resume-stand-out-ats" className="text-blue-600 hover:underline">How to Make Your Resume Stand Out to ATS in 2026</Link></li>
              <li><Link href="/blog/rezi-vs-jobscan-vs-teal-vs-rezzobot" className="text-blue-600 hover:underline">Rezi vs Jobscan vs Teal vs RezzoBot — Best Free ATS Checker</Link></li>
              <li><Link href="/blog/how-ats-parsers-work" className="text-blue-600 hover:underline">How ATS Parsers Actually Work</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
