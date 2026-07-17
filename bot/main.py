"""
RezzoBot — AI-Native Telegram Bot, fully conversational
"""
import os
import logging
import httpx
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

TOKEN = os.getenv("TG_BOT_TOKEN", "")
API_URL = os.getenv("API_URL", "http://api:8000")

SYSTEM_PROMPT = """You are RezzoBot, a professional AI resume assistant helping users analyze their resume's match with specific job descriptions.

Current User State: {state}
{context}

Reply Rules:
- Natural, concise, and professional English.
- Use emojis for flair, but don't overdo it.
- No buttons or menus; use natural language to guide the user.
- Guidance: If they don't have a resume, offer to provide a "sample resume" for them to try the demo.
- Privacy: Mention that data is encrypted and auto-deleted within 24 hours.
- If a user sends a file and you're unsure if it's a resume or a JD, ask for clarification.
"""

TRUST_TEXT = (
    "🔒 **Privacy**: Your data is encrypted during transmission and auto-deleted within 24 hours. Send /delete anytime to erase all data.\n\n"
    "**Want to try first?** Just say **\"sample resume\"** and I will run a full ATS demo with a sample profile - no need to share your real info.\n\n"
    "Or send your actual resume (PDF or screenshot) directly."
)

SAMPLE_RESUME = """
Name: Alex Chen
Position: Python Backend Developer
Experience: 3 years
Core Skills:
- Python, FastAPI/Django frameworks
- Docker containerization & Docker Compose
- AWS/Aliyun cloud services (EC2, S3, RDS)
- MySQL and Redis, performance optimization
- 3 years experience in high-traffic backend systems
"""

STATES = {
    "initial": "User just started the conversation. Introduce yourself and explain what you can do.",
    "waiting_resume": "User knows they need resume analysis. Wait for them to upload a resume file. Remind them to send PDF or screenshot.",
    "waiting_jd": "Resume received. Wait for user to provide a JD (job description). Can be text, link, or screenshot.",
}

async def chat_with_ai(state: str, context: dict, user_message: str) -> str:
    """Call DeepSeek to generate a reply"""
    state_desc = STATES.get(state, "")
    context_str = "\n".join(f"{k}: {v}" for k, v in context.items() if v)

    prompt = (
        f"Current State: {state_desc}\n"
        f"Context:\n{context_str}\n\n"
        f"User Message: {user_message}\n\n"
        f"Please reply to the user (return only the reply content, no extra explanation):"
    )

    deepseek_key = os.getenv("DEEPSEEK_API_KEY", "")
    if not deepseek_key:
        return "Sorry, the AI service is currently unavailable. Please try again later."

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {deepseek_key}", "Content-Type": "application/json"},
                json={
                    "model": "deepseek-v4-flash",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 300,
                    "temperature": 0.7,
                }
            )
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"].strip()
            else:
                logger.error(f"DeepSeek API error: {res.status_code} {res.text}")
                return "🤖 Oops, something went wrong while I was thinking. Please try again."
    except Exception as e:
        logger.error(f"DeepSeek call failed: {e}")
        return "🤖 I'm having trouble connecting to my brain. Could you try again in a moment?"


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Unified message handler"""
    user = update.effective_user
    if not user:
        return

    user_data = context.user_data
    state = user_data.get("state", "initial")
    msg = update.message

    # Text messages
    if msg.text:
        text = msg.text.strip()
        text_lower = text.lower()

        # /start or greetings reset
        greetings = ["/start", "hi", "hello", "hey", "start"]
        if any(g in text_lower for g in greetings) and state == "initial":
            user_data.clear()
            user_data["state"] = "initial"
            reply = (
                f"👋 Hello {user.first_name}! I'm **RezzoBot**, your AI resume assistant.\n\n"
                "I can help you analyze how well your resume matches a job and provide professional ATS optimization tips.\n\n"
                f"{TRUST_TEXT}"
            )
            await msg.reply_text(reply, parse_mode="Markdown")
            return

        # /delete clear data
        if text == "/delete":
            user_data.clear()
            await msg.reply_text("✅ All your data has been cleared. See you next time!")
            return

        # Simulated resume feature
        if any(kw in text_lower for kw in ["sample", "demo", "example"]):
            user_data["resume_text"] = SAMPLE_RESUME
            user_data["state"] = "waiting_jd"
            reply = (
                "✅ I've loaded a **sample resume** (3-year exp Python Developer) for you!\n\n"
                "Now, please send me a **Job Description (JD)** (text, link, or screenshot), and I'll analyze how well this sample matches it!"
            )
            await msg.reply_text(reply, parse_mode="Markdown")
            return

        # AI conversation
        reply = await chat_with_ai(state, dict(user_data), text)
        await msg.reply_text(reply)

        # Auto-switch state based on reply content
        reply_lower = reply.lower()
        if state == "initial" and any(kw in reply_lower for kw in ["resume", "upload", "send", "pdf", "file"]):
            user_data["state"] = "waiting_resume"
        return

    # File messages (PDF/Images)
    if msg.document or msg.photo:
        await handle_file(update, context)
        return


async def handle_file(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle file uploads"""
    user_data = context.user_data
    state = user_data.get("state", "initial")
    msg = update.message

    if msg.document:
        file = await msg.document.get_file()
        filename = msg.document.file_name or "document"
    else:
        file = await msg.photo[-1].get_file()
        filename = "screenshot.jpg"

    status_msg = await msg.reply_text(f"📄 Received `{filename}`, analyzing...")

    # Call API to parse
    file_bytes = await file.download_as_bytearray()
    async with httpx.AsyncClient(timeout=30.0) as client:
        files = {'file': (filename, bytes(file_bytes))}
        res = await client.post(f"{API_URL}/api/parse", files=files)

    if res.status_code != 200:
        await status_msg.edit_text("❌ File parsing failed. Please try again.")
        return

    parsed_text = res.json()["text"]

    if state == "waiting_jd":
        # Resume already exists, treat this file as JD
        resume_text = user_data.get("resume_text", "")
        if not resume_text:
            user_data["resume_text"] = parsed_text
            user_data["state"] = "waiting_jd"
            await status_msg.edit_text("✅ Received the file! It seems your previous resume data was lost, so I've saved this as your resume. Now, please send a JD!")
            return

        # Analyze matching
        await status_msg.edit_text("⏳ Analyzing match score...")
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(
                    f"{API_URL}/api/analyze",
                    json={"resume_text": resume_text, "jd_text": parsed_text}
                )
            if res.status_code == 200:
                report = res.json()["report"]
                matched = " · ".join(report["matched_keywords"]) if report["matched_keywords"] else "None"
                missing = " · ".join(report["missing_keywords"]) if report["missing_keywords"] else "None"
                msg_text = (
                    "📊 **ATS Diagnostic Report**\n"
                    "═══════════════\n"
                    f"Match Score: **{report['score']}/100**\n\n"
                    f"✅ **Matched ({len(report['matched_keywords'])})**\n{matched}\n\n"
                    f"🔴 **Missing ({len(report['missing_keywords'])})**\n{missing}\n\n"
                    "💡 **Suggestions**\n"
                    + "\n".join([f"• {s}" for s in report["suggestions"][:3]]) + "\n\n"
                    "📎 You can send another JD to continue testing, or send /start to begin again."
                )
                await status_msg.edit_text(msg_text, parse_mode="Markdown")
            else:
                await status_msg.edit_text("❌ Analysis failed. Please try again.")
        except Exception as e:
            logger.error(f"Analyze error: {e}")
            await status_msg.edit_text("❌ An error occurred during analysis.")
        return

    else:
        # No resume → treat as resume
        user_data["resume_text"] = parsed_text
        user_data["state"] = "waiting_jd"
        await status_msg.edit_text(
            "✅ Resume received! Now please send me a **Job Description (JD)**. You can:\n"
            "• Paste the JD text\n"
            "• Send a job link\n"
            "• Send a JD screenshot\n\n"
            "I'll analyze how well you match!"
        )


async def handle_errors(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Global error handler"""
    logger.error(f"Update {update} caused error {context.error}")


def main():
    if not TOKEN:
        logger.error("TG_BOT_TOKEN is not set!")
        return

    application = Application.builder().token(TOKEN).build()

    # Unified message handler
    application.add_handler(MessageHandler(filters.ALL, handle_message))

    # Error handler
    application.add_error_handler(handle_errors)

    logger.info("RezzoBot is starting (AI-Native mode)...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
