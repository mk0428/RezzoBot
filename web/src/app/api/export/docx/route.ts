import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resumeText = formData.get('resume_text');

    if (!resumeText) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }

    const backendFormData = new FormData();
    backendFormData.append('resume_text', resumeText);

    const response = await fetch(`${API_BASE}/api/export/docx`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Backend DOCX export failed' },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="optimized_resume.docx"',
      },
    });
  } catch (error: any) {
    console.error('Proxy DOCX export error:', error);
    return NextResponse.json(
      { error: 'Internal server error during proxy' },
      { status: 500 }
    );
  }
}
