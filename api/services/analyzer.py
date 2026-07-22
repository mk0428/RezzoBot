"""Resume analyzer — DeepSeek-powered ATS match with structured, actionable suggestions."""
import os
import json
import logging
from openai import OpenAI
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

client = None
if DEEPSEEK_API_KEY:
    client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url=DEEPSEEK_BASE_URL)


def extract_keywords(jd_text: str) -> List[str]:
    if not client:
        logger.error("DeepSeek API key not configured")
        return []

    prompt = f"""
Extract core skill keywords from the following job description (JD). Include programming languages, tools, frameworks, domain knowledge, and soft skills.
Return only a comma-separated list of keywords. No explanations, no extra text.

JD content:
{jd_text}
"""

    try:
        response = client.chat.completions.create(
            model="deepseek-v4-flash",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts keywords from job descriptions."},
                {"role": "user", "content": prompt}
            ],
            stream=False
        )
        content = response.choices[0].message.content
        keywords = [k.strip() for k in content.replace("，", ",").split(",") if k.strip()]
        return keywords
    except Exception as e:
        logger.error(f"Error calling DeepSeek API for keywords: {e}")
        return []


def ats_match(resume_text: str, jd_text: str) -> Dict[str, Any]:
    if not client:
        logger.error("DeepSeek API key not configured")
        return {
            "score": 0,
            "matched_keywords": [],
            "missing_keywords": [],
            "suggestions": [],
            "match_detail": "API key not configured",
        }

    prompt = f"""You are a professional ATS (Applicant Tracking System) expert.
Compare the following resume and job description (JD) and provide a structured matching analysis.

Resume:
---
{resume_text}
---

JD:
---
{jd_text}
---

Return ONLY valid JSON with these fields:

{{
  "score": <integer 0-100>,
  "matched_keywords": [<list of keywords from JD that appear in resume>],
  "missing_keywords": [<list of keywords from JD that are missing from resume>],
  "match_detail": "<one-sentence match summary>",
  "suggestions": [
    {{
      "section": "<resume section name: Summary | Experience - [job title] | Skills | Education | Certifications>",
      "issue": "<what's wrong in one sentence>",
      "evidence": "<exact quote from resume + exact quote from JD showing the gap>",
      "suggested_fix": "<specific, actionable rewrite suggestion. If the fix changes a specific word/phrase, show before→after. If adding content, specify exactly where.>"
    }}
  ],
  "quick_wins": [
    {{
      "change": "<exact word or phrase to change>",
      "from": "<current text>",
      "to": "<suggested replacement text>",
    }}
  ]
}}

RULES for suggestions:
1. Each suggestion MUST reference a SPECIFIC part of the resume (section name, approximate location)
2. Each suggestion MUST show evidence from BOTH the resume AND the JD
3. suggested_fix must be so specific the user can immediately act on it — word-level changes preferred
4. Aim for 3-5 suggestions total, prioritized by impact
5. quick_wins: list 2-3 single-word or single-phrase replacements that would immediately improve the score
6. Do NOT suggest fabricating experience — only suggest rewording what exists
7. Do NOT suggest adding skills the user clearly doesn't have

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text."""

    max_attempts = 3
    last_error = None
    for attempt in range(max_attempts):
        try:
            response = client.chat.completions.create(
                model="deepseek-v4-flash",
                messages=[
                    {"role": "system", "content": "You are a resume analysis expert. Output ONLY valid JSON with structured, specific suggestions."},
                    {"role": "user", "content": prompt}
                ],
                stream=False,
                temperature=0,
            )
            content = response.choices[0].message.content

            # Clean markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            result = json.loads(content)

            # Validate: ensure suggestions and quick_wins are present
            suggestions = result.get("suggestions")
            quick_wins = result.get("quick_wins")
            has_suggestions = isinstance(suggestions, list) and len(suggestions) > 0
            has_quick_wins = isinstance(quick_wins, list) and len(quick_wins) > 0

            if not has_suggestions or not has_quick_wins:
                missing = []
                if not has_suggestions:
                    missing.append("suggestions")
                if not has_quick_wins:
                    missing.append("quick_wins")
                logger.warning(f"Attempt {attempt+1}: LLM returned empty {missing}, retrying with stronger prompt")
                # Strengthen the prompt for retry
                prompt += "\n\nCRITICAL: You MUST include at least 3 suggestions and 2 quick_wins in your JSON response. Do NOT omit these fields."
                continue

            # Ensure backward compatibility with bot code that expects flat suggestions list
            if isinstance(result["suggestions"], list):
                flat_suggestions = []
                for s in result["suggestions"]:
                    if isinstance(s, dict):
                        flat_suggestions.append(f"[{s.get('section', 'General')}] {s.get('issue', '')} — {s.get('suggested_fix', '')}")
                    else:
                        flat_suggestions.append(str(s))
                result["suggestions_flat"] = flat_suggestions

            return result
        except Exception as e:
            last_error = e
            logger.error(f"Attempt {attempt+1}/{max_attempts} failed: {e}")
            if attempt < max_attempts - 1:
                continue

    # All attempts failed
    logger.error(f"All {max_attempts} attempts failed. Last error: {last_error}")
    return {
        "score": 0,
        "matched_keywords": [],
        "missing_keywords": [],
        "suggestions": [],
        "suggestions_flat": [f"Analysis failed after {max_attempts} attempts: {str(last_error)[:100]}"],
        "match_detail": "Analysis failed",
        "quick_wins": [],
    }
