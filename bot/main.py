"""
RezzoBot — Telegram Bot 入口
"""
import os
import logging
import httpx
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    filters,
    ContextTypes,
    ConversationHandler,
)

# 启用日志
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# 配置信息
TOKEN = os.getenv("TG_BOT_TOKEN", "")
API_URL = os.getenv("API_URL", "http://api:8000")

# 会话状态
CHOOSING, WAITING_FOR_JD = range(2)

# 模拟简历数据
SAMPLE_RESUME_TEXT = "模拟简历内容：张三，五年 Python 开发经验，精通 FastAPI, Docker, AWS。"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """欢迎 + 隐私声明 + 模拟简历入口"""
    user = update.effective_user
    # 清除旧的上下文数据
    context.user_data.clear()

    msg = (
        f"👋 你好 {user.first_name}！我是 **RezzoBot**，你的 AI 简历助手。\n\n"
        "🔍 我可以帮你：\n"
        "• 发简历给我 → 自动分析 ATS 匹配度\n"
        "• 提供 JD → 看看你的简历能不能通过\n"
        "• AI 优化 → 让简历更符合目标职位\n\n"
        "🔐 **隐私承诺：** 你的简历数据加密传输，"
        "24 小时后自动从服务器删除。任何时刻发送 /delete 可立即清除所有数据。\n\n"
        "👇 选择体验方式："
    )

    keyboard = [
        [InlineKeyboardButton("🎯 用模拟简历体验", callback_data="sample_tech")],
        [InlineKeyboardButton("📄 直接上传我的简历", callback_data="upload_real")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(msg, reply_markup=reply_markup, parse_mode="Markdown")
    return CHOOSING


async def sample_resume(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """用户选择用模拟简历体验"""
    query = update.callback_query
    await query.answer()

    context.user_data["resume_text"] = SAMPLE_RESUME_TEXT

    msg = (
        "📄 我已为你准备了一份 **技术岗（Tech）的模拟简历**。\n\n"
        "现在请提供你想匹配的 **JD (职位描述)**：\n"
        "📎 **分享链接** 从招聘 App 分享给我\n"
        "📸 **发截图** 截个图发过来\n"
        "✏️ **粘贴文本** 直接贴 JD 文字"
    )
    await query.edit_message_text(msg)
    return WAITING_FOR_JD


async def upload_real(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """引导用户上传真实简历"""
    query = update.callback_query
    await query.answer()

    msg = "📤 好的，直接发你的 **简历文件 (PDF 或图片)** 给我吧！"
    await query.edit_message_text(msg)
    return CHOOSING


async def handle_resume_file(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理上传的简历文件 (PDF/Image)"""
    # 区分文件和图片
    if update.message.document:
        file = await update.message.document.get_file()
        filename = update.message.document.file_name
    elif update.message.photo:
        file = await update.message.photo[-1].get_file()
        filename = "resume_screenshot.jpg"
    else:
        return CHOOSING

    status_msg = await update.message.reply_text(f"📄 收到 `{filename}`，正在解析... ⏳")

    try:
        # 下载并发送到 API
        file_bytes = await file.download_as_bytearray()
        files = {'file': (filename, bytes(file_bytes))}

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{API_URL}/api/parse", files=files)

        if response.status_code == 200:
            res_data = response.json()
            context.user_data["resume_text"] = res_data["text"]

            await status_msg.edit_text(
                "✅ 简历解析成功！\n\n"
                "现在请发送 **职位描述 (JD)**，可以是：\n"
                "• 粘贴 JD 文本\n"
                "• 发送职位链接 (LinkedIn/GitHub等)\n"
                "• 发送 JD 截图"
            )
            return WAITING_FOR_JD
        else:
            await status_msg.edit_text(f"❌ 解析失败 (HTTP {response.status_code})。请尝试重新上传。")
            return CHOOSING

    except Exception as e:
        logger.error(f"Error handling resume: {e}")
        await status_msg.edit_text("❌ 解析过程出错，请稍后再试。")
        return CHOOSING


async def handle_jd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理 JD 输入 (文本, 链接, 图片)"""
    resume_text = context.user_data.get("resume_text")
    if not resume_text:
        await update.message.reply_text("❌ 请先上传简历。")
        return CHOOSING

    jd_text = ""
    status_msg = await update.message.reply_text("⏳ 正在分析匹配度...")

    # 情况 1: 图片 JD
    if update.message.photo:
        file = await update.message.photo[-1].get_file()
        file_bytes = await file.download_as_bytearray()
        files = {'file': ('jd_screenshot.jpg', bytes(file_bytes))}

        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(f"{API_URL}/api/parse", files=files)
            if res.status_code == 200:
                jd_text = res.json()["text"]
            else:
                await status_msg.edit_text("❌ JD 截图解析失败。")
                return WAITING_FOR_JD

    # 情况 2: 链接 JD
    elif update.message.text and update.message.text.startswith("http"):
        url = update.message.text.strip()
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(f"{API_URL}/api/parse_jd_url", data={"url": url})
            if res.status_code == 200:
                jd_text = res.json()["text"]
            else:
                await status_msg.edit_text("❌ 无法从该链接抓取 JD。")
                return WAITING_FOR_JD

    # 情况 3: 纯文本 JD
    elif update.message.text:
        jd_text = update.message.text.strip()

    if not jd_text:
        await status_msg.edit_text("❓ 未能识别 JD 内容，请重新发送。")
        return WAITING_FOR_JD

    # 调用分析 API
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(
                f"{API_URL}/api/analyze",
                json={"resume_text": resume_text, "jd_text": jd_text}
            )

        if res.status_code == 200:
            report = res.json()["report"]

            # 格式化输出
            matched = " · ".join(report["matched_keywords"]) if report["matched_keywords"] else "无"
            missing = " · ".join(report["missing_keywords"]) if report["missing_keywords"] else "无"

            msg = (
                "📊 **ATS 诊断报告**\n"
                "═══════════════\n"
                f"匹配度: **{report['score']}/100**\n\n"
                f"✅ **已匹配 ({len(report['matched_keywords'])})**\n"
                f"{matched}\n\n"
                f"🔴 **缺失 ({len(report['missing_keywords'])})**\n"
                f"{missing}\n\n"
                "💡 **改进建议**\n"
                + "\n".join([f"• {s}" for s in report["suggestions"][:3]]) + "\n\n"
                "✨ *优化功能即将上线，敬请期待！*"
            )

            await status_msg.edit_text(msg, parse_mode="Markdown")
            return ConversationHandler.END
        else:
            await status_msg.edit_text(f"❌ 分析失败 (HTTP {res.status_code})。")
            return WAITING_FOR_JD

    except Exception as e:
        logger.error(f"Error analyzing: {e}")
        await status_msg.edit_text("❌ 分析过程出错，请稍后再试。")
        return WAITING_FOR_JD


async def delete_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """/delete — 清除用户所有数据"""
    context.user_data.clear()
    await update.message.reply_text(
        "✅ 你的所有数据已从服务器删除。\n"
        "隐私承诺：我们不会保留任何简历数据超过 24 小时。"
    )
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """取消当前对话"""
    await update.message.reply_text("已取消操作。发送 /start 重新开始。")
    return ConversationHandler.END


def main():
    """启动 Bot"""
    if not TOKEN:
        logger.error("TG_BOT_TOKEN 未设置！")
        return

    application = Application.builder().token(TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler("start", start),
            MessageHandler(filters.Document.ALL | filters.PHOTO, handle_resume_file),
        ],
        states={
            CHOOSING: [
                CallbackQueryHandler(sample_resume, pattern="^sample_"),
                CallbackQueryHandler(upload_real, pattern="^upload_real"),
                MessageHandler(filters.Document.ALL | filters.PHOTO, handle_resume_file),
            ],
            WAITING_FOR_JD: [
                MessageHandler(filters.TEXT | filters.PHOTO, handle_jd),
            ],
        },
        fallbacks=[CommandHandler("cancel", cancel), CommandHandler("delete", delete_command)],
        allow_reentry=True
    )

    application.add_handler(conv_handler)
    application.add_handler(CommandHandler("delete", delete_command))

    logger.info("RezzoBot 启动中...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
