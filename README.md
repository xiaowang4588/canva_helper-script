# 🎨 可画 AI 设计助手 (Canva AI Assistant)

> 一个 Tampermonkey 用户脚本，为 [可画 (Canva)](https://www.canva.cn) 网页端注入 AI 辅助面板。
>
> 🚀 **安装一次，永久自动更新** — 代码托管在 GitHub，通过 jsDelivr CDN 分发，push 即生效。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GreasyFork](https://img.shields.io/badge/GreasyFork-安装脚本-green)](https://greasyfork.org)

---

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 📝 **AI 文案生成** | 输入主题 → 选择风格 → 流式生成海报标题/副标题/正文，一键复制 |
| 💡 **设计建议** | 描述设计问题 → AI 分析并给出配色/排版/布局/字体专业建议 |
| 🎨 **AI 图片生成** | DALL-E 3 / Stability AI 文生图，支持多种比例 |
| 🔍 **智能配图搜索** | AI 优化关键词 → Unsplash 免费高质量图库搜索 |

**支持多种 AI 服务商**：
- 🔵 OpenAI (GPT-4o / GPT-4o-mini / DALL-E 3)
- 🟣 Anthropic (Claude Sonnet 5 / Fable 5 / Haiku 4.5)
- 🖼 Stability AI (SDXL)
- 📷 Unsplash (免费图库)

在设置中灵活配置，不同功能可路由到不同 AI。

---

## 📦 一键安装

### 第一步：安装 Tampermonkey

如果你的浏览器还没装 Tampermonkey：

| 浏览器 | 安装链接 |
|--------|----------|
| Chrome / Edge | [Tampermonkey - Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Tampermonkey - Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/) |
| Safari | [Tampermonkey - Mac App Store](https://apps.apple.com/app/tampermonkey/id1482490089) |

### 第二步：安装脚本（三选一）

#### 🔗 方式一：直接链接安装（推荐，无需等待）

在浏览器地址栏打开以下链接，Tampermonkey 自动弹出安装提示：

```
https://raw.githubusercontent.com/xiaowang4588/canva_helper-script/master/loader/canva-ai-loader.user.js
```

#### 🛒 方式二：GreasyFork（审核中）

> 🔗 [点此安装](https://greasyfork.org)（链接待审核通过后更新）

#### 🔧 方式三：手动导入

1. 点击 Tampermonkey 图标 → **管理面板**
2. 点击 **⚙ 实用工具** → **从 URL 安装**
3. 粘贴上面的 Raw 链接 → 安装

### 第三步：配置 API Key

1. 打开 [canva.cn](https://www.canva.cn) 或 [canva.com](https://www.canva.com)
2. 点击右侧 **AI** 按钮打开面板
3. 切换到「⚙ 设置」Tab
4. 填入至少一个 AI 服务的 API Key（推荐 OpenAI）
5. 点击「💾 保存设置」

> 🔑 **获取 API Key**：
> - OpenAI：[platform.openai.com/api-keys](https://platform.openai.com/api-keys)
> - Anthropic：[console.anthropic.com](https://console.anthropic.com)
> - Unsplash（可选）：[unsplash.com/developers](https://unsplash.com/developers)

---

## 🏗 工作原理

```
你在 GreasyFork 安装加载器（仅一次，~50行）
         │
         ▼
每次打开 canva.cn 时
         │
         ▼
加载器通过 GM_xmlhttpRequest 从 jsDelivr CDN 
拉取 dist/canva-ai-assistant.js（完整功能代码）
         │
         ▼
eval() 在 Tampermonkey 沙箱中执行
（GM_* API 全部可用，可直接调用 AI 服务商）
         │
         ▼
注入右侧 AI 侧边栏 → 开始使用 🎉
```

### 为什么这样设计？

| 传统脚本 | 本项目的 CDN 方案 |
|----------|-------------------|
| 每次更新需用户手动重装 | push 代码 → jsDelivr CDN 12h 内自动分发 |
| GreasyFork 审核延迟 | 更新无需平台审核 |
| 用户可能使用旧版本 | 始终保持最新 |
| 单文件难以协作开发 | 代码托管在 GitHub，便于 PR/Issue |

---

## 📁 项目结构

```
canva-ai-assistant/
├── loader/
│   └── canva-ai-loader.user.js   # 轻量加载器（发布到 GreasyFork）
├── dist/
│   └── canva-ai-assistant.js     # 完整 AI 助手代码（CDN 分发）
├── screenshots/                   # 截图（待补充）
├── README.md
└── LICENSE
```

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + Shift + A` | 显示/隐藏 AI 面板 |
| `Enter` | 发送消息 |
| `Shift + Enter` | 换行 |

---

## 🔒 隐私 & 安全

- **API Key 仅存储在浏览器本地**（Tampermonkey `GM_setValue`），不会上传到任何第三方服务器
- **AI 请求直连官方 API**（`api.openai.com` / `api.anthropic.com`），不经过任何中间代理
- **开源透明**：所有代码托管在 GitHub，可自行审查
- 不会收集或上传你的设计数据

---

## ❓ FAQ

**Q: 为什么需要 API Key？不能免费使用吗？**
A: AI 服务需要算力成本，OpenAI/Anthropic 按量计费。Unsplash 配图搜索可免费使用（有额度限制）。

**Q: 花费多少？**
A: GPT-4o-mini 约 ¥0.001/次对话，GPT-4o 约 ¥0.03/次。DALL-E 3 约 ¥0.3/张。日常使用每月几块钱。

**Q: 为什么面板没有出现？**
A: 刷新页面；检查 Tampermonkey 中脚本是否启用；打开浏览器控制台查看报错。

**Q: 更新频率？**
A: 代码 push 到 GitHub 后，jsDelivr CDN 在 12 小时内更新缓存。紧急更新可手动清除 CDN 缓存。

**Q: 能用其他 AI 服务吗？**
A: 目前支持 OpenAI / Anthropic / Stability AI。欢迎提交 PR 添加新服务商。

---

## 📋 更新日志

### v1.0.1 (2026-07-14)

- 🐛 **修复**：SPA 页面切换后面板消失的 bug。定时器从 `window.load` 事件改为 `init()` 后立即启动
- 🐛 **修复**：优化 `visibilitychange` 定时器管理，避免重复创建

### v1.0.0 (2026-07-14)

- 🎉 首次发布：文案生成、设计建议、AI 图片生成、智能配图
- 支持 OpenAI / Anthropic Claude / Stability AI / Unsplash

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

```bash
git clone https://github.com/xiaowang4588/canva_helper-script.git
cd canva-ai-assistant

# 修改 dist/canva-ai-assistant.js
# 本地测试：在 Tampermonkey 中手动导入该文件（绕过 CDN）

# 提交 PR
git checkout -b feature/my-feature
git commit -m "feat: add xxx"
git push origin feature/my-feature
```

---

## 📄 License

[MIT](LICENSE) © 2026 XWCT
