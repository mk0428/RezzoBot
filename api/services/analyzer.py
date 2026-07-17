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
    你是一个专业的简历筛选专家。请从以下职位描述 (JD) 中提取核心技能关键词（包括编程语言、工具、框架、领域知识、软技能等）。
    只返回关键词列表，用逗号分隔。

    JD 内容：
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
    你是一个高级 ATS (Applicant Tracking System) 解析专家。
    请对比以下简历和职位描述 (JD)，并给出匹配分析报告。

    简历文本：
    ---
    {resume_text}
    ---

    JD 文本：
    ---
    {jd_text}
    ---

    请以 JSON 格式返回分析结果，包含以下字段：
    - score: 匹配度评分 (0-100 的整数)
    - matched_keywords: 简历中已有的关键词列表
    - missing_keywords: JD 要求但简历中缺失的关键词列表
    - suggestions: 改进建议列表
    - match_detail: 简短的匹配总结

    注意：只返回纯 JSON 内容，不要包含 Markdown 代码块。
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
