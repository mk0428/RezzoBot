import os
import json
import logging
from openai import OpenAI
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# DeepSeek API 配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

client = None
if DEEPSEEK_API_KEY:
    client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url=DEEPSEEK_BASE_URL)

def extract_keywords(jd_text: str) -> List[str]:
    """
    使用 DeepSeek 从 JD 文本中提取核心技能关键词。
    """
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
    """
    使用 DeepSeek 对比简历和 JD，进行 ATS 匹配分析。
    """
    if not client:
        logger.error("DeepSeek API key not configured")
        return {
            "score": 0,
            "matched_keywords": [],
            "missing_keywords": [],
            "suggestions": ["API key not configured"],
            "match_detail": "DeepSeek API key missing"
        }

    prompt = f"""
You are a professional ATS (Applicant Tracking System) expert.
Compare the following resume and job description (JD) and provide a matching analysis report.

Resume:
---
{resume_text}
---

JD:
---
{jd_text}
---

Return the analysis as JSON with these fields:
- score: match score (integer 0-100)
- matched_keywords: list of keywords from JD that are present in the resume
- missing_keywords: list of keywords from JD that are missing from the resume
- suggestions: improvement suggestions in English (list of strings)
- match_detail: brief match summary in English

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.
"""

    try:
        response = client.chat.completions.create(
            model="deepseek-v4-flash",
            messages=[
                {"role": "system", "content": "You are a resume analysis expert. Output ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            stream=False
        )
        content = response.choices[0].message.content
        # 尝试清理可能的 markdown 代码块包装
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result = json.loads(content)
        return result
    except Exception as e:
        logger.error(f"Error calling DeepSeek API for ATS match: {e}")
        return {
            "score": 0,
            "matched_keywords": [],
            "missing_keywords": [],
            "suggestions": [f"Error: {str(e)}"],
            "match_detail": "Analysis failed"
        }
