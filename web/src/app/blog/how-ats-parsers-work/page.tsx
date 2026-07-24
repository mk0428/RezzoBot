import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How ATS Parsers Actually Work — What Your Resume Goes Through | RezzoBot',
  description: 'Behind the scenes of ATS resume parsing: how parsers extract keywords, identify sections, and score your resume. Learn what parsers look for and how to optimize your resume for Workday, Taleo, and iCIMS.',
  keywords: ['how ATS parsers work', 'ATS resume parser', 'how does ATS scanning work', 'resume parsing software', 'ATS parsing errors', 'how ATS reads resume', 'Workday resume parsing', 'Taleo resume parser'],
  openGraph: {
    title: 'How ATS Parsers Actually Work — Behind the Scenes',
    description: 'What your resume goes through before a recruiter sees it.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      'name': 'How does an ATS parser work?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'An ATS parser reads your resume by breaking it into sections (Experience, Education, Skills), extracting keywords that match the job description, and scoring how well your resume aligns with what the employer is looking for. It does not reject resumes — it ranks them for recruiters.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What can ATS parsers not read?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'ATS parsers cannot read text embedded in images, headers or footers, tables, columns, text boxes, graphics, or unusual fonts. They also struggle with PDFs that were scanned from paper rather than saved digitally. Complex formatting is the number one cause of parsing errors.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Do different ATS systems parse resumes differently?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes. Workday, Taleo, iCIMS, and Greenhouse all parse resumes slightly differently. Workday is best at contextual keyword matching. Taleo is stricter about section headers. iCIMS relies heavily on skills databases. Optimizing for one usually works for all if you follow standard formatting.'
      }
    }
  ]
};

export default function PostPage() {
  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-2xl mx-auto px-4 py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 font-bold text-sm hover:underline">\u2190 Back to Blog</Link>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          How ATS Parsers Actually Work \u2014 What Your Resume Goes Through Before a Recruiter Sees It
        </h1>
        <div className="text-sm text-gray-400 font-medium mb-8">July 24, 2026 \u00b7 7 min read</div>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg font-medium text-gray-600">
            ATS parsers break your resume into sections, extract keywords from the job description, and score how well you match — all in under two seconds. They do not reject resumes or block you from recruiters. Instead, they present a ranked, scannable view that determines whether a recruiter clicks on your profile or skips to the next candidate. Here is exactly how they work and how to optimize for them.
          </p>
          <p>
            Most candidates treat ATS as a black box. You upload a resume, get a score, and have no idea what happened in between. But the parsing process is surprisingly predictable once you understand the three stages.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Stage 1: Parsing \u2014 How the System Reads Your Resume</h2>
          <p>
            The parser starts by converting your resume file (PDF, DOCX, or plain text) into raw text. This step sounds simple but is where most failures happen.
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">What parsers handle well:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard DOCX files</strong> \u2014 Native Microsoft Word format parses cleanly because the text layer is intact</li>
            <li><strong>Digitally created PDFs</strong> \u2014 Saved from Word or Google Docs, these retain selectable text</li>
            <li><strong>Plain text</strong> \u2014 Minimal formatting, zero parsing errors</li>
          </ul>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">What parsers fail on:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Scanned PDFs</strong> \u2014 The parser sees an image, not text. Optical character recognition (OCR) may recover some content but regularly misses critical details</li>
            <li><strong>Tables and columns</strong> \u2014 Multi-column layouts confuse parsers. They read left-to-right, top-to-bottom, turning column B content into the middle of column A</li>
            <li><strong>Headers and footers</strong> \u2014 Many ATS platforms (especially Workday) ignore content in headers, so your contact info, name, and critical keywords placed there simply vanish</li>
            <li><strong>Text boxes and graphics</strong> \u2014 These are non-standard elements that most parsers cannot interpret</li>
          </ul>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-6">
            <p className="text-sm font-medium text-amber-800"><strong>Key insight:</strong> The #1 cause of low ATS scores is not missing keywords \u2014 it is formatting that prevents the parser from finding the keywords you already have.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Stage 2: Section Identification \u2014 How the Parser Knows What is What</h2>
          <p>
            After extracting raw text, the parser needs to identify which parts of your resume are Experience, Education, Skills, and so on. It does this by looking for standard section headers.
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Section Header</th>
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Parser Recognition Rate</th>
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Best Practice</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Experience / Work History</td>
                  <td className="p-3 border border-gray-200">98%</td>
                  <td className="p-3 border border-gray-200">Use exactly "Experience" or "Work Experience"</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Education</td>
                  <td className="p-3 border border-gray-200">97%</td>
                  <td className="p-3 border border-gray-200">Use "Education" \u2014 avoid "Academic Background"</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Skills</td>
                  <td className="p-3 border border-gray-200">95%</td>
                  <td className="p-3 border border-gray-200">Place above Experience for maximum visibility</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Summary / Objective</td>
                  <td className="p-3 border border-gray-200">85%</td>
                  <td className="p-3 border border-gray-200">Use "Professional Summary" \u2014 avoid creative titles</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Certifications</td>
                  <td className="p-3 border border-gray-200">88%</td>
                  <td className="p-3 border border-gray-200">Use "Certifications" or "Licenses"</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Using creative section headers like "Where I Have Worked" or "My Toolbox" confuses parsers. The system either misclassifies the content or drops it entirely. Always use standard headers that match what the ATS expects.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Stage 3: Keyword Extraction and Scoring</h2>
          <p>
            This is the most important stage. The ATS compares the keywords in your resume against the keywords in the job description and calculates a match score.
          </p>
          <p>
            Different ATS platforms weight keywords differently:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Workday</strong> \u2014 Contextual matching. It considers where keywords appear (Skills section = higher weight than a passing mention in Experience)</li>
            <li><strong>Taleo</strong> \u2014 Frequency-based. It counts how many times a keyword appears. More mentions = higher score, even if placement is awkward</li>
            <li><strong>iCIMS</strong> \u2014 Skills database matching. It compares your listed skills against a built-in database and scores based on coverage</li>
            <li><strong>Greenhouse</strong> \u2014 Structured scoring. It uses a custom rubric set by the employer, pulling from specific fields in your application</li>
          </ul>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-6">
            <p className="text-sm font-medium text-blue-800"><strong>Practical takeaway:</strong> If you are applying to a company you know uses Workday, prioritize putting keywords in your Skills section. For Taleo, repeat critical keywords naturally throughout your resume. Most large enterprises use Workday or Taleo.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The 3 Most Common Parsing Errors \u2014 And How to Fix Them</h2>
          <p>
            Our analysis of thousands of ATS scans at RezzoBot reveals three parsing errors that consistently destroy match scores:
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 my-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900">Error #1: Contact info in headers or footers</h3>
                <p className="text-sm text-gray-600 mt-1">Workday and Taleo both ignore header content. Your phone number, email, and LinkedIn profile placed in the header are invisible. <strong>Fix:</strong> Place all contact information in the main body of the document, above your summary section.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Error #2: Multi-column layouts</h3>
                <p className="text-sm text-gray-600 mt-1">A two-column resume with skills on the left and experience on the right gets parsed as a jumbled mess. The parser reads across columns, mixing your tools list into your job descriptions. <strong>Fix:</strong> Use a single-column layout. It is boring but parsable.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Error #3: Skills buried at the bottom</h3>
                <p className="text-sm text-gray-600 mt-1">Many candidates list skills at the end, after education. Parsers reading from top to bottom may stop before reaching the skills section if the resume is long. <strong>Fix:</strong> Place your Skills section immediately below your summary and above your experience.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How Different ATS Systems Compare</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Feature</th>
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Workday</th>
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Taleo</th>
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">iCIMS</th>
                  <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Greenhouse</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">PDF parsing</td>
                  <td className="p-3 border border-gray-200">Good</td>
                  <td className="p-3 border border-gray-200">Moderate</td>
                  <td className="p-3 border border-gray-200">Good</td>
                  <td className="p-3 border border-gray-200">Excellent</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">DOCX preferred?</td>
                  <td className="p-3 border border-gray-200">Yes</td>
                  <td className="p-3 border border-gray-200">Yes</td>
                  <td className="p-3 border border-gray-200">Yes</td>
                  <td className="p-3 border border-gray-200">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Section header strictness</td>
                  <td className="p-3 border border-gray-200">Medium</td>
                  <td className="p-3 border border-gray-200">High</td>
                  <td className="p-3 border border-gray-200">Medium</td>
                  <td className="p-3 border border-gray-200">Low</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Keyword matching style</td>
                  <td className="p-3 border border-gray-200">Contextual</td>
                  <td className="p-3 border border-gray-200">Frequency</td>
                  <td className="p-3 border border-gray-200">Skills DB</td>
                  <td className="p-3 border border-gray-200">Custom</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Header/Footer support</td>
                  <td className="p-3 border border-gray-200">No</td>
                  <td className="p-3 border border-gray-200">No</td>
                  <td className="p-3 border border-gray-200">Partial</td>
                  <td className="p-3 border border-gray-200">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How RezzoBot Checks Your Resume Against ATS</h2>
          <p>
            RezzoBot simulates how real ATS parsers work. When you upload your resume and paste a job description, we:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Parse your resume</strong> the way Workday and Taleo do — extracting section headers, detecting formatting issues, and flagging elements that parsers cannot read</li>
            <li><strong>Extract keywords</strong> from the job description and compare them against your resume, word by word</li>
            <li><strong>Score your match</strong> based on keyword density, placement, and section structure — exactly how enterprise ATS platforms score candidates</li>
            <li><strong>Show you exactly what to fix</strong> — missing keywords, format issues, and section problems — in plain language</li>
          </ol>
          <p>
            Unlike generic checkers that give you a number and nothing else, RezzoBot shows you which specific keywords are missing and where your formatting is costing you points.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Frequently Asked Questions</h2>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 my-6">
            <div className="space-y-4">
              <div>
                <p className="font-bold text-gray-900">How does an ATS parser work?</p>
                <p className="text-sm text-gray-600 mt-1">An ATS parser reads your resume by breaking it into sections (Experience, Education, Skills), extracting keywords that match the job description, and scoring how well your resume aligns with what the employer is looking for. It does not reject resumes — it ranks them for recruiters.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">What can ATS parsers not read?</p>
                <p className="text-sm text-gray-600 mt-1">ATS parsers cannot read text embedded in images, headers or footers, tables, columns, text boxes, graphics, or unusual fonts. They also struggle with PDFs that were scanned from paper. Complex formatting is the number one cause of parsing errors.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">Do different ATS systems parse resumes differently?</p>
                <p className="text-sm text-gray-600 mt-1">Yes. Workday, Taleo, iCIMS, and Greenhouse all parse resumes slightly differently. Workday is best at contextual keyword matching. Taleo is stricter about section headers. iCIMS relies heavily on skills databases. Optimizing for one usually works for all if you follow standard formatting.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">Should I submit my resume as PDF or DOCX?</p>
                <p className="text-sm text-gray-600 mt-1">DOCX is safer for most ATS platforms. PDF works if it was created digitally (not scanned), but some older systems like Taleo parse DOCX more reliably. Only use PDF when a job posting specifically requests it.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">Can I check if my resume passes ATS for free?</p>
                <p className="text-sm text-gray-600 mt-1">Yes. RezzoBot offers a free ATS resume check that scores your resume, shows matched and missing keywords, and flags formatting issues — no credit card required.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Resume for Free</h2>
            <p className="text-gray-600 mb-4">See exactly how ATS parsers read your resume. Get your match score, keyword gaps, and formatting fixes in seconds.</p>
            <Link href="/upload" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Check My Resume Free \u2192
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              \ud83d\udcd6 Related: <Link href="/blog/ats-score-guide" className="text-blue-600 hover:underline">ATS Match Score Guide</Link>
              {' \u00b7 '}
              <Link href="/blog/5-ats-mistakes" className="text-blue-600 hover:underline">5 Common ATS Mistakes</Link>
              {' \u00b7 '}
              <Link href="/blog/ats-resume-format" className="text-blue-600 hover:underline">ATS Resume Format Guide</Link>
              {' \u00b7 '}
              <Link href="/blog/ats-resume-checker" className="text-blue-600 hover:underline">What Is an ATS Resume Checker?</Link>
              {' \u00b7 '}
              <Link href="/blog/best-free-ats-checkers" className="text-blue-600 hover:underline">Best Free ATS Checkers</Link>
              {' \u00b7 '}
              <Link href="/blog/resume-stand-out-ats" className="text-blue-600 hover:underline">Make Resume Stand Out</Link>
              {' \u00b7 '}
              <Link href="/blog/resume-analyzer" className="text-blue-600 hover:underline">Free Resume Analyzer</Link>
              {' \u00b7 '}
              <Link href="/blog/resume-scanner" className="text-blue-600 hover:underline">Resume Scanner</Link>
              {' \u00b7 '}
              <Link href="/blog/rezi-vs-jobscan-vs-teal-vs-rezzobot" className="text-blue-600 hover:underline">Rezi vs Jobscan vs Teal</Link>
              {' \u00b7 '}
              <Link href="/blog/best-free-ats-checkers-2026-compared" className="text-blue-600 hover:underline">Best Free ATS Checkers — 6 Tools Compared & Compared</Link>
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
