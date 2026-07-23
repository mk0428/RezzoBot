'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import ATSScorePanel from '@/components/ATSScorePanel';
import PaywallModal from '@/components/PaywallModal';
import { ATSReport } from '@/types/resume';
import { parseResume, analyzeResume } from '@/lib/api';
import { Zap, ChevronDown, AlertCircle, ArrowLeft, ChevronRight, Check } from 'lucide-react';

const INDUSTRIES: Record<string, string[]> = {
  'Software Engineering': ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'Git', 'CI/CD', 'REST API', 'Microservices', 'Agile', 'System Design'],
  'Data Science & ML': ['Python', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Statistics', 'Data Visualization', 'A/B Testing', 'Pandas', 'Spark', 'Feature Engineering'],
  'Product Management': ['Product Strategy', 'Roadmap', 'User Research', 'A/B Testing', 'Agile', 'Stakeholder Management', 'KPI', 'PRD', 'Cross-functional', 'Data-driven', 'OKR', 'MVP', 'User Stories'],
  'Marketing': ['SEO', 'SEM', 'Content Marketing', 'Social Media', 'Analytics', 'Google Analytics', 'CRM', 'Email Marketing', 'Brand Strategy', 'Conversion Optimization', 'Growth Hacking', 'Marketing Automation'],
  'Finance & Accounting': ['Financial Modeling', 'Excel', 'SQL', 'Variance Analysis', 'Forecasting', 'GAAP', 'SOX', 'Audit', 'ERP', 'CPA', 'Budgeting', 'FP&A', 'Risk Management'],
  'Design (UI/UX)': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design System', 'Usability Testing', 'Interaction Design', 'Information Architecture', 'Visual Design', 'Accessibility', 'Sketch'],
  'Sales & BD': ['CRM', 'Salesforce', 'B2B', 'Enterprise Sales', 'Negotiation', 'Lead Generation', 'Pipeline Management', 'Account Management', 'SaaS', 'Cold Outreach', 'Quota', 'MEDDIC'],
  'HR & Recruiting': ['ATS', 'Full-cycle Recruiting', 'Employee Relations', 'Onboarding', 'Performance Management', 'Compensation', 'HRIS', 'Talent Acquisition', 'DEI', 'Employment Law', 'Succession Planning'],
  'Consulting': ['Strategic Analysis', 'Client Management', 'Presentation', 'Financial Analysis', 'Market Research', 'Business Development', 'Team Leadership', 'Process Improvement', 'SWOT', 'Stakeholder Management'],
  'Operations': ['Process Optimization', 'Supply Chain', 'Logistics', 'Project Management', 'Lean', 'Six Sigma', 'KPI', 'Budget Management', 'ERP', 'Vendor Management', 'Data Analysis'],
};

function getDailyAnalysisCount(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem('_rezzobot_score_date');
  if (stored !== today) {
    localStorage.setItem('_rezzobot_score_date', today);
    localStorage.setItem('_rezzobot_score_count', '0');
    return 0;
  }
  return parseInt(localStorage.getItem('_rezzobot_score_count') || '0', 10);
}

function incrementCount() {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('_rezzobot_score_date', today);
  const count = getDailyAnalysisCount() + 1;
  localStorage.setItem('_rezzobot_score_count', String(count));
}

export default function ScorePage() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [industry, setIndustry] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [atsReport, setAtsReport] = useState<ATSReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resume.pdf');
  const [showPaywall, setShowPaywall] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      setFileName(file.name);
      const data = await parseResume(file);
      setResumeText(data.text);
      setIsUploaded(true);
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!resumeText || !industry) return;

    // Check daily limit (1 free per day)
    const dailyCount = getDailyAnalysisCount();
    if (dailyCount >= 1) {
      setShowPaywall(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const keywords = INDUSTRIES[industry] || [];
      const industryJD = `We are hiring for a ${industry} role. Required skills and qualifications: ${keywords.join(', ')}. The ideal candidate should have experience in most of these areas.`;
      const data = await analyzeResume(resumeText, industryJD);
      setAtsReport(data.report);
      incrementCount();
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      <main className="flex-grow">
        <div className="py-16 px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-100">
              <Zap size={14} className="text-yellow-600" />
              <span className="text-xs font-black text-yellow-900 uppercase tracking-widest">ATS Score</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Score Your Resume
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
              See how your resume stacks up against industry standards. Free daily analysis included.
            </p>
          </div>

          {error && (
            <div className="max-w-lg mx-auto mb-8 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center space-x-3 text-sm font-bold">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {!isUploaded ? (
            <div className="max-w-lg mx-auto">
              <FileDropZone onFileSelect={handleFileSelect} isLoading={isLoading} />
              <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-gray-500">
                  Free: 1 analysis per day. Upgrade for unlimited.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Resume preview */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Resume</h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{fileName}</span>
                </div>
                <textarea
                  className="w-full h-48 text-sm text-gray-700 leading-relaxed focus:outline-none resize-none font-medium p-4 bg-gray-50 rounded-xl border border-gray-100"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              {/* Industry selector */}
              <div className="relative">
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">
                  Select Your Industry
                </label>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex items-center justify-between bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-300 transition-all font-bold text-gray-900"
                >
                  <span className={industry || 'text-gray-400'}>{industry || 'Choose an industry...'}</span>
                  <ChevronDown size={20} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute z-20 mt-2 w-full bg-white border-2 border-gray-100 rounded-2xl shadow-xl max-h-72 overflow-y-auto">
                    {Object.keys(INDUSTRIES).map((ind) => (
                      <button
                        key={ind}
                        onClick={() => { setIndustry(ind); setShowDropdown(false); }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700"
                      >
                        <span>{ind}</span>
                        {industry === ind && <Check size={16} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Run button */}
              {!atsReport && (
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || !resumeText || !industry}
                  className="w-full bg-yellow-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-yellow-600 transition-all shadow-xl shadow-yellow-200 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Scoring...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      <span>Get My ATS Score</span>
                    </>
                  )}
                </button>
              )}

              {/* Results */}
              {atsReport && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <ATSScorePanel report={atsReport} />
                </div>
              )}

              {/* CTA to Target */}
              {atsReport && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-black text-gray-900 mb-2">Target a specific job</h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">
                    Match your resume against an actual job description for precise optimization.
                  </p>
                  <a
                    href="/upload"
                    className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
                  >
                    <span>Go to Target</span>
                    <ChevronRight size={18} />
                  </a>
                </div>
              )}

              {atsReport && (
                <button
                  onClick={() => { setAtsReport(null); setIsUploaded(false); setResumeText(''); setIndustry(''); }}
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors mx-auto"
                >
                  <ArrowLeft size={16} />
                  <span>Score another resume</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
