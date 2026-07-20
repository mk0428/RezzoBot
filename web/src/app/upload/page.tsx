'use client';

import { track } from "@vercel/analytics";
import { useState } from 'react';
import PaywallModal from '@/components/PaywallModal'; from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import ATSScorePanel from '@/components/ATSScorePanel';
import { ATSReport } from '@/types/resume';
import { parseResume, analyzeResume } from '@/lib/api';
import { FileText, Target, BarChart3, Edit3, Save, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
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
      track("parse_completed", { format: file.name.split(".").pop() || "unknown" });
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume');
      console.error(err);
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
    if (!resumeText || !jobDescription) return;

    // Check daily limit (1 free analysis per day)
    const dailyCount = getDailyAnalysisCount();
    if (dailyCount >= 1) {
      setShowPaywall(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeResume(resumeText, jobDescription);
      setAtsReport(data.report);
      track("analysis_completed", { score: data.report.score });
      // Increment daily count
      localStorage.setItem('_rezzobot_analysis_count', String(dailyCount + 1));
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeClick = () => {
    if (!resumeText || !jobDescription) return;

    // Encode parameters to URL
    const params = new URLSearchParams();
    params.set('resume', resumeText);
    params.set('jd', jobDescription);

      track("optimizer_clicked", { score: atsReport?.score || 0 });
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
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Target size={20} />
                  <span className="font-bold text-sm tracking-tight uppercase">Target Mode</span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <span className="text-sm font-bold text-gray-500">{fileName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsUploaded(false)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>New Upload</span>
                </button>
                <button
                  onClick={handleOptimizeClick}
                  disabled={!atsReport}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  Go to Optimizer
                </button>
              </div>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="bg-red-50 text-red-600 px-6 py-2 border-b border-red-100 flex items-center space-x-3 text-xs font-bold">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* 3-Panel Layout */}
            <div className="flex-grow flex overflow-hidden">
              {/* Left Panel: Resume Content */}
              <div className="w-1/3 flex flex-col border-r border-gray-200 bg-white">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Edit3 size={16} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Resume Content</h3>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">EDITABLE</span>
                </div>
                <textarea
                  className="flex-grow p-8 text-sm text-gray-700 leading-relaxed focus:outline-none resize-none font-medium"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste or edit your resume text here..."
                />
              </div>

              {/* Center Panel: Job Description */}
              <div className="w-1/3 flex flex-col border-r border-gray-200 bg-white">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-900">
                    <FileText size={16} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Job Description</h3>
                  </div>
                  <button
                    onClick={() => setJobDescription('')}
                    className="text-[10px] font-black text-blue-600 hover:underline uppercase"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex-grow flex flex-col p-8">
                  <textarea
                    className="flex-grow text-sm text-gray-700 leading-relaxed focus:outline-none resize-none font-medium p-6 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-200 transition-all"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description you're targeting here..."
                  />
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing || !resumeText || !jobDescription}
                    className="mt-6 w-full bg-gray-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-xl disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <BarChart3 size={18} />
                    )}
                    <span>{isAnalyzing ? 'Analyzing...' : 'Run ATS Analysis'}</span>
                  </button>
                </div>
              </div>

              {/* Right Panel: ATS Score/Report */}
              <div className="w-1/3 overflow-y-auto bg-gray-50/30 p-8 scrollbar-hide">
                {atsReport ? (
                  <ATSScorePanel
                    report={atsReport}
                    onOptimize={handleOptimizeClick}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <BarChart3 size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">No Analysis Yet</h4>
                      <p className="text-xs font-medium max-w-[200px] mt-1">
                        Paste a job description and run analysis to see your ATS score.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      {!isUploaded && <Footer />}
    </div>
  );
}

