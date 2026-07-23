# RezzoBot 产品全貌地图

> 生成：2026-07-23
> 用途：我必须记住这个，不再问 MK 产品长什么样

---

## 入口汇总（所有用户能点进分析页面的方式）

| # | 位置 | 元素 | 跳转 | 说明 |
|---|------|------|------|------|
| 1 | 主页 Hero 区 | FileDropZone + "Score resume" 按钮 | → /upload | 用户拖拽/点选文件后自动跳 |
| 2 | 导航栏 | "Try for free" | → /upload | 蓝色 CTA 按钮 |
| 3 | 导航栏 | "ATS Scanner" | → /upload | 文字链接 |
| 4 | 主页 FeatureCards | Analyze 卡片 "Learn more" | → /analyze | 三卡片之一，蓝色图标 |
| 5 | 主页 FeatureCards | Score 卡片 "Learn more" | → /score | 三卡片之一，黄色图标 |
| 6 | 主页 FeatureCards | Target 卡片 "Learn more" | → /upload | 三卡片之一，绿色图标 |
| 7 | 主页 testimonials | "Get your score" 按钮 | → /upload | 案例区 |
| 8 | 主页 CTA | "Check your resume for free" | → /upload | 底部大按钮 |
| 9 | Footer | "ATS Scanner" | → /upload | 页脚链接 |

---

## 所有页面

| 路由 | 文件名 | 功能 |
|------|--------|------|
| / | page.tsx | 主页：Hero + 哲学 + FeatureCards + Telegram + 案例 + CTA |
| /analyze | analyze/page.tsx | 上传简历 → 分享弹窗(LinkedIn/X) → 通用结构分析(mode=structure, 无关键词匹配) → 引导去Target |
| /score | score/page.tsx | 上传简历 → 选行业(10个) → ATS评分 → 后端限流(1次/IP/天) → 超限弹Stripe Paywall |
| /upload | upload/page.tsx | 上传简历 → 贴JD → 三栏分析 → ATS报告 → 付费/优化 |
| /optimize | optimize/page.tsx | AI 优化 + 对比视图 |
| /pricing | pricing/page.tsx | 定价表: Free/$4.99/$14.99/$666 → Stripe checkout |
| /privacy | privacy/page.tsx | 隐私政策 |
| /blog | blog/page.tsx | 博客列表 |
| /blog/* | blog/*/page.tsx | 7篇SEO博客 |

---

## 组件

| 组件 | 使用页面 | 功能 |
|------|---------|------|
| Navbar | 所有 | Logo + 导航 + "Try for free" CTA |
| Footer | 所有 | 链接 + Stripe打赏按钮 |
| FileDropZone | 主页, /analyze, /score, /upload | PDF/DOCX/TXT拖拽上传 |
| FeatureCards | 主页 | 三张分析/评分/定位卡片 |
| ATSScorePanel | /upload, /analyze, /score, /optimize | 展示ATS报告分数+关键词+建议 |
| PaywallModal | /score, /upload, /optimize | Stripe checkout弹窗 |

---

## 后端 API

| 端点 | 方法 | 功能 | 访问方式 |
|------|------|------|---------|
| /api/parse | POST | 解析简历PDF/图片→文本 | 前端直调后端 |
| /api/analyze | POST | ATS关键词匹配分析 | 前端直调后端 |
| /api/optimize | POST | AI简历优化 | 前端直调后端 |
| /api/export/pdf | POST | 导出PDF | 前端直调后端 |
| /api/export/docx | POST | 导出DOCX | 前端直调后端 |
| /api/create-checkout-session | POST | Stripe checkout | 前端直调后端 |

所有前端API调用绕过Vercel BFF直调 `mk5188.duckdns.org/rezzobot-api/`

---

## 付费体系

**支付商：** Stripe（不是Lemon Squeezy）
**定价：** $4.99 single / $14.99 monthly / $666 lifetime
**Stripe Price IDs：** price_1TwHu6PmXBEMPweO524prhOG(single) / price_1TwHu6PmXBEMPweOgYuZdj1S(monthly) / price_1TwHu6PmXBEMPweOPVzmnGjF(lifetime)
**免费机制：** 统一 1 次/IP/天（所有功能共享），超限弹 Stripe Paywall
**打赏：** Stripe payment link（Buy me a coffee）

---

## TG Bot

- @RezzoBot on Telegram
- 功能：简历上传→JD分析→返回报告
- 状态：阿里云上代码存在，但SSH不通，未部署到生产

---

## 部署架构

rezzobot.com (Vercel, Hobby计划, 从GitHub main自动部署)
  └── API直调 → mk5188.duckdns.org/rezzobot-api (阿里云 nginx)
                  └── Docker: rezzobot-api (端口8004)
                  └── Docker: rezzobot-bot (TG, 未部署)
