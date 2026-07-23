import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward real user IP for server-side rate limiting
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      headers['X-Forwarded-For'] = forwardedFor.split(',')[0].trim();
    }

    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Backend analysis failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy analyze error:', error);
    return NextResponse.json(
      { error: 'Internal server error during proxy' },
      { status: 500 }
    );
  }
}
