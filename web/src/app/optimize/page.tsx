'use client';

import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft, Download, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { optimizeResume, exportPdf, exportDocx } from '@/lib/api';

function OptimizeContent() {
  const searchParams = useSearchParams();
  const [originalText, setOriginalText] = useState('');
  const [optimizedText, setOptimizedText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [changeLog, setChangeLog] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  useEffect(() => {
    const resume = searchParams.get('resume');
    const jd = searchParams.get('jd');

    if (resume) setOriginalText(resume);
    if (jd) setJobDescription(jd);

    // Auto-trigger optimization if both exist and we don't have optimized text yet
    if (resume && jd && !optimizedText && !isOptimizing) {
      handleOptimize(resume, jd);
    }
  }, [searchParams]);

  const handleOptimize = async (resume: string = originalText, jd: string = jobDescription) => {
    if (!resume || !jd) return;

    setIsOptimizing(true);
    try {
      const result = await optimizeResume(resume, jd);
      setOptimizedText(result.optimized_resume.raw_text);
      setChangeLog(result.change_log || []);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleExportPdf = async () => {
    if (!optimizedText) return;
    setIsExportingPdf(true);
    try {
      await exportPdf(optimizedText);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('PDF Export failed.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    if (!optimizedText) return;
    setIsExportingDocx(true);
    try {
      await exportDocx(optimizedText);
    } catch (error) {
      console.error('DOCX Export failed:', error);
      alert('DOCX Export failed.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center space-x-6">
          <Link
            href="/upload"
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Analysis</span>
          </Link>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Sparkles size={18} />
            <span className="font-bold text-sm tracking-tight uppercase">AI Optimization</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOptimize()}
            disabled={isOptimizing || !originalText || !jobDescription}
            className="flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 font-bold text-sm px-4 py-2 rounded-lg transition-colors border border-blue-100"
          >
            <Sparkles size={18} className={isOptimizing ? "animate-spin" : ""} />
            <span>{isOptimizing ? "Optimizing..." : "Re-Optimize"}</span>
          </button>

          <div className="h-4 w-px bg-gray-200 mx-1"></div>

          <button
            onClick={handleExportPdf}
            disabled={!optimizedText || isExportingPdf}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:opacity-50 flex items-center space-x-2"
          >
            {isExportingPdf ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={16} />}
            <span>PDF</span>
          </button>
          <button
            onClick={handleExportDocx}
            disabled={!optimizedText || isExportingDocx}
            className="bg-white text-gray-900 border border-gray-200 px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 flex items-center space-x-2"
          >
            {isExportingDocx ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Download size={16} />}
            <span>DOCX</span>
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Original */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <FileText size={16} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Original Resume</h3>
            </div>
          </div>
          <div className="flex-grow p-8 overflow-y-auto text-sm text-gray-400 leading-relaxed font-medium bg-gray-50/30 whitespace-pre-wrap">
            {originalText || "No resume text provided."}
          </div>
        </div>

        {/* Right Panel: Optimized / Editor */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-100 bg-blue-50/30 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles size={16} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Optimized Version</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase">AI-Enhanced</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>

          {isOptimizing ? (
            <div className="flex-grow flex flex-col items-center justify-center p-12 space-y-6">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-900">AI is rewriting your resume...</h4>
                <p className="text-sm text-gray-500 mt-2">Aligning your experience with the job description</p>
              </div>
            </div>
          ) : (
            <textarea
              className="flex-grow p-8 text-sm text-gray-900 leading-relaxed focus:outline-none resize-none font-medium selection:bg-blue-100"
              value={optimizedText}
              onChange={(e) => setOptimizedText(e.target.value)}
              placeholder="Optimization result will appear here..."
            />
          )}
        </div>

        {/* Change Log Sidebar */}
        {changeLog.length > 0 && !isOptimizing && (
          <div className="w-full lg:w-64 border-l border-gray-200 bg-gray-50/50 p-6 overflow-y-auto shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-500" />
              <span>Change Log</span>
            </h3>
            <ul className="space-y-4">
              {changeLog.map((change, idx) => (
                <li key={idx} className="text-[11px] font-bold text-gray-600 bg-white p-3 rounded-lg border border-gray-200 shadow-sm leading-tight">
                  {change}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default function OptimizePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-grow flex flex-col overflow-hidden">
        <Suspense fallback={
          <div className="flex-grow flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        }>
          <OptimizeContent />
        </Suspense>
      </main>
    </div>
  );
}

