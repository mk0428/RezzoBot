# RezzoBot — P0 功能实现任务

## 目标
给 RezzoBot 增加信任声明和模拟简历功能。所有修改在 `bot/main.py` 中完成。

## 项目上下文
- 项目路径: ~/Desktop/RezzoBot
- 后端 API 地址: http://api:8000 (Docker 内部网络)
- Bot 框架: python-telegram-bot (无 ConversationHandler, 用简单状态机)
- AI 模型: DeepSeek (deepseek-v4-flash)
- 部署: Docker Compose on Aliyun, GitHub Actions 自动部署

## 当前代码结构
当前 `bot/main.py` 有这些函数:
- `chat_with_ai(state, context, user_message)` — 调用 DeepSeek 生成回复
- `handle_message(update, context)` — 统一消息处理器
- `handle_file(update, context)` — 处理文件上传 (PDF/图片)
- `handle_errors(update, context)` — 错误处理
- `main()` — 启动入口

状态存在 `context.user_data` 中:
- `state`: "initial" | "waiting_resume" | "waiting_jd"
- `resume_text`: 已解析的简历文本
- (其他 AI 对话上下文)

## 需要实现的功能

### 1. 首次对话信任声明
当用户状态为 "initial" 且发送 `/start` 或 "hi"/"hello"/"你好" 时，回复必须包含:
- Bot 介绍
- 隐私承诺: 数据加密传输、24小时自动删除、随时 /delete 清除
- 两个选项: 用模拟简历体验 / 直接上传简历

### 2. 模拟简历功能
用户选择"模拟简历"后:
- Bot 内置一份样板简历（Python 开发者，3年经验，FastAPI/Docker/AWS）
- 用户不需要上传任何文件
- Bot 自动进入 waiting_jd 状态，引导用户发 JD
- 模拟简历存到 context.user_data["resume_text"]

### 3. /delete 命令
任何时候发送 /delete 立即清除所有用户数据并回复确认消息。

## 约束
- 不要修改 api/ 目录下的任何文件
- 不要修改 Dockerfile
- 保持 AI 对话的自然语言风格
- 所有文本回复用中文
- 不要硬编码任何密钥
- 状态机保持简单: initial → waiting_resume → waiting_jd
- 文件上传逻辑保持现有逻辑不变
