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

    prompt = f"""You are a professional resume optimization expert. Rewrite the following resume to better target the specific job description.

STRICT RULES:
1. Keep ALL original facts — do NOT invent experience, skills, education, or credentials
2. Reword bullet points to highlight relevant experience for the JD
3. Inject missing keywords from the JD where they naturally fit into existing experience
4. Improve formatting: use strong action verbs, quantify achievements where possible
5. Keep the same section structure (summary, experience, education, skills)
6. Output must sound natural to a human recruiter — no keyword stuffing

Return ONLY valid JSON with these fields:
- optimized_text: the full rewritten resume (plain text, same structure as input)
- change_log: list of specific changes made (e.g., "Reworded summary to emphasize leadership experience", "Added 'Python' to skills section")
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
