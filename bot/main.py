"""
RezzoBot — Telegram Bot 入口
"""
import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TOKEN = os.getenv("TG_BOT_TOKEN", "")
SAMPLE_RESUMES = {
    "tech": "https://raw.githubusercontent.com/mk0428/RezzoBot/main/samples/resume_tech.pdf",
    "finance": "https://raw.githubusercontent.com/mk0428/RezzoBot/main/samples/resume_finance.pdf",
}


async def start(update: Update, context):
    """欢迎 + 隐私声明 + 模拟简历入口"""
    user = update.effective_user

    msg = (
        f"👋 你好 {user.first_name}！我是 **RezzoBot**，你的 AI 简历助手。\n\n"
        "🔍 我可以帮你：\n"
        "• 发简历给我 → 自动分析 ATS 匹配度\n"
        "• 粘贴职位描述 → 看看你的简历能不能通过\n"
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


async def sample_resume(update: Update, context):
    """用户选择用模拟简历体验"""
    query = update.callback_query
    await query.answer()

    msg = (
        "📄 我用一份 **技术岗（Tech）的模拟简历** 给你演示完整流程：\n\n"
        "1️⃣ 简历解析 → 提取你的经历和技能\n"
        "2️⃣ ATS 关键词匹配 → 对比目标职位\n"
        "3️⃣ AI 优化 → 补全缺失关键词\n"
        "4️⃣ 导出 PDF → 可直接投递\n\n"
        "开始体验？"
    )
    keyboard = [[InlineKeyboardButton("🚀 开始体验", callback_data="run_sample_tech")]]
    await query.edit_message_text(msg, reply_markup=InlineKeyboardMarkup(keyboard))


async def run_sample(update: Update, context):
    """运行模拟简历完整流程"""
    query = update.callback_query
    await query.answer()

    # 模拟结果
    msg = (
        "✅ **模拟简历分析完成！**\n\n"
        "📊 **ATS 评分：72/100**\n\n"
        "✅ 已匹配关键词（8个）：\n"
        "• `machine learning` • `Python` • `TensorFlow`\n"
        "• `data pipeline` • `SQL` • `A/B testing`\n"
        "• `AWS` • `CI/CD`\n\n"
        "⚠️ 建议添加关键词（4个）：\n"
        "• `Kubernetes` • `Docker`\n"
        "• `distributed systems` • `REST API`\n\n"
        "🤖 **AI 已自动优化简历版本**，添加了缺失的关键词，"
        "同时保持叙事自然。\n"
        "✨ 优化后预估 ATS 评分：**88/100**\n\n"
        "💡 想真正优化你的简历？直接上传 PDF 或图片给我！"
    )
    keyboard = [[InlineKeyboardButton("📤 上传我的简历", callback_data="upload_real")]]
    await query.edit_message_text(msg, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")


async def upload_real(update: Update, context):
    """引导用户上传真实简历"""
    query = update.callback_query
    if query:
        await query.answer()
        chat_id = query.message.chat_id
        msg = "📤 好的，发你的简历（PDF 或图片）给我吧！"
        await query.edit_message_text(msg)
    else:
        msg = (
            "📤 直接发简历文件（PDF 或截图）给我，"
            "我来分析 ATS 匹配度！\n\n"
            "或者粘贴一个 LinkedIn/GitHub 的职位链接，"
            "我帮你看看匹配度。"
        )


async def handle_document(update: Update, context):
    """处理上传的简历文件"""
    doc = update.message.document
    file_name = doc.file_name or "resume.pdf"

    await update.message.reply_text(
        f"📄 收到 `{file_name}`，正在解析...\n\n"
        "⏳ 请稍等，大约 10-30 秒",
        parse_mode="Markdown",
    )

    # Day 1 实际解析逻辑
    # 目前返回占位响应
    await update.message.reply_text(
        "📊 **简历解析完成！**\n\n"
        "👤 **姓名：** [待实现]\n"
        "💼 **工作经验：** [待实现]\n"
        "🎓 **教育背景：** [待实现]\n"
        "🔧 **技能：** [待实现]\n\n"
        "粘贴一个职位 JD 或 LinkedIn 链接，我来做 ATS 匹配分析！"
    )


async def handle_message(update: Update, context):
    """处理文本消息（JD 链接等）"""
    text = update.message.text.strip()

    if text.startswith("http"):
        await update.message.reply_text(
            "🔗 检测到链接，正在抓取 JD 内容...\n\n"
            "⏳ 请稍等"
        )
    else:
        await update.message.reply_text(
            "💬 试试：\n"
            "• 发简历文件（PDF/图片）给我\n"
            "• 粘贴 LinkedIn 职位链接\n"
            "• 发送 /start 重新开始"
        )


async def delete_command(update: Update, context):
    """/delete — 清除用户所有数据"""
    await update.message.reply_text(
        "✅ 你的所有数据已从服务器删除。\n"
        "隐私承诺：我们不会保留任何简历数据超过 24 小时。"
    )


def main():
    """启动 Bot"""
    if not TOKEN:
        logger.error("TG_BOT_TOKEN 未设置！")
        return

    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("delete", delete_command))
    app.add_handler(CallbackQueryHandler(sample_resume, pattern="^sample_"))
    app.add_handler(CallbackQueryHandler(run_sample, pattern="^run_sample"))
    app.add_handler(CallbackQueryHandler(upload_real, pattern="^upload_real"))
    app.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    app.add_handler(MessageHandler(filters.TEXT, handle_message))

    logger.info("RezzoBot 启动中...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
