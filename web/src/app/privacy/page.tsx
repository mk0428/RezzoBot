'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Privacy Policy</h1>
        <div className="text-gray-600 space-y-6 text-sm leading-relaxed">
          <p><strong>Last updated:</strong> July 23, 2026</p>

          <h2 className="text-lg font-bold text-gray-900">1. What We Collect</h2>
          <p>
            <strong>Resume files</strong> — You upload your resume (PDF or image) for ATS analysis.
            We extract text from the file to run the analysis. The file content is NOT stored
            permanently. We only keep anonymized metadata (file size, file type) for product improvement.
          </p>
          <p>
            <strong>Job description URLs</strong> — When you paste a job description link, we fetch
            the page content for analysis. We do not store the content.
          </p>
          <p>
            <strong>Anonymous usage data</strong> — We track page views, button clicks, and error
            events with a random session ID (no personal information attached). This helps us fix
            bugs and improve the product.
          </p>

          <h2 className="text-lg font-bold text-gray-900">2. What We Do NOT Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We do NOT store your resume content</li>
            <li>We do NOT require an account or email to use the free tier</li>
            <li>We do NOT share your data with third parties</li>
            <li>We do NOT use your data for AI training</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900">3. Payment Processing</h2>
          <p>
            If you purchase a paid plan, payment is processed by Stripe. We do not see or store
            your credit card information. Stripe&apos;s privacy policy applies to payment data.
          </p>

          <h2 className="text-lg font-bold text-gray-900">4. Cookies</h2>
          <p>
            We use local storage (not cookies) for session tracking. No third-party tracking
            cookies are used.
          </p>

          <h2 className="text-lg font-bold text-gray-900">5. Data Retention</h2>
          <p>
            Tracking data (anonymized events) are retained for up to 12 months. Resume content
            is processed in memory and discarded immediately after analysis.
          </p>

          <h2 className="text-lg font-bold text-gray-900">6. Contact</h2>
          <p>
            Questions? Reach out via our Telegram bot @RezzoBot.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
