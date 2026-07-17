# RezzoBot Day 1-3 开发计划

## 用户流程

```
① 用户发 PDF 简历 / 简历截图
    → Bot: "收到简历！JD 怎么给我？分享链接 / 发截图 / 粘贴文本"
② 用户发 JD（链接 / 截图 / 文本）
    → Bot 调用 API 做 ATS 匹配
③ Bot 返回报告：
    匹配度 65/100
    ✅ 已匹配（3/8）：Python, SQL, AWS
    🔴 缺失（5/8）：Docker, K8s, 微服务
    💡 优化功能即将上线
```

## 架构改动

### API 端（新增 + 修改）

**新增 `api/services/parser.py`**
- `extract_text_from_pdf(file_path)` → PyMuPDF 提取文本（支持数字 PDF）
- `extract_text_from_image(file_path)` → pytesseract OCR（截图简历/JD）
- `extract_jd_from_url(url)` → 简单爬取 JD 全文（requests + BeautifulSoup）

**新增 `api/services/analyzer.py`**
- `extract_keywords(text)` → DeepSeek 提取 JD 中的核心关键词
- `ats_match(resume_text, jd_text)` → DeepSeek 对比，返回：
  - 匹配度评分（0-100）
  - 已匹配关键词列表
  - 缺失关键词列表
  - 建议优先级排序

**新增 `api/routers/resume.py`**
- `POST /api/parse` → 接收文件（PDF/图片），返回提取文本 + 元信息
- `POST /api/analyze` → 接收 resume_text + jd_text，返回 ATS 报告 JSON

**修改 `api/models/schemas.py`**
- 新增 ParseResponse, AnalyzeRequest, AnalyzeResponse, ATSReport

**修改 Dockerfile.api**
- 安装系统依赖：tesseract-ocr, libtesseract-dev, poppler-utils
- Python 依赖：pytesseract, PyMuPDF (fitz), pdf2image, Pillow, beautifulsoup4, requests

### Bot 端（修改）

**修改 `bot/main.py`**
- `handle_document` → 调 API parse → 存临时结果 → 提示用户提供 JD
- 新增 `handle_jd_screenshot` → JD 截图走同一条 parse 路径
- 新增 `handle_jd_link` → 识别链接 → 调 API 爬取
- 新增 `handle_ats_result` → 显示格式化报告
- 用户会话状态管理（等待 JD 输入阶段）

### 交互体验（Mobile First）

```
用户: [发 PDF 简历]
Bot: ✅ 简历已收到！解析完成
     现在需要这个岗位的 JD——
     
     📎 [分享链接] 从招聘 App 分享给我
     📸 [发截图] 截个图发过来
     ✏️ [粘贴文本] 直接贴 JD 文字

用户: [发 JD 截图 或 贴链接 或 粘贴文本]
Bot: ⏳ 正在分析 ATS 匹配度...
     [3-5秒后]
     
     📊 ATS 诊断报告
     ═══════════════
     匹配度: 65/100
     
     ✅ 已匹配（3/8）
     Python · SQL · AWS
     
     🔴 缺失（5/8）
     Docker · Kubernetes · 微服务
     CI/CD · Terraform
     
     💡 优化功能即将上线
```

## 实现顺序

1. Docker 依赖 + requirements.txt
2. parser.py（PDF/图片/URL）
3. analyzer.py（DeepSeek ATS 匹配）
4. schemas.py + resume router
5. bot/main.py 流程改造
6. 测试：上传 → JD → 报告全流程
