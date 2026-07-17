# RezzoBot — Simulated Resume: 100% Done

## Current Problem
The current SAMPLE_RESUME is a plain text blob with 6 lines. It doesn't demonstrate the real value of the product. The trigger keyword "sample resume" is fragile — user says "ok" or "yes" and it doesn't work. The AI talks about offering a sample resume but has no actual content to reference.

## What "100% OK" looks like

### 1. The sample resume must be a REAL, complete resume
Add a detailed sample resume with:
- Full name, email, phone, LinkedIn URL, location
- Professional summary (3-4 sentences with achievements)
- Work experience (2 entries, each with: company, title, dates, 3-4 bullet points with QUANTIFIED achievements)
- Education (degree, school, year)
- Skills (technical + soft skills)
- Projects or certifications

### 2. The trigger keyword must work naturally
Instead of only checking for "sample resume", also check:
- "yes" or "ok" or "sure" when the AI has just offered a sample resume (within 2 turns)
- "try it" / "try" / "demo" / "example" / "sample"
- And: if the AI offered a sample resume and user says anything affirmative, it should trigger

The simplest fix: track `ai_offered_sample` in user_data. If AI offered sample and user says yes/ok/sure, trigger it.

### 3. The AI SYSTEM_PROMPT must reference the actual sample resume
The sample resume content should be included in the AI context so the AI can:
- Describe Alex's background naturally
- Explain why certain keywords match/miss
- Give specific advice based on Alex's experience
- Make the whole experience feel real, not templated

Update the SYSTEM_PROMPT to include the full sample resume text when the user is using it.

### 4. The ATS analysis with sample resume must be impressive
When a user runs ATS with the sample resume:
- The match score should be realistic (60-85 range, not 100 or 0)
- Matched/missing keywords should be specific and relevant
- Suggestions should reference specific parts of the resume
- The report should make the user think "wow, that's useful"

This means the SAMPLE_RESUME text must be detailed enough that the DeepSeek analysis produces meaningful results.

## Files to modify
Only bot/main.py

## Constraints
- Keep ALL existing functionality (file upload, real resume analysis, AI chat, etc.)
- Keep all English text
- Keep all imports and function signatures
- After changes: python3 -c "import ast; ast.parse(open('bot/main.py').read()); print('Syntax OK')"
- git add bot/main.py && git commit -m 'feat: realistic sample resume with proper ATS demo'
- git push origin main
