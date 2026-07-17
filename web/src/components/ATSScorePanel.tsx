'use client';

import { ATSReport } from "../types/resume";
import { CheckCircle, AlertCircle, Sparkles, ChevronRight, Plus, HelpCircle } from "lucide-react";

interface ATSScorePanelProps {
  report: ATSReport;
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

export default function ATSScorePanel({ report, onOptimize, isOptimizing }: ATSScorePanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Score Circle */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
        <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-6">ATS Match Score</h3>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 * (1 - report.score / 100)}
              className={`${getScoreColor(report.score)} transition-all duration-1000 ease-out`}
            />
          </svg>
          <span className={`absolute text-4xl font-black ${getScoreColor(report.score)}`}>
            {report.score}
          </span>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">
          {report.score >= 80 ? 'Excellent match!' : report.score >= 60 ? 'Strong potential, needs work.' : 'Significant optimization needed.'}
        </p>

        <button
          onClick={onOptimize}
          disabled={isOptimizing}
          className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={18} className={isOptimizing ? "animate-pulse" : ""} />
          <span>{isOptimizing ? 'Optimizing...' : 'Optimize with AI'}</span>
        </button>
      </div>

      {/* Keywords */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <CheckCircle size={18} className="text-green-500" />
          <span>Matched Keywords</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {report.matched_keywords && report.matched_keywords.length > 0 ? (
            report.matched_keywords.map(keyword => (
              <span key={keyword} className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">No keywords matched yet</span>
          )}
        </div>

        <h3 className="text-sm font-bold text-gray-900 mt-8 mb-4 flex items-center space-x-2">
          <AlertCircle size={18} className="text-red-500" />
          <span>Missing Keywords</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {report.missing_keywords && report.missing_keywords.length > 0 ? (
            report.missing_keywords.map(keyword => (
              <div key={keyword} className="group flex items-center bg-red-50 text-red-700 text-xs font-bold pl-3 pr-1.5 py-1.5 rounded-full border border-red-100 hover:bg-red-100 transition-colors cursor-pointer">
                <span>{keyword}</span>
                <Plus size={14} className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">No missing keywords identified</span>
          )}
        </div>
      </div>

      {/* Match Detail & Suggestions */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900">Analysis & Suggestions</h3>
        </div>
        <div className="p-6 space-y-6">
          {report.match_detail && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <HelpCircle size={14} /> Match Detail
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{report.match_detail}</p>
            </div>
          )}

          {report.suggestions && report.suggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Suggestions
              </h4>
              <ul className="space-y-3">
                {report.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

