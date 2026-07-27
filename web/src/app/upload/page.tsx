'use client';

import { useState, useEffect, useRef } from 'react';
import PaywallModal from '@/components/PaywallModal';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import ATSScorePanel from '@/components/ATSScorePanel';
import { ATSReport } from '@/types/resume';
import { parseResume, analyzeResume } from '@/lib/api';
import { trackEvent } from '@/lib/tracker';
import { FileText, Target, BarChart3, Edit3, Save, Sparkles, AlertCircle, ArrowLeft, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [atsReport, setAtsReport] = useState<ATSReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resume.pdf');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showJdInput, setShowJdInput] = useState(false);
  const [isAutoMatched, setIsAutoMatched] = useState(false);
  const hasTrackedPanelView = useRef(false);

  // Track when the role input panel appears (after parse, before analysis)
  useEffect(() => {
    if (isUploaded && !atsReport && !hasTrackedPanelView.current) {
      hasTrackedPanelView.current = true;
      trackEvent("role_input_panel_viewed");
    }
  }, [isUploaded, atsReport]);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      setFileName(file.name);
      trackEvent("file_selected", {
        filename: file.name,
        size: file.size,
        type: file.type || "unknown",
      });
      const data = await parseResume(file);
      setResumeText(data.text);
      setIsUploaded(true);
      trackEvent("file_parsed", {
        filename: file.name,
        size: file.size,
        type: file.type || "unknown",
        text_len: data.text.length,
      });
      // GA4: resume uploaded
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'resume_uploaded', { file_type: file.type || 'unknown' });
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to parse resume';
      setError(msg);
      console.error(err);
      trackEvent("file_parse_failed", {
        filename: file.name,
        size: file.size,
        type: file.type || "unknown",
        error: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  function getDailyAnalysisCount(): number {
    if (typeof window === 'undefined') return 0;
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('_rezzobot_analysis_date');
    if (stored !== today) {
      localStorage.setItem('_rezzobot_analysis_date', today);
      localStorage.setItem('_rezzobot_analysis_count', '0');
      return 0;
    }
    return parseInt(localStorage.getItem('_rezzobot_analysis_count') || '0', 10);
  }

  const handleRunAnalysis = async () => {
    if (!resumeText) return;

    const inputJd = targetRole.trim() || jobDescription.trim();
    if (!inputJd) return;

    // Check daily limit (1 free analysis per day)
    const dailyCount = getDailyAnalysisCount();
    if (dailyCount >= 1) {
      setShowPaywall(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setIsAutoMatched(!!(targetRole.trim() && !jobDescription.trim()));

    const mode = jobDescription.trim() ? 'match' : 'match';
    trackEvent("analyze_started", { 
      filename: fileName, 
      mode,
      is_role_title: Boolean(targetRole.trim() && !jobDescription.trim())
    });

    try {
      // If user entered a role title only, pass it as jd_text
      // The backend will detect it's short (<100 chars) and use role-based analysis
      const analyzeInput = jobDescription.trim() || targetRole.trim();
      const data = await analyzeResume(resumeText, analyzeInput, mode);
      setAtsReport(data.report);
      trackEvent("analyze_completed", { 
        filename: fileName, 
        score: data.report.score, 
        mode,
        is_auto_match: Boolean(targetRole.trim() && !jobDescription.trim())
      });
      // GA4: analysis completed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'analysis_completed', { 
          score: data.report.score,
          is_auto_match: Boolean(targetRole.trim() && !jobDescription.trim())
        });
      }
      // Increment daily count
      localStorage.setItem('_rezzobot_analysis_count', String(dailyCount + 1));
    } catch (err: any) {
      if (err.message && err.message.includes('Daily free')) {
        setShowPaywall(true);
      } else {
        setError(err.message || 'Analysis failed');
      }
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeClick = () => {
    if (!resumeText) return;

    const params = new URLSearchParams();
    params.set('resume', resumeText);
    const optimizeJd = jobDescription.trim() || targetRole.trim();
    if (!optimizeJd) return;
    params.set('jd', optimizeJd);

    router.push(`/optimize?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="flex-grow">
        {!isUploaded ? (
          <div className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Optimize your resume for a target job
              </h1>
              <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                Upload your resume to start the ATS matching process. We'll compare it against your target job description.
              </p>
              {error && (
                <div className="max-w-md mx-auto bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center space-x-3 text-sm font-bold">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}
              <FileDropZone onFileSelect={handleFileSelect} isLoading={isLoading} />

              <div className="pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-400 font-medium mb-3">Or use RezzoBot on Telegram</p>
                <a
                  href="https://t.me/RezzoBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                >
                  <Send size={16} />
                  <span>Try @RezzoBot on Telegram</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-12 px-4">
            {/* Success banner */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Resume Parsed Successfully</h3>
                  <p className="text-sm text-gray-500">{fileName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploaded(false)}
                className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Change file
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center space-x-3 text-sm font-bold mb-6">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
              {!atsReport ? (
                <>
                  <h2 className="text-xl font-black text-gray-900 mb-2">What role are you targeting?</h2>
                  <p className="text-sm text-gray-400 mb-6">Enter a role title or paste a specific job description</p>

                  {/* Role Title Input (prominent) */}
                  <div className="mb-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                      Target Role
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        onFocus={() => trackEvent("target_role_focused")}
                        onKeyDown={(e) => e.key === 'Enter' && targetRole.trim() && handleRunAnalysis()}
                        placeholder="e.g. Software Engineer, Product Manager, Data Scientist"
                        className="flex-grow px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Toggle for JD input */}
                  <button
                    onClick={() => setShowJdInput(!showJdInput)}
                    className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors mb-4"
                  >
                    {showJdInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span>{showJdInput ? 'Hide' : 'or paste a specific job description'}</span>
                  </button>

                  {showJdInput && (
                    <div className="mb-6">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here for a more accurate ATS match..."
                        rows={6}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all resize-none"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing || (!targetRole.trim() && !jobDescription.trim())}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <BarChart3 size={18} />
                    )}
                    <span>{isAnalyzing ? 'Analyzing...' : `Run ATS Analysis`}</span>
                  </button>

                  {isAutoMatched && (
                    <p className="mt-3 text-xs text-amber-500 font-medium text-center">
                      ⚡ Auto-matching against typical requirements for this role. Paste a specific JD for more precise results.
                    </p>
                  )}
                </>
              ) : (
                /* ATS Report shown after analysis completes */
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">ATS Analysis Complete</h2>
                      {isAutoMatched && (
                        <p className="text-xs text-amber-500 font-medium mt-1">
                          Auto-matched for &ldquo;{targetRole}&rdquo; — paste a specific JD for precise results
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => { setAtsReport(null); setTargetRole(''); setJobDescription(''); setShowJdInput(false); setIsAutoMatched(false); }}
                      className="flex items-center space-x-1 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft size={16} />
                      <span>New Analysis</span>
                    </button>
                  </div>
                  
                  {jobDescription && (
                    <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Job Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{jobDescription}</p>
                    </div>
                  )}

                  <ATSScorePanel
                    report={atsReport}
                    onOptimize={handleOptimizeClick}
                  />
                </>
              )}
            </div>

            {/* Resume Text (expandable) */}
            <details className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <summary className="px-8 py-4 text-sm font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
                <span>Extracted Resume Text</span>
              </summary>
              <div className="px-8 py-6 border-t border-gray-100">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-medium leading-relaxed">{resumeText}</pre>
              </div>
            </details>
          </div>
        )}
      </main>

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      {!isUploaded && <Footer />}
    </div>
  );
}
