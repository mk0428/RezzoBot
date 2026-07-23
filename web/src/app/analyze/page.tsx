'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import ATSScorePanel from '@/components/ATSScorePanel';
import { ATSReport } from '@/types/resume';
import { parseResume, analyzeResume } from '@/lib/api';
import { FileText, Share2, Check, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';

function hasSharedToday(): boolean {
  if (typeof window === 'undefined') return false;
  const today = new Date().toISOString().split('T')[0];
  return localStorage.getItem('_rezzobot_share_date') === today;
}

function markShared() {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('_rezzobot_share_date', today);
}

export default function AnalyzePage() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [atsReport, setAtsReport] = useState<ATSReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resume.pdf');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shared, setShared] = useState(hasSharedToday());

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      setFileName(file.name);
      const data = await parseResume(file);
      setResumeText(data.text);
      setIsUploaded(true);

      // Check if need to share
      if (!shared) {
        setShowShareModal(true);
      } else {
        runAnalysis(data.text);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent('https://rezzobot.com');
    const text = encodeURIComponent('Just checked my resume with RezzoBot — free ATS analysis. Check yours:');
    window.open(`https://linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
    finishShare();
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent('Just checked my resume with RezzoBot — free ATS analysis. Check yours: https://rezzobot.com');
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    finishShare();
  };

  const finishShare = () => {
    markShared();
    setShared(true);
    setShowShareModal(false);
    if (resumeText) {
      runAnalysis(resumeText);
    }
  };

  const skipShare = () => {
    setShowShareModal(false);
    setError('Share to unlock free analysis — or upgrade to skip the wait.');
  };

  const runAnalysis = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // Pass a generic structure analysis prompt as the "JD"
      const genericJD = "General resume structure and format analysis. Evaluate: section completeness (summary, experience, education, skills), appropriate length (1-2 pages), clear formatting, action verbs, quantifiable achievements, and keyword optimization. Provide an ATS compatibility score and suggestions for improvement.";
      const data = await analyzeResume(text, genericJD);
      setAtsReport(data.report);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 size={28} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Share to Unlock</h2>
                <p className="text-gray-500 font-medium text-sm mt-2">
                  Share RezzoBot with your network for one free analysis
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleShareLinkedIn}
                  className="w-full flex items-center justify-center space-x-3 bg-[#0A66C2] text-white py-4 rounded-xl font-bold hover:bg-[#004182] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <span>Share on LinkedIn</span>
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="w-full flex items-center justify-center space-x-3 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span>Share on X / Twitter</span>
                </button>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={skipShare}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium underline"
                >
                  Skip — I'll upgrade instead
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="py-16 px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
              <FileText size={14} className="text-blue-600" />
              <span className="text-xs font-black text-blue-900 uppercase tracking-widest">Free Resume Analysis</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Analyze Your Resume
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
              Upload your resume for a free ATS structure check. Share once to unlock unlimited analysis today.
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
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-amber-800 flex items-center space-x-2">
                  <Share2 size={14} />
                  <span>One social share = one free analysis. No credit card needed.</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resume text preview */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Resume Content</h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{fileName}</span>
                </div>
                <textarea
                  className="w-full h-64 text-sm text-gray-700 leading-relaxed focus:outline-none resize-none font-medium p-4 bg-gray-50 rounded-xl border border-gray-100"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              {/* Analysis button */}
              {!atsReport && (
                <button
                  onClick={() => runAnalysis(resumeText)}
                  disabled={isAnalyzing || !resumeText}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing Structure...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      <span>Run Structure Analysis</span>
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

              {/* CTA to deeper analysis */}
              {atsReport && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-black text-gray-900 mb-2">Want a deeper match?</h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">
                    Score your resume against a real job description with our Target tool.
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
                  onClick={() => { setAtsReport(null); setIsUploaded(false); setResumeText(''); }}
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors mx-auto"
                >
                  <ArrowLeft size={16} />
                  <span>Analyze another resume</span>
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
