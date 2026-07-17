# RezzoBot — Full English Conversion + UX Polish

## Task
Convert the entire bot/main.py to English and fix the UX so simulated resume is proactively offered.

## What to change

### 1. SYSTEM_PROMPT (line 1-30)
Change from Chinese to English instructions for the AI. Keep the same intent:
- Natural, concise English replies
- Use emojis sparingly
- Guide user: if they don't have a resume, offer simulated resume
- Privacy: mention data encryption and 24h auto-delete
- If user sends a file and unsure if resume or JD, ask

### 2. Welcome message (in handle_message)
When user says hi/hello/start, the welcome message should:
- Introduce RezzoBot as an AI resume assistant
- Include the TRUST_TEXT (privacy commitment)
- **Crucially**: ask the user "Want to try with a sample resume first?" as a clear question
- The simulated resume option should be OBVIOUS, not hidden

### 3. Simulated resume trigger
Change the trigger keyword from Chinese "模拟" to English "sample", "demo", "try sample"
- The welcome message should explicitly tell users to reply "sample resume" to try
- When triggered: load SAMPLE_RESUME, set state to waiting_jd, reply in English

### 4. handle_file function
All reply messages should be in English:
- "Received `filename`, analyzing..."
- "Resume received! Now please send a **job description (JD)**..."
- "ATS analysis complete" message format
- Keep the ATS report format but in English

### 5. handle_jd ATS report
The ATS report format should stay but in English:
- "ATS Diagnostic Report"
- "Match Score: X/100"
- "✅ Matched Keywords"
- "🔴 Missing Keywords"
- "💡 Suggestions"
- "Send another JD or /start to begin again"

### 6. /delete response
English: "✅ All your data has been cleared. See you next time!"

### 7. Error messages
Convert all error messages to English.

## Constraints
- Do NOT change any API logic or file handling logic
- Do NOT change any imports
- Do NOT change the api/ directory
- Keep all function names the same
- Keep the state machine logic the same
- After changes: python3 -c "import ast; ast.parse(open('bot/main.py').read()); print('Syntax OK')"
# Then: git add bot/main.py && git commit -m 'i18n: convert bot to English'
# Then: git push origin main (CI/CD auto-deploys)
