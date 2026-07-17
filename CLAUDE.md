# RezzoBot

AI 简历 ATS 优化 Telegram Bot。用户发简历 + 职位描述 → ATS 匹配分析 → 付费优化。

## Stack
- Python 3.12, FastAPI, python-telegram-bot
- Docker Compose (api + bot)
- DeepSeek v4-flash (纯文本, 不支持视觉)
- PyMuPDF + pytesseract (PDF/图片 OCR)
- 部署: 阿里云 root@47.84.54.161

## Key paths
- 本地: ~/Desktop/RezzoBot/
- 服务器: /root/RezzoBot/
- .env 含敏感信息，不要提交

## Git
- Remote: https://github.com/mk0428/RezzoBot (HTTPS PAT)
- 改完必须 git commit + git push

## Rules
- 所有用户数据 24h 自动删除
- Day 1-3 交付: TG Bot MVP — 简历解析 + ATS 诊断 + JD 匹配
- 不需要做收费功能，不需要做 AI 优化（那是 Day 4-5）
- 不要输出真实 API key 到任何文件或日志

## ⚠️ CRITICAL: 必读规则
在回答任何关于 RezzoBot 的产品战略、PMF、商业模式、功能优先级的问题前：
1. 先重读本文件 (CLAUDE.md) 第一行——产品定义写在那里
2. 再查 memory 中 "REZZOBOT 产品方向" 条目
3. 如果还模糊——去读 PLAN_DAY1-3.md 和 bot/main.py
4. 如果还不确定——直接问 MK，不要编
