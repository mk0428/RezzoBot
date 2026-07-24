"""LinkedIn auto-poster: generate + post one LinkedIn post per day.
Runs inside rezzobot-api container.

Usage:
    python3 /app/api/scripts/linkedin_poster.py
"""
import asyncio
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, "/app")

# ── DeepSeek content generation ───────────────────────────────────────────

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", os.environ.get("DEEPSEEK_API_KEY", ""))
DEEPSEEK_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

POST_TOPICS = [
    "Resume keyword optimization for ATS",
    "Common resume mistakes that fail ATS filters",
    "How to tailor your resume for each job application",
    "ATS score: what a good number actually looks like",
    "The gap between your LinkedIn profile and resume",
    "Why most resumes never reach a human recruiter",
    "Resume formatting tips that pass ATS parsing",
    "How to find the right keywords for your industry",
    "Action verbs that increase your ATS match rate",
    "One-page vs two-page resumes: what ATS prefers",
]

SYSTEM_PROMPT = """You are a career coach writing LinkedIn posts for RezzoBot, 
an AI-powered ATS resume checker. Your posts are:
- Professional but conversational (not corporate 'thought leadership')
- Provide actionable value (not just theory)
- End with a soft CTA: 'Check RezzoBot for your free ATS resume analysis'
- 800-1200 characters, use line breaks for readability
- Include 2-4 relevant hashtags
- Do NOT use clickbait or 'I'm shocked' style
- Do NOT use emojis excessively (1-2 max if appropriate)
- Write in English (global audience)"""


def _generate_prompt(topic: str) -> str:
    return f"""Write a LinkedIn post about: {topic}

The post should:
1. Start with a hook that resonates with job seekers
2. Give 1-2 specific, actionable insights
3. Include a real example
4. End with: Check RezzoBot for your free ATS resume analysis
5. Add 2-4 relevant hashtags

Today: {datetime.now().strftime('%B %d, %Y')}"""


async def generate_content() -> str:
    """Generate post content via DeepSeek."""
    import httpx

    idx = datetime.now().day % len(POST_TOPICS)
    topic = POST_TOPICS[idx]

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{DEEPSEEK_BASE_URL}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "deepseek-v4-flash",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": _generate_prompt(topic)},
                ],
                "max_tokens": 600,
                "temperature": 0.8,
            },
        )
        data = resp.json()
        content = data["choices"][0]["message"]["content"].strip()
        return content


# ── LinkedIn posting ──────────────────────────────────────────────────────

async def post_to_linkedin(text: str) -> dict:
    """Post content via linkedin.py."""
    # Import inside function so sys.path is set
    from api.services.linkedin import create_post
    return await create_post(text)


async def main():
    print(f"[{datetime.now().isoformat()}] LinkedIn Poster — starting...")

    # 1. Generate content
    print("  Generating content...")
    try:
        content = await generate_content()
        print(f"  ✅ Content generated ({len(content)} chars)")
    except Exception as e:
        print(f"  ❌ Generation failed: {e}")
        content = (
            "Your resume is probably getting filtered by ATS before a human "
            "ever sees it.\n\n"
            "ATS software screens 75% of applications before a recruiter "
            "lays eyes on them. If your resume isn't optimized, you're "
            "invisible.\n\n"
            "The fix? Match your keywords to the job description. It's that "
            "simple—and that hard.\n\n"
            "Get your free ATS score at RezzoBot\n\n"
            "#ATS #ResumeTips #JobSearch"
        )
        print(f"  ⚠️ Using fallback content ({len(content)} chars)")

    # 2. Post
    print("  Posting to LinkedIn...")
    result = await post_to_linkedin(content)

    if result.get("ok"):
        post_url = result.get("url", "unknown")
        print(f"  ✅ POSTED: {post_url}")

        # Log
        log = {
            "ts": datetime.now().isoformat(),
            "url": post_url,
            "id": result.get("post_id"),
            "len": len(content),
        }
        os.makedirs("/data", exist_ok=True)
        with open("/data/linkedin_posts.jsonl", "a") as f:
            f.write(json.dumps(log) + "\n")
        print(f"  Logged to /data/linkedin_posts.jsonl")
    else:
        print(f"  ❌ FAILED: {result.get('error')}")
        print(f"  Detail: {result.get('detail')}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
