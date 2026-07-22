import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Format Your Resume for ATS in 2026 (A Complete Guide) | RezzoBot',
  description: 'Learn exactly how to format your resume for ATS in 2026. Covers file formats (PDF vs DOCX vs TXT), fonts, section headers, single vs multi-column layouts, margins, and more.',
  keywords: ['ATS resume format 2026', 'best resume format for ATS', 'how to format resume for ATS', 'ATS friendly resume template', 'resume file format for ATS', 'should I use PDF for ATS resume', 'does resume format matter ATS', 'single column resume ATS', 'ATS resume formatting tips'],
  openGraph: {
    title: 'How to Format Your Resume for ATS in 2026 (A Complete Guide)',
    description: 'The complete guide to ATS-compatible resume formatting — file formats, fonts, layouts, and more.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best file format for an ATS resume?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DOCX is the safest and most reliable format for ATS resumes. While PDFs are widely accepted, some older ATS systems still struggle to parse them correctly. TXT files work but lack formatting that helps human readers. For maximum compatibility, always submit a DOCX file unless the job posting specifically requests another format.'
      }
    },
    {
      '@type': 'Question',
      name: 'Should I use a single-column or multi-column resume for ATS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Single-column layouts are far superior for ATS parsing. Multi-column and two-column layouts often confuse ATS parsers, causing them to read content out of order mix sections together, or miss entire blocks of text. A clean single-column format ensures the parser reads your resume exactly as you intended.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can ATS read tables in a resume?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ATS systems generally cannot parse tables well. When you use a table, the parser may jumble the content, read cells in the wrong order, or skip entire sections entirely. Always use plain text formatting with standard bullet points and section headers instead of tables or text boxes.'
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
          <Link href="/blog" className="text-blue-600 font-bold text-sm hover:underline">← Back to Blog</Link>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          How to Format Your Resume for ATS in 2026 (A Complete Guide)
        </h1>
        <div className="text-sm text-gray-400 font-medium mb-8">July 22, 2026 · 6 min read</div>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg font-medium text-gray-600">
            You spent hours tailoring your resume for a dream job. You hit submit. And then — nothing. No rejection, no interview, just silence.
          </p>
          <p>
            More often than not, the culprit isn't your experience or qualifications. It's how your resume is <strong>formatted</strong>. Applicant Tracking Systems (ATS) parse your resume before it ever reaches human eyes, and if the format isn't compatible, the parser will garble your content or miss critical sections entirely.
          </p>
          <p>
            This guide covers everything you need to know about ATS-friendly resume formatting in 2026 — from file format decisions to layout choices that could make or break your job application.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why ATS Formatting Matters</h2>
          <p>
            Roughly 75% of large companies and 50% of mid-size companies use an ATS to manage incoming applications. These systems scan each resume, extract key information (contact details, work history, skills, education), and rank candidates based on keyword relevance to the job description.
          </p>
          <p>
            If your resume uses a format the ATS can't parse correctly, the system may extract incomplete or scrambled data. Missing contact info, garbled job titles, or skills that end up in the wrong section all hurt your chances — regardless of how qualified you are.
          </p>
          <p>
            The good news? ATS formatting isn't complicated. Once you know the rules, you can build a resume that both machines and humans love.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">PDF vs DOCX vs TXT: Which File Format Should You Use?</h2>
          <p>
            This is the single most common question about ATS formatting — and for good reason. The wrong file format can make your entire resume invisible to an ATS.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6">DOCX — The Gold Standard</h3>
          <p>
            <strong>DOCX is the safest choice for ATS compatibility.</strong> Microsoft Word's native format (.docx) is the most widely supported file type across all major ATS platforms. Modern ATS systems are built to parse DOCX files efficiently, extracting text, headers, and bullet points with high accuracy.
          </p>
          <p>
            When you save your resume as DOCX, you can use bold, italics, standard fonts, and bullet points without worrying about parsing issues. This is the format most recruiters prefer and most ATS systems handle best.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6">PDF — Mostly Safe, With Caveats</h3>
          <p>
            PDFs preserve your exact formatting across devices, which makes them great for human readers. Most modern ATS platforms — including Greenhouse, Lever, Workday, and Taleo — can parse PDFs reasonably well in 2026.
          </p>
          <p>
            However, older ATS systems still struggle with PDFs. The parsing depends heavily on how the PDF was created. A PDF generated from Word using "Save as PDF" generally works fine. A PDF created by scanning a printed resume (a scanned image) is essentially unreadable to most ATS parsers.
          </p>
          <p className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
            <strong>Rule of thumb:</strong> If the job posting doesn't specify a format, use DOCX. If they ask for PDF, send a text-based PDF generated directly from a Word processor — never a scanned image.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6">TXT — Last Resort Only</h3>
          <p>
            Plain text files (.txt) are guaranteed to be parseable — there's no formatting for the ATS to misinterpret. But that's also the problem. TXT files strip all formatting, making your resume hard for human recruiters to scan. Use TXT only when a system explicitly requires it.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Font Choices That Work With ATS</h2>
          <p>
            Your font choice matters more than you might think. ATS parsers need to recognize characters to extract text, and some fonts cause problems.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Safe fonts:</strong> Arial, Calibri, Times New Roman, Helvetica, Verdana, Georgia — these standard fonts render cleanly and parse without issues.</li>
            <li><strong>Avoid:</strong> Decorative or script fonts (Comic Sans, Brush Script, Lobster), symbols as bullets, and fonts with non-standard character spacing.</li>
            <li><strong>Font size:</strong> 10-12pt for body text, 14-16pt for your name, 12-14pt for section headers. Keep it readable.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Section Headers: Stick to the Standards</h2>
          <p>
            ATS parsers identify sections by looking for common header names. When you use creative headers, the parser may not recognize the section at all.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Use:</strong> Experience, Work Experience, Professional Experience, Education, Skills, Certifications, Summary, Professional Summary</li>
            <li><strong>Avoid:</strong> "Where I've Worked," "My Toolbox," "Things I Know," "Career Journey," "What I Bring to the Table"</li>
          </ul>
          <p>
            Keep headers simple and bold. Don't add decorative elements like underlines, boxes, or unusual spacing around headers. The parser looks for header text patterns — make it easy to find.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Single-Column vs Multi-Column Layouts</h2>
          <p>
            This is one of the most impactful formatting decisions you'll make. <strong>Always choose a single-column layout for ATS compatibility.</strong>
          </p>
          <p>
            Multi-column and two-column layouts — popular in modern resume templates — are problematic because ATS parsers read left-to-right, top-to-bottom. In a two-column layout, the parser might read the left column entirely first, then the right column. This means your work experience (right column) might appear after your skills (left column) in the parsed output. In the worst case, the parser may jumble text from both columns together, creating unreadable content.
          </p>
          <p>
            A clean single-column layout ensures the ATS reads your resume in the exact order you intend. Your name, summary, experience, education, and skills appear sequentially — just like you want them to.
          </p>
          <p>
            If you're considering a multi-column template, <Link href="/blog/ats-resume-checker" className="text-blue-600 hover:underline">run it through an ATS checker</Link> to see how the parser interprets it. You might be surprised at how badly columns can scramble your content.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Margins, Headers, and Footers</h2>
          <p>
            Details matter when it comes to margins, headers, and footers — many ATS systems handle these elements differently than you'd expect.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Margins:</strong> Use 0.5 to 1 inch on all sides. Too narrow (under 0.3 inches) can cause text clipping in some ATS views. Too wide wastes valuable space.</li>
            <li><strong>Headers and footers:</strong> Avoid putting critical information in document headers or footers. Some ATS systems skip header/footer content entirely during parsing. Your name, phone number, and email should <strong>always</strong> appear in the main body of the document — not in the Word/PDF header area.</li>
            <li><strong>Contact info:</strong> Place your contact details at the very top of the page (name, phone, email, LinkedIn URL, location). This is the first thing both the ATS and recruiters look for.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Tables vs Plain Text</h2>
          <p>
            <strong>Avoid tables in your resume.</strong> This cannot be overstated. ATS systems are notoriously bad at parsing table structures. When you use a table to organize skills, dates, or job details, the parser will often:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Read cells in the wrong order</li>
            <li>Mix content from different rows and columns together</li>
            <li>Miss entire sections that are enclosed in table cells</li>
            <li>Associate dates with the wrong job entries</li>
          </ul>
          <p>
            Instead of tables, use simple formatting: standard bullet points, bold for emphasis, consistent spacing, and line breaks. If you're organizing skills by category, use plain text with comma separation or simple bullet lists.
          </p>
          <p>
            The same logic applies to <strong>text boxes</strong> (common in Microsoft Word and Canva templates). Text boxes are often treated as separate document layers that ATS parsers can't access. Everything in your resume should be in the main document flow.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How to Save Your Resume as DOCX for ATS</h2>
          <p>
            Since DOCX is the recommended format, here's how to save it properly:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Create your resume in Microsoft Word or Google Docs</li>
            <li>Use standard fonts (Arial or Calibri, 10-12pt)</li>
            <li>Use single-column layout with clear section headers</li>
            <li>Use bullet points (not tables) for listing achievements</li>
            <li>Save as DOCX: <strong>File → Save As → Word Document (.docx)</strong></li>
            <li>If using Google Docs: <strong>File → Download → Microsoft Word (.docx)</strong></li>
          </ol>
          <p>
            After saving, <Link href="/blog/5-ats-mistakes" className="text-blue-600 hover:underline">check for these 5 common ATS mistakes</Link> that could still trip up the parser even with the right format.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">ATS-Friendly Resume Template Checklist</h2>
          <p>Use this checklist to verify your resume is ready for ATS submission:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>✅ Saved as DOCX (or text-based PDF only if required)</li>
            <li>✅ Single-column layout</li>
            <li>✅ No tables, text boxes, or graphics</li>
            <li>✅ Standard section headers (Experience, Education, Skills)</li>
            <li>✅ Contact info in the main document body (not header/footer)</li>
            <li>✅ Standard fonts (Arial, Calibri, Times New Roman)</li>
            <li>✅ No special characters, symbols, or decorative elements</li>
            <li>✅ Margins between 0.5 and 1 inch</li>
            <li>✅ Keywords from the job description included naturally</li>
            <li>✅ <Link href="/blog/ats-score-guide" className="text-blue-600 hover:underline">ATS match score</Link> checked and optimized</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common ATS Formatting Mistakes to Avoid</h2>
          <p>
            Beyond the major topics above, here are smaller mistakes that can still cause issues:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Images and logos:</strong> ATS cannot read text embedded in images. This includes company logos, headshots, or icon-based skill ratings.</li>
            <li><strong>Shading and background colors:</strong> While visually appealing, colored backgrounds can confuse character recognition in some parsers.</li>
            <li><strong>Columns for sidebars:</strong> Popular "modern" templates with a colored sidebar column for contact info and skills are terrible for ATS. The sidebar content often gets parsed after the main content, creating a confusing order.</li>
            <li><strong>Abbreviations without definitions:</strong> Always spell out acronyms at least once (e.g., "Search Engine Optimization (SEO)") so the ATS can match both the abbreviation and the full term against the job description.</li>
            <li><strong>Missing file name:</strong> Name your file professionally — "Jane_Doe_Resume_2026.docx" rather than "resume_final_v3.docx" or "MyResume.pdf."</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Final Thoughts</h2>
          <p>
            ATS-friendly formatting doesn't mean you have to sacrifice style or readability. A clean, single-column resume with standard fonts, clear section headers, and proper DOCX formatting will pass virtually any ATS parser while still looking professional to human recruiters.
          </p>
          <p>
            The key insight to remember: <strong>optimize for the machine first, the human second.</strong> If the ATS can't parse your resume correctly, no human recruiter will ever see it. Once you've locked in ATS-compatible formatting, focus on tailoring your content — keywords, achievements, and quantified results — to match the specific job description.
          </p>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="font-bold text-gray-900">What is the best file format for an ATS resume?</p>
                <p className="text-gray-600 mt-1 text-sm">DOCX is the safest and most reliable format. PDFs work with modern ATS systems but can still cause issues with older parsers. TXT files work but strip all formatting that helps human readers.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="font-bold text-gray-900">Should I use a single-column or multi-column resume for ATS?</p>
                <p className="text-gray-600 mt-1 text-sm">Always use single-column. Multi-column layouts confuse ATS parsers, causing them to read content out of order, mix sections together, or miss entire blocks of text.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="font-bold text-gray-900">Can ATS read tables in a resume?</p>
                <p className="text-gray-600 mt-1 text-sm">No — ATS systems generally cannot parse tables well. Use plain text with bullet points and standard section headers instead of tables or text boxes.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="font-bold text-gray-900">Is your resume ATS-ready?</p>
            <p className="text-gray-600 mt-1">
              Upload your resume to RezzoBot's free ATS checker to see exactly how it parses. One free analysis per day — no credit card required.
            </p>
            <a
              href="https://rezzobot.com/upload"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Check Your Resume Free
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              📖 Related: <Link href="/blog/ats-score-guide" className="text-blue-600 hover:underline">ATS Match Score Guide</Link>
              {' · '}
              <Link href="/blog/5-ats-mistakes" className="text-blue-600 hover:underline">5 Common ATS Resume Mistakes That Cost You Interviews</Link>
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
