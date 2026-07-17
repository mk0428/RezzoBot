# Web MVP — Day 1: Landing Page + Resume Upload + ATS Diagnosis

## Product Context
We are building an AI resume builder (codename: PMF AI). A Telegram bot exists at @RezzoResumeBot that does ATS diagnosis + AI optimization + PDF export. Now we're building the Web version. The bot becomes traffic source → Web product.

**Competitor to copy:** Rezi (https://www.rezi.ai) — same product category, proven UX.

## Tech Stack
- **Framework:** Next.js 14+ App Router (already initialized)
- **Styling:** Tailwind CSS (already configured)
- **Language:** TypeScript
- **Deployment:** Vercel (planned)

## Project Structure (already created at ~/Desktop/RezzoBot/web/)
Standard Next.js App Router structure.

## Scope for Day 1

### 1. Landing Page (Rezi-inspired)
Copy Rezi's hero section and key layout patterns:
- [x] Hero: "Free AI Resume Builder. Build, improve, & score your resume"
- [x] Large upload drop zone: "Upload or drop your resume to get started" + "Score resume" CTA button
- [x] Social proof: "4.7/5.0 • 4.5 million users" (use placeholder numbers)
- [x] 3 feature columns: "Build" / "Score" / "Target" with descriptions
- [x] Company logos strip (Google, Amazon, Microsoft, etc.)
- [x] Testimonial section
- [x] Clean nav bar: Logo | Product | Templates | Resources | Pricing | Login | Try for free

### 2. Resume Upload Flow
- [x] Drag-and-drop file upload zone (PDF, DOCX, TXT)
- [x] File validation (size < 10MB, accepted formats)
- [x] Upload progress indicator
- [x] Parse resume content and display extracted text

### 3. ATS Diagnosis Page
Three-panel layout (like Rezi's "Target" feature):
- [x] **Left panel:** Pasted resume text (editable)
- [x] **Center panel:** Target Job Description textarea (user pastes a JD)
- [x] **Right panel:** ATS match report

ATS report should show:
- [x] Overall match score (1-100)
- [x] Matching keywords (green badges)
- [x] Missing keywords (red badges with "Add" button)
- [x] Section-by-section breakdown
- [x] "Optimize with AI" button (placeholder — Day 2 feature)

### 4. Reuse Bot's Existing API
- [x] Option B: Mock the API responses for frontend-only MVP

## Design Guidelines
- [x] Clean, modern, professional (Rezi's vibe)
- [x] Mobile responsive (Tailwind used)
- [x] Fast loading (Turbopack/Next.js)
- [x] Use Lucide React icons

## Acceptance Criteria
- [x] Landing page loads with hero, upload zone, features section
- [x] User can drag-and-drop a PDF/DOCX file into the upload zone
- [x] After upload, user sees parsed resume content
- [x] User can paste a job description
- [x] ATS score is calculated and displayed (mock data)
- [x] Matching/missing keywords shown with visual indicators
- [x] Page looks good on mobile and desktop
- [x] TypeScript compiles without errors
- [x] `npm run build` succeeds

## How to start
```bash
cd /Users/altasv-android09/Desktop/RezzoBot/web && npm run dev
```
