import { ParseResponse, AnalyzeResponse, OptimizeResponse } from '@/types/resume';

const API_BASE_CLIENT = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mk5188.duckdns.org/rezzobot-api';

export async function parseResume(file: File): Promise<ParseResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // 直接调后端——跳过 Vercel proxy，避免二进制文件被截断
  const response = await fetch(`${API_BASE_CLIENT}/api/parse`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.detail || 'Failed to parse resume');
  }

  return response.json();
}

export async function analyzeResume(resumeText: string, jdText: string): Promise<AnalyzeResponse> {
  // 直调后端——跳过 Vercel BFF，避免 serverless 10s 超时限制
  const response = await fetch(`${API_BASE_CLIENT}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resume_text: resumeText, jd_text: jdText }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.detail || 'Failed to analyze resume');
  }

  return response.json();
}

export async function optimizeResume(resumeText: string, jdText: string): Promise<OptimizeResponse> {
  const response = await fetch(`${API_BASE_CLIENT}/api/optimize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume: { raw_text: resumeText },
      jd_text: jdText,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.detail || 'Failed to optimize resume');
  }

  return response.json();
}

export async function exportPdf(resumeText: string): Promise<void> {
  const formData = new FormData();
  formData.append('resume_text', resumeText);

  const response = await fetch(`${API_BASE_CLIENT}/api/export/pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to export PDF');
  }

  const blob = await response.blob();
  downloadBlob(blob, 'optimized_resume.pdf');
}

export async function exportDocx(resumeText: string): Promise<void> {
  const formData = new FormData();
  formData.append('resume_text', resumeText);

  const response = await fetch(`${API_BASE_CLIENT}/api/export/docx`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to export DOCX');
  }

  const blob = await response.blob();
  downloadBlob(blob, 'optimized_resume.docx');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
