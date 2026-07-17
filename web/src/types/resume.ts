export interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  raw_text?: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface ATSReport {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  match_detail: string;
}

export interface SectionAnalysis {
  section: string;
  score: number;
  feedback: string;
}

export interface ParseResponse {
  text: string;
  metadata: { filename: string };
}

export interface AnalyzeResponse {
  report: ATSReport;
}

export interface OptimizeResponse {
  optimized_resume: { raw_text: string };
  change_log: string[];
}
