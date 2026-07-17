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

SYSTEM_PROMPT = """你是一个专业的简历助手 RezzoBot，帮助用户分析简历与岗位的匹配度。

当前用户状态: {state}
{context}

回复规则：
- 自然、简洁、中文
- 用 emoji 点缀，不要太夸张
- 不要列按钮选项，用自然语言引导
- 如果用户发了一个文件，不确定是简历还是 JD 就问清楚
"""

STATES = {
    "initial": "用户刚进入对话，还不知道你能做什么。介绍自己并询问需求。",
    "waiting_resume": "用户知道要分析简历，等待他上传简历文件。提醒他发 PDF 或截图。",
    "waiting_jd": "已经收到简历，等待用户提供 JD（职位描述）。可以发文本、链接或截图。",
}

async def chat_with_ai(state: str, context: dict, user_message: str) -> str:
    """调用 DeepSeek 生成回复"""
    state_desc = STATES.get(state, "")
    context_str = "\n".join(f"{k}: {v}" for k, v in context.items() if v)

    prompt = (
        f"当前状态: {state_desc}\n"
        f"上下文:\n{context_str}\n\n"
        f"用户消息: {user_message}\n\n"
        f"请回复用户（仅返回回复内容，不要额外解释）："
    )

    deepseek_key = os.getenv("DEEPSEEK_API_KEY", "")
    if not deepseek_key:
        return "抱歉，AI 服务暂时不可用，请稍后再试。"

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
                return "🤖 思考中出了点小问题，请再试一次。"
    except Exception as e:
        logger.error(f"DeepSeek call failed: {e}")
        return "🤖 网络有点波动，稍后再试试？"


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """统一消息处理器"""
    user = update.effective_user
    if not user:
        return

    user_data = context.user_data
    state = user_data.get("state", "initial")
    msg = update.message

    # 纯文本消息
    if msg.text:
        text = msg.text.strip()

        # /start 重置
        if text == "/start":
            user_data.clear()
            user_data["state"] = "initial"
            reply = f"👋 你好 {user.first_name}！我是 **RezzoBot**，你的 AI 简历助手。\n\n我可以帮你分析简历和岗位的匹配度。发一份你的简历给我（PDF 或截图），我就能帮你看看匹配什么岗位最合适！"
            await msg.reply_text(reply, parse_mode="Markdown")
            return

        # /delete 清除数据
        if text == "/delete":
            user_data.clear()
            await msg.reply_text("✅ 你的所有数据已清除。")
            return

        # AI 对话
        reply = await chat_with_ai(state, dict(user_data), text)
        await msg.reply_text(reply)

        # 根据回复内容自动切换状态
        reply_lower = reply.lower()
        if state == "initial" and any(kw in reply_lower for kw in ["简历", "上传", "发", "pdf", "文件"]):
            user_data["state"] = "waiting_resume"
        return

    # 文件消息（PDF/图片）
    if msg.document or msg.photo:
        await handle_file(update, context)
        return


async def handle_file(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理文件上传"""
    user_data = context.user_data
    state = user_data.get("state", "initial")
    msg = update.message

    if msg.document:
        file = await msg.document.get_file()
        filename = msg.document.file_name or "document"
    else:
        file = await msg.photo[-1].get_file()
        filename = "screenshot.jpg"

    status_msg = await msg.reply_text(f"📄 收到 `{filename}`，正在分析...")

    # 调用 API 解析
    file_bytes = await file.download_as_bytearray()
    async with httpx.AsyncClient(timeout=30.0) as client:
        files = {'file': (filename, bytes(file_bytes))}
        res = await client.post(f"{API_URL}/api/parse", files=files)

    if res.status_code != 200:
        await status_msg.edit_text("❌ 文件解析失败，请重试。")
        return

    parsed_text = res.json()["text"]

    if state == "waiting_jd":
        # 已有简历，这个文件当 JD 处理
        resume_text = user_data.get("resume_text", "")
        if not resume_text:
            user_data["resume_text"] = parsed_text
            user_data["state"] = "waiting_jd"
            await status_msg.edit_text("✅ 收到文件！但好像之前的简历数据没了，我把这个当简历存下来了。现在发 JD 吧！")
            return

        # 分析匹配
        await status_msg.edit_text("⏳ 正在分析匹配度...")
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(
                    f"{API_URL}/api/analyze",
                    json={"resume_text": resume_text, "jd_text": parsed_text}
                )
            if res.status_code == 200:
                report = res.json()["report"]
                matched = " · ".join(report["matched_keywords"]) if report["matched_keywords"] else "无"
                missing = " · ".join(report["missing_keywords"]) if report["missing_keywords"] else "无"
                msg_text = (
                    "📊 **ATS 诊断报告**\n"
                    "═══════════════\n"
                    f"匹配度: **{report['score']}/100**\n\n"
                    f"✅ **已匹配 ({len(report['matched_keywords'])})**\n{matched}\n\n"
                    f"🔴 **缺失 ({len(report['missing_keywords'])})**\n{missing}\n\n"
                    "💡 **改进建议**\n"
                    + "\n".join([f"• {s}" for s in report["suggestions"][:3]]) + "\n\n"
                    "📎 可以换一个 JD 继续测试，或者发 /start 重新开始"
                )
                await status_msg.edit_text(msg_text, parse_mode="Markdown")
            else:
                await status_msg.edit_text("❌ 分析失败，请重试。")
        except Exception as e:
            logger.error(f"Analyze error: {e}")
            await status_msg.edit_text("❌ 分析过程出错。")
        return

    else:
        # 没有简历 → 当简历存
        user_data["resume_text"] = parsed_text
        user_data["state"] = "waiting_jd"
        await status_msg.edit_text(
            "✅ 简历收到！现在请发 **职位描述 (JD)** 给我，可以是：\n"
            "• 粘贴 JD 文本\n"
            "• 发送招聘链接\n"
            "• 发送 JD 截图\n\n"
            "我来帮你分析匹配度！"
        )


async def handle_errors(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """全局错误处理"""
    logger.error(f"Update {update} caused error {context.error}")


def main():
    if not TOKEN:
        logger.error("TG_BOT_TOKEN 未设置！")
        return

    application = Application.builder().token(TOKEN).build()

    # 统一消息处理器
    application.add_handler(MessageHandler(filters.ALL, handle_message))

    # 错误处理
    application.add_error_handler(handle_errors)

    logger.info("RezzoBot 启动中（AI-Native 模式）...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
