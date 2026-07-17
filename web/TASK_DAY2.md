# Web MVP — Day 2: Real API + AI Optimization + Export

## Goal
Wire up the Web frontend to the existing FastAPI backend. Replace mock data with real API calls. Add AI optimization editor and PDF/DOCX export.

## Architecture
```
Browser → Next.js App Router → src/app/api/* (proxy routes) → FastAPI backend (localhost:8000 or production)
```

## Backend API Reference

The FastAPI backend runs at:
- **Development:** `http://localhost:8000` (docker on this machine)
- **Production:** Configured via `NEXT_PUBLIC_API_BASE_URL` env var

### Endpoints (from ~/Desktop/RezzoBot/api/routers/resume.py)

1. **POST /api/parse** — Upload file (multipart) → extract text
   - Input: `file: UploadFile` (PDF, PNG, JPG)
   - Response: `{ text: string, metadata: { filename: string } }`

2. **POST /api/analyze** — Resume text + JD → ATS report
   - Input: `{ resume_text: string, jd_text: string }`
   - Response: `{ report: { score: number, matched_keywords: string[], missing_keywords: string[], suggestions: string[], match_detail: string } }`

3. **POST /api/optimize** — Resume + JD → AI-optimized text
   - Input: `{ resume: { raw_text: string, name: string, ... }, jd_text: string }`
   - Response: `{ optimized_resume: { raw_text: string, ... }, change_log: string[] }`

4. **POST /api/export/pdf** — Text → PDF file download
   - Input: `resume_text` (form-data)
   - Response: `application/pdf` binary

5. **POST /api/export/docx** — Text → DOCX file download
   - Input: `resume_text` (form-data)
   - Response: `application/vnd.openxmlformats` binary

## Implementation Tasks

### 1. Next.js API Proxy Routes

Create these route handlers in `src/app/api/`:

**`src/app/api/parse/route.ts`** — POST multipart forward
**`src/app/api/analyze/route.ts`** — POST JSON forward
**`src/app/api/optimize/route.ts`** — POST JSON forward
**`src/app/api/export/pdf/route.ts`** — POST form-data forward, pipe binary response
**`src/app/api/export/docx/route.ts`** — POST form-data forward, pipe binary response

Each route handler should:
- Accept the same input format as the backend
- Forward to `process.env.NEXT_PUBLIC_API_BASE_URL + endpoint`
- Return the backend's response (JSON or binary)
- Handle errors gracefully with proper status codes
- Use proper TypeScript types

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
```

### 2. Wire Up Upload → Parse → ATS Flow

Modify `src/app/upload/page.tsx`:
- On file drop: POST to `/api/parse` → get `resumeText`
- Show loading state during parse
- After parse: display resume text in left panel
- "Run ATS Analysis" button: POST to `/api/analyze` with resumeText + jdDescription
- Display real ATS report in right panel (replace MOCK_ATS_REPORT)
- Handle errors (show toast/message if API fails)

### 3. AI Optimization Editor (New Page: `/optimize`)

Create `src/app/optimize/page.tsx`:
- Side-by-side layout: left = original resume, right = optimized result
- Top toolbar: "Optimize with AI" button → calls `/api/optimize`
- Loading state with animation during optimization
- Change log display (list of changes made by AI)
- "Export PDF" and "Export DOCX" buttons after optimization
- Can navigate here from `/upload` after ATS analysis

Also create `src/components/OptimizationEditor.tsx` — the core diff/editor component:
- Two-panel layout (original left, optimized right)
- Left panel: read-only original text
- Right panel: read-only optimized text, but with inline edit capability
- Highlighted changes (green for additions, red for removals)

### 4. File Export

In the `/optimize` page toolbar:
- "Export PDF" button → POST to `/api/export/pdf` → trigger browser download
- "Export DOCX" button → POST to `/api/export/docx` → trigger browser download

Create a helper `src/lib/download.ts`:
```typescript
export async function downloadFile(url: string, data: any, filename: string) {
  const response = await fetch(url, { method: 'POST', body: data });
  const blob = await response.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
```

### 5. State Management

Create `src/lib/api.ts` with typed API functions:
```typescript
export async function parseResume(file: File): Promise<ParseResponse>
export async function analyzeResume(resumeText: string, jdText: string): Promise<AnalyzeResponse>
export async function optimizeResume(resumeText: string, jdText: string): Promise<OptimizeResponse>
export async function exportPdf(resumeText: string): Promise<void>
export async function exportDocx(resumeText: string): Promise<void>
```

### 6. Update Types

Add to `src/types/resume.ts`:
```typescript
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
```

## Design & UX Notes
- The optimize page should feel like a professional document editor
- Toolbar at top with: "Optimize with AI" | Export PDF | Export DOCX
- After ATS report, a prominent "Optimize with AI" button should be visible
- Loading states should be smooth (skeleton loading, not just spinners)
- Mobile: stack panels vertically instead of side-by-side

## CRITICAL RULES
- NO hardcoded API URLs in client code — always go through Next.js API routes
- All file downloads go through the browser's download mechanism (createObjectURL)
- Use proper error boundaries
- If the backend is unreachable, show a friendly "Service temporarily unavailable" message
- Do NOT expose the backend URL to the client

## Verification
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Upload a PDF → text appears in left panel
- [ ] Paste a JD → click "Run ATS Analysis" → score appears
- [ ] Click "Optimize with AI" → optimized text appears in right panel
- [ ] Click "Export PDF" → browser downloads a PDF file
- [ ] Works on mobile (responsive stacking)
