"""Resume optimizer — AI-powered resume rewriting for JD targeting"""
import os
import json
import logging
from openai import OpenAI
from typing import Dict, Any

logger = logging.getLogger(__name__)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

client = None
if DEEPSEEK_API_KEY:
    client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url=DEEPSEEK_BASE_URL)


def optimize_resume(resume_text: str, jd_text: str) -> Dict[str, Any]:
    """
    Rewrite resume to better target a specific job description.
    Returns optimized text + change log.
    """
    if not client:
        logger.error("DeepSeek API key not configured")
        return {
            "optimized_text": resume_text,
            "change_log": ["AI optimization unavailable: API key not configured"],
            "score_improvement": 0,
        }

    prompt = f"""You are a professional resume optimization coach. Your job is to show the user HOW to improve their resume — not to write it for them.

For each section of the resume, provide SPECIFIC, ACTIONABLE rewrite suggestions that the user can apply themselves.

STRICT RULES:
1. Keep ALL original facts — do NOT invent experience, skills, education, or credentials
2. For each suggestion, show the before→after so the user can see exactly what changed
3. Explain WHY each change improves the ATS match (e.g., "This adds the keyword 'cross-functional' which appears 3 times in the JD")
4. Only suggest changes based on what's in the JD — never fabricate qualifications
5. Group suggestions by resume section (Summary, Experience, Skills, Education)
6. Note high-impact changes vs. nice-to-have changes

Return ONLY valid JSON with these fields:
- optimized_text: a version of the resume WITH the changes applied (so user sees the end result)
- section_suggestions: list of {{"section": "...", "before": "...", "after": "...", "reason": "...", "impact": "high|medium|low"}}
- change_log: list of specific changes made (e.g., "Reworded summary to emphasize 'cross-functional leadership' matching JD paragraph 2")
- score_improvement: estimated ATS score improvement (integer 0-30)

Resume:
---
{resume_text}
---

Job Description:
---
{jd_text}
---

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text."""

    try:
        response = client.chat.completions.create(
            model="deepseek-v4-flash",
            messages=[
                {"role": "system", "content": "You are a resume optimization expert. Output ONLY valid JSON."},
                {"role": "user", "content": prompt},
            ],
            stream=False,
            temperature=0.5,
        )
        content = response.choices[0].message.content

        # Clean markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result = json.loads(content)
        return result

    except Exception as e:
        logger.error(f"Error optimizing resume: {e}")
        return {
            "optimized_text": resume_text,
            "change_log": [f"Optimization failed: {str(e)}"],
            "score_improvement": 0,
        }
