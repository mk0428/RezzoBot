# RezzoBot PRD v1.1

> 最后更新：2026-07-23
> 状态：🟢 已上线
> 前身文档：rezzobot-dev-plan.md (2026-07-16, 已废弃)
> 域名：https://rezzobot.com

---

## 1. 产品定位

**一句话：** AI-powered ATS resume checker + optimizer. We don't write your resume for you — we analyze it, score it, and show you what's missing.

**目标用户：**
- 求职者（主动找工作的在职/应届生）
- 想优化简历提高面试通过率的人
- 不了解 ATS 系统怎么工作的求职者

**核心理念：** "Your resume, your story" — 不代写简历，只做分析诊断和建议。

---

## 2. 产品架构

```
用户入口
  ├── Web (rezzobot.com) ← 主力
  │   ├── Analyze 页 → 通用结构分析（分享换免费）
  │   ├── Score 页   → 行业对标评分（每日1次免费）
  │   └── Target 页  → JD精确匹配（新人免费1次）
  └── TG Bot (@RezzoBot) ← 辅助获客渠道

基础设施
  ├── 前端: Next.js 14 App Router + Tailwind + Vercel (Hobby)
  ├── 后端: FastAPI + Docker Compose (阿里云 47.84.54.161)
  ├── AI: DeepSeek v4-flash (纯文本)
  ├── 支付: Lemon Squeezy ($4.99 / $14.90 / $666)
  └── 打赏: Stripe (Buy me a coffee)
```

---

## 3. 用户入口 & 转化漏斗

### 3.1 主页三卡片 → 三条路径

| 页面 | URL | 输入 | 输出 | 免费机制 | 付费触发 |
|------|-----|------|------|---------|---------|
| **Analyze** | /analyze | 只传简历（无需JD） | 结构评分 + 通用ATS建议 | 每次分享(LinkedIn/X)换1次 | 跳过分享 → "升级解锁" |
| **Score** | /score | 传简历 + 选行业(10个预设) | ATS分数 + 行业关键词对标 | 每日免费1次 | 第2次弹 Paywall |
| **Target** | /upload | 传简历 + 贴具体JD | 完整报告(分数+关键词+建议+Quick Wins) | 新人免费体验1次 | 第2次弹 Paywall |

### 3.2 行业预设关键词（10个）

1. Software Engineering
2. Data Science & ML
3. Product Management
4. Marketing
5. Finance & Accounting
6. Design (UI/UX)
7. Sales & BD
8. HR & Recruiting
9. Consulting
10. Operations

每个行业预设 12-15 个核心关键词，用于 Score 页面的无JD分析。

### 3.3 分享解锁机制（Analyze 页）

- 用户上传简历后，弹出分享弹窗
- 可选分享到 LinkedIn 或 X (Twitter)
- 点击分享 → 浏览器打开分享链接 → 立即解锁分析（不回传验证）
- 每日 localStorage 记录一次 key `_rezzobot_share_date`
- 跳过分享 → 显示错误提示 + CTA 引导到 Target 页或升级

---

## 4. ATS 分析引擎

### 4.1 调用链路

```
前端 → mk5188.duckdns.org/rezzobot-api/api/analyze（直调，不走 Vercel BFF）
     → DeepSeek v4-flash
     → 结构化 JSON 返回
```

### 4.2 分析输出（ATSReport）

| 字段 | 类型 | 说明 |
|------|------|------|
| score | int (0-100) | ATS 匹配度评分 |
| matched_keywords | string[] | 命中的关键词 |
| missing_keywords | string[] | 缺失的关键词 |
| suggestions | string[] | 建议列表（兼容 Bot 旧格式） |
| suggestions_structured | Suggestion[] | 结构化建议（section/issue/evidence/fix） |
| quick_wins | QuickWin[] | 速赢项（change/from/to） |
| match_detail | string | 一话总结 |

### 4.3 Prompt 策略

三种调用的 JD 输入不同：

| 页面 | JD 输入 | 策略 |
|------|---------|------|
| Analyze | 通用结构分析 prompt | 检查段落完整性、篇幅、格式、动词、量化成果 |
| Score | 行业关键词拼接成 JD | 用预设关键词库模拟一个该行业的招聘需求 |
| Target | 用户粘贴的真实 JD | 完整的JD+简历关键词对比 |

---

## 5. 付费体系

### 5.1 定价

| 计划 | 价格 | 适用范围 |
|------|------|---------|
| Single | $4.99/次 | 单次分析（Target + 后续优化） |
| Monthly | $14.99/月 | 不限分析次数 + 全文优化 + PDF/DOCX导出 |
| Lifetime | $666 | 永久使用 |

### 5.2 付费墙触发时机

- **Score 页**：每日第 2 次分析 → PaywallModal
- **Target 页**：新人第 2 次分析 → PaywallModal
- **Optimize 页**：免费用户每次 → PaywallModal
- **导出(Export)**：免费用户每次 → PaywallModal

### 5.3 支付栈

- Lemon Squeezy（damaiwushuang.lemonsqueezy.com）
- 前端 PaywallModal → LS Checkout URL → 回调带回 `?payment=success`
- 免费用户付费前每日 1 次分析（localStorage 控制）
- MKBot: Stripe 分立（打赏专用）

---

## 6. 页面清单

### 6.1 现有页面

| 页面 | 路由 | 组件 | 说明 |
|------|------|------|------|
| 首页 | / | page.tsx + FeatureCards | Hero + 哲学 + 特性卡片 + Telegram + 案例 + CTA |
| Analyze | /analyze | analyze/page.tsx | 上传 + 分享弹窗 + 通用分析 |
| Score | /score | score/page.tsx | 上传 + 行业下拉 + 评分 + Paywall |
| Target | /upload | upload/page.tsx | 三栏布局(简历/JD/报告) |
| Optimize | /optimize | optimize/page.tsx | AI 优化 + 对比 |
| Pricing | /pricing | pricing/page.tsx | 定价页（Rezi 风格） |
| Blog | /blog + 子页面 | blog/* | 7 篇 SEO 博客 |
| Privacy | /privacy | privacy/page.tsx | 隐私政策 |

### 6.2 导航栏

- Logo（图片）+ RezzoBot
- ATS Scanner → /upload
- Blog → /blog
- Pricing → /pricing
- Try for free → /upload（CTA 按钮）

### 6.3 Footer

- Product: ATS Scanner / Pricing / Blog
- Support: Contact Founder（LinkedIn 直达）
- Support Us: Buy me a coffee（Stripe）

---

## 7. 技术架构

### 7.1 前端

- Next.js 14 App Router + Tailwind CSS
- Vercel Hobby（自动部署 from GitHub main）
- API 直调后端（绕过 Vercel BFF 避免 10s 超时）
- Lucide React 图标

### 7.2 后端

- FastAPI + uvicorn
- Docker Compose（api + bot 两个容器）
- 阿里云 ECS（47.84.54.161）
- nginx 反代到 duckdns
- DeepSeek v4-flash（纯文本 LLM）

### 7.3 CI/CD

- GitHub Actions（push to main → SSH → docker compose build --no-cache api → up -d）
- 生产环境禁止直接写代码（硬规）

### 7.4 部署架构

```
rezzobot.com (Vercel)
  └── API 直调 → mk5188.duckdns.org/rezzobot-api (阿里云 nginx)
                    └── Docker: rezzobot-api (端口 8004)
                    └── Docker: rezzobot-bot (Telegram polling)
```

---

## 8. TG Bot（辅助渠道）

**状态：** 长期未部署 / 路径不通

- @RezzoBot on Telegram
- 功能：简历上传 → JD分析 → 返回报告
- 当前未部署到生产环境（阿里云 SSH 超时问题未解决）

---

## 9. MKBot（LinkedIn 自动发布）

**状态：** 已上线可用

- LinkedIn OAuth 2.0 认证流
- 发帖功能已通（sub=gWaGC-ZP1t）
- 主页：mkbot.ai（待 DNS 解析）
- LinkedIn 公司验证进度：未完成

---

## 10. 当前局限 & 待解决

| 问题 | 影响 | 优先级 |
|------|------|--------|
| Parse 只支持 PDF/图片，不支持 .txt 上传 | 前端提示支持 TXT 但后端会报错 | P2 |
| 分享解锁不回传验证 | 用户可跳过不分享 | P3（MVP接受） |
| TG Bot 未部署 | 辅助获客渠道缺失 | P2 |
| 后端阿里云 SSH 偶尔超时 | 部署/维护困难 | P2 |
| Vercel Hobby 限制（带宽/函数时长） | 流量上来后需升级 | P3 |
| 无 PostgreSQL 数据库 | 数据持久化（用户/分析历史）缺失 | P3 |
| SEO 博客仅 7 篇 | 流量天花板 | P2 |
| 无 A/B 测试 | 定价/转化优化靠猜 | P3 |
| 无邮件通知 | 付费用户留存/召回 | P4 |

---

## 11. 修订历史

| 版本 | 日期 | 修改变更 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-07-16 | 初始 PRD（rezzobot-dev-plan.md，Bot 优先） | MK |
| v1.1 | 2026-07-23 | 完整重写：三漏斗架构 + 支付 + 分享 + 行业对标 | Agent |
