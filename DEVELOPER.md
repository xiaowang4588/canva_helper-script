# 🛠 开发者指南 (Developer Guide)

本文档面向希望参与开发和贡献的开发者，帮助你快速理解项目架构、搭建开发环境、进行功能扩展。

---

## 目录

- [架构概览](#架构概览)
- [项目结构](#项目结构)
- [工作原理](#工作原理)
- [模块详解](#模块详解)
- [本地开发](#本地开发)
- [测试方法](#测试方法)
- [新增 AI 服务](#新增-ai-服务)
- [新增功能模块](#新增功能模块)
- [发布流程](#发布流程)
- [调试技巧](#调试技巧)

---

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│  用户浏览器                                                │
│  ┌──────────────────────┐  ┌───────────────────────────┐ │
│  │ Tampermonkey 沙箱     │  │ 可画页面 (canva.cn)        │ │
│  │                      │  │                           │ │
│  │  loader.user.js ─────┼──│→ GM_xmlhttpRequest        │ │
│  │  (50行, 常驻不变)     │  │        │                   │ │
│  │       │              │  │        ▼                   │ │
│  │       │ eval()       │  │  dist/canva-ai-assistant.js│ │
│  │       ▼              │  │  (1975行, CDN热更新)       │ │
│  │  ┌─────────────────┐ │  │        │                   │ │
│  │  │ AI 服务层        │ │  │        │                   │ │
│  │  │ OpenAI/Claude/...│─┼──│→ AI API                   │ │
│  │  └─────────────────┘ │  │        │                   │ │
│  │  ┌─────────────────┐ │  │        ▼                   │ │
│  │  │ UI 层            │─┼──│→ 可画页面 DOM              │ │
│  │  │ 面板/标签/消息    │ │  │                           │ │
│  │  └─────────────────┘ │  │                           │ │
│  └──────────────────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**关键设计原则**：

| 原则 | 说明 |
|------|------|
| **分离加载与执行** | loader 极小（50行），只负责从 CDN 拉取完整代码。完整代码可随时更新 |
| **Tampermonkey 沙箱** | 所有代码在 TM 沙箱中运行，通过 `GM_*` API 绕过 CORS 直连 AI 服务 |
| **零后端依赖** | 不经过任何代理服务器，API Key 纯本地存储 |
| **SPA 兼容** | 定时检查 + 页面可见性 API 确保面板在 SPA 导航后自动恢复 |

---

## 项目结构

```
canva_helper-script/
├── loader/
│   └── canva-ai-loader.user.js   # 轻量加载器，发布到 GreasyFork/RAW
├── dist/
│   └── canva-ai-assistant.js     # 完整 AI 助手代码，托管 CDN
├── screenshots/                   # 截图资源
├── README.md                      # 用户文档
├── DEVELOPER.md                   # 开发者文档（本文件）
└── LICENSE                        # MIT
```

### 两个核心文件的关系

| 文件 | 角色 | 更新方式 | 大小 |
|------|------|----------|------|
| `loader/canva-ai-loader.user.js` | 入口，用户安装的就是这个 | 版本号变化时用户更新 | ≈50行 |
| `dist/canva-ai-assistant.js` | 完整功能代码 | push 即自动更新（CDN） | ≈2000行 |

**为什么要分离？**

- loader 一旦安装，几乎不需要更新
- dist 每次 push 自动通过 jsDelivr CDN 分发，用户无需手动更新
- loader 变更需要用户重新安装，dist 变更对用户透明

---

## 工作原理

### 启动流程

```
1. 用户打开 canva.cn
2. TM 注入 loader (根据 @match)
3. loader 检查 window.__CAA_LOADER_V2__ 防止重复运行
4. loader 发起 GM_xmlhttpRequest 拉取 dist 文件
   - 主地址: GitHub Raw (可靠、即时生效)
   - 备用地址: jsDelivr CDN (1.5秒后竞速启动)
5. 获取到代码后 eval() 在 TM 沙箱中执行
6. dist 代码检查 window.__CAA_LOADED_V2__ 防重复
7. 注入 CSS (GM_addStyle)
8. 创建 UI (面板 + 切换按钮)
9. 启动定时器 (2秒间隔检查面板是否存在)
10. 完成！
```

### SPA 导航处理

可画是 React SPA，页面切换不会触发整页刷新：

```
页面切换 → Canva 销毁旧 DOM
    │
    ▼
定时器 (2s) 检测到 #caa-panel 不存在
    │
    ▼
调用 init() 重新创建面板
    │
    ▼
面板恢复 ✅
```

另外，页面可见性 API 会在切换标签页回来时立即触发一次检查。

---

## 模块详解

### 1. 存储模块 (Storage)

```javascript
// 使用 GM_setValue/GM_getValue 实现本地持久化
const Storage = {
  get(key, defaultValue) { ... },  // 读取
  set(key, value) { ... },         // 写入
  defaults() { ... },              // 获取所有默认配置
};
```

存储的数据：
- `openai_key` — OpenAI API Key
- `openai_model` — 模型选择 (默认 gpt-4o)
- `anthropic_key` — Anthropic API Key
- `anthropic_model` — 模型选择
- `primary_text_ai` — 文案功能使用哪个 AI
- `primary_design_ai` — 设计建议使用哪个 AI
- `image_service` — 图片生成服务
- `stability_key` — Stability AI Key
- `unsplash_key` — Unsplash Access Key

所有 Key 以 `caa_` 前缀存储，避免与其他脚本冲突。

### 2. SSE 解析器 (SSEParser)

```javascript
class SSEParser {
  constructor()        // 初始化缓冲区
  feed(chunk)          // 喂入增量文本，返回解析出的事件数组
  flush()              // 清空缓冲区，返回剩余事件
}
```

支持 OpenAI 和 Anthropic 两种 SSE 格式：

- **OpenAI**: `data: {"choices":[{"delta":{"content":"你好"}}]}\n\n`
- **Anthropic**: `event: content_block_delta\ndata: {"delta":{"text":"你好"}}\n\n`

`feed()` 使用行缓冲区处理跨 chunk 的不完整行。

### 3. AI 服务层

#### streamOpenAIChat(apiKey, model, messages, onToken, onDone, onError)

流式调用 OpenAI Chat Completions API。

```
参数:
  apiKey   - OpenAI API Key
  model    - 模型 ID (gpt-4o, gpt-4o-mini, ...)
  messages - [{role, content}, ...]
  onToken  - (delta: string) => void  每次收到新 token
  onDone   - () => void              流完成
  onError  - (err: Error) => void    错误处理
```

**流式读取原理**：使用 `GM_xmlhttpRequest` 的 `onprogress` 回调，用 `lastLength` 跟踪已读取位置，仅将增量文本送入 SSEParser。

#### streamClaudeChat(apiKey, model, messages, onToken, onDone, onError)

与 OpenAI 相同，但：
- 消息格式转换为 Anthropic 格式（system 字段分离）
- 响应解析逻辑不同（`payload.delta.text`）
- 需要额外的 `anthropic-version` 请求头

#### generateDalleImage(apiKey, prompt, size, n)

非流式，返回 Promise<string[]> (图片 URL 数组)。支持 DALL-E 3。

#### generateStabilityImage(apiKey, prompt, width, height)

返回 Promise<string[]> (base64 data URI 数组)。使用 SDXL 模型。

#### searchUnsplash(accessKey, query, page, perPage)

返回 Promise<Object[]>（包含 id, url, thumb, download, author 字段）。

### 4. UI 组件

所有 UI 通过原生 DOM API 创建，**零框架依赖**。

核心函数：

```javascript
createElement(tag, attrs, children)  // 通用元素工厂
createPanel()                         // 创建主面板结构
createTab(icon, label, id)           // 创建标签按钮
addMessage(content, role)            // 添加消息气泡
addStreamingMessage()                // 添加流式消息（返回可更新的 DOM 元素）
addCopyButton(targetMsgEl)           // 添加复制按钮
showToast(msg, duration)             // 显示 Toast 通知
renderMarkdown(text)                 // 简易 Markdown → HTML
```

CSS 通过 `GM_addStyle` 注入，所有类名以 `caa-` 前缀避免与可画原生样式冲突。

### 5. 功能模块

| 模块 | 触发函数 | 渲染函数 | 说明 |
|------|----------|----------|------|
| 文案 | `runCopyGeneration()` | `renderCopyTab()` | 输入主题+风格 → 流式生成标题/副标题/正文 |
| 设计建议 | `runDesignAdvice()` | `renderDesignTab()` | 输入问题 → AI 分析给出建议 |
| 图片 | `runImageAction()` | `renderImageTab()` | AI 生成 / Unsplash 搜索双模式 |
| 设置 | `saveAllSettings()` | `renderSettingsTab()` | API Key 配置 + AI 路由 + 连接测试 |

### 6. SPA 生命周期

```javascript
// 定时器（每 2 秒检查一次）
function ensurePanelExists() {
  if (!$('#caa-panel') && document.body) init();
}

// 可见性变化时调整频率
document.addEventListener('visibilitychange', () => {
  if (document.hidden) startCheckTimer(10000);  // 后台 10s
  else startCheckTimer(2000);                    // 前台 2s
});
```

---

## 本地开发

### 推荐的开发流程

**方式一：直接修改独立版（最快）**

1. 编辑 `canva-ai-assistant.user.js`（仓库外的独立版）
2. Tampermonkey 管理面板 → 找到脚本 → 编辑 → 粘贴新代码
3. 刷新 canva.cn 测试
4. 确认无误后，同步修改 `dist/canva-ai-assistant.js`

**方式二：本地开一个 HTTP 服务器测试 loader 模式**

```bash
# 在项目目录下
cd canva-ai-assistant

# 启动本地服务器
python3 -m http.server 8080

# 修改 loader 中的 URL 指向本地:
# const MAIN_URL = 'http://localhost:8080/dist/canva-ai-assistant.js';
```

然后重新安装 loader 到 TM，测试 loader → dist 的完整流程。

### 修改后的提交流程

```bash
# 1. 修改 dist/canva-ai-assistant.js

# 2. 本地语法检查
node --check dist/canva-ai-assistant.js

# 3. 本地独立版也同步修改
# (canva-ai-assistant.user.js)

# 4. 提交
git add dist/canva-ai-assistant.js
git commit -m "feat/fix: 描述改动"

# 5. 推送到 GitHub
git push

# 6. CDN 自动生效 (≤1分钟 GitHub Raw, ≤12h jsDelivr)
```

> 如果有 API 层面的改动（新增 @connect 域名等），**必须同步更新 loader** 并升级版本号。

---

## 测试方法

### 功能测试清单

- [ ] 打开 canva.cn，面板出现
- [ ] 文案 Tab → 输入主题 → 流式输出 → 复制按钮可用
- [ ] 设计建议 Tab → 输入问题 → 返回建议
- [ ] 图片 Tab → AI 生成模式 → DALL-E 返回图片
- [ ] 图片 Tab → 搜索模式 → Unsplash 返回结果
- [ ] 设置 Tab → 输入 Key → 保存 → 测试连接
- [ ] 切换 AI 服务商（OpenAI ↔ Claude）→ 正常工作
- [ ] SPA 导航 → 进入项目设计页 → 面板恢复
- [ ] 折叠面板 → 切换按钮出现 → 点击展开
- [ ] `Ctrl+Shift+A` 切换面板
- [ ] 清空对话按钮工作

### 调试检查点

打开控制台，筛选 `CAA`：

```
正常日志链:
[CAA] 🚀 加载器启动 v1.0.x
[CAA] 尝试从 GitHub Raw 加载...
[CAA] GitHub Raw 响应: status=200, 长度=61523
[CAA] 完整代码开始执行...
[CAA] init() 开始创建面板...
[CAA] ✅ init() 完成，面板已创建
[CAA] ✅ 加载成功! (GitHub Raw)

SPA 恢复:
[CAA] 🔄 检测到面板缺失，重新创建...
```

---

## 新增 AI 服务

以添加「Google Gemini」为例：

### Step 1: 在设置面板中增加配置项

在 `dist/canva-ai-assistant.js` 的 `MODELS` 中：

```javascript
const MODELS = {
  // ... 现有 ...
  gemini: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro' },
  ],
};
```

在 `Storage.defaults()` 中：

```javascript
gemini_key: this.get('gemini_key', ''),
gemini_model: this.get('gemini_model', 'gemini-2.0-flash'),
```

### Step 2: 实现流式聊天函数

```javascript
function streamGeminiChat(apiKey, model, messages, onToken, onDone, onError) {
  const parser = new SSEParser();
  let lastLength = 0, calledDone = false;

  function processChunk(fullText) { /* 同 OpenAI 模式 */ }
  function finish() { /* 同 OpenAI 模式 */ }

  GM_xmlhttpRequest({
    method: 'POST',
    url: `https://generativelanguage.googleapis.com/v1/models/${model}:streamGenerateContent?key=${apiKey}`,
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    }),
    onprogress: (resp) => { /* SSE 解析 */ },
    onload: finish,
    onerror: (err) => { finish(); onError(err); },
    timeout: 120000,
  });
}
```

### Step 3: 在 `streamChat()` 中添加路由

```javascript
function streamChat(service, apiKey, model, messages, onToken, onDone, onError) {
  if (service === 'openai') streamOpenAIChat(...);
  else if (service === 'anthropic') streamClaudeChat(...);
  else if (service === 'gemini') streamGeminiChat(...);  // ← 新增
  else onError(new Error(`未知的 AI 服务: ${service}`));
}
```

### Step 4: 更新设置面板 UI

在 `renderSettingsTab()` 中增加 Gemini 配置区块。

### Step 5: 更新 loader

- 添加 `@connect generativelanguage.googleapis.com`
- 升级版本号

---

## 新增功能模块

以添加「AI 字体推荐」为例：

### Step 1: 增加 Tab

在 `createPanel()` 中：

```javascript
const tabBar = createElement('div', { className: 'caa-tabs' }, [
  createTab('📝', '文案', 'copy'),
  createTab('💡', '建议', 'design'),
  createTab('🎨', '图片', 'image'),
  createTab('🔤', '字体', 'font'),    // ← 新增
  createTab('⚙', '设置', 'settings'),
]);
```

### Step 2: 实现渲染和逻辑函数

```javascript
function renderFontTab() {
  // 设置输入区
  const inputArea = $('#caa-input-area');
  inputArea.innerHTML = '';
  // ... 创建输入框和按钮 ...
}

async function runFontRecommendation() {
  // 获取输入 → 构建 prompt → 调用 AI → 渲染结果
  const input = $('#caa-font-input');
  const topic = input.value.trim();
  if (!topic) return;
  
  const settings = Storage.defaults();
  const service = settings.primary_text_ai;
  // ... streamChat(...)
}
```

### Step 3: 在 `renderCurrentTab()` 中注册

```javascript
function renderCurrentTab() {
  switch (currentTab) {
    case 'copy': renderCopyTab(); break;
    case 'design': renderDesignTab(); break;
    case 'image': renderImageTab(); break;
    case 'font': renderFontTab(); break;      // ← 新增
    case 'settings': renderSettingsTab(); break;
  }
}
```

### Step 4: 无需改动 loader

只要不改动 `@connect` 或 `@grant`，dist 更新对用户透明。

---

## 发布流程

### 仅更新 dist（功能修复/增强）

```bash
# 修改 dist/canva-ai-assistant.js
git add dist/
git commit -m "fix/feat: 描述"
git push
# ✅ 用户自动获取更新，无需任何操作
```

### 需要更新 loader（新增 @connect 等）

```bash
# 1. 修改 loader 和 dist
# 2. 升级 loader 中的 @version 号
# 3. 提交
git add loader/ dist/
git commit -m "release: vX.Y.Z — 描述"
git push

# 4. 通知用户更新（打开 RAW URL 点击更新）
# 或在 GreasyFork 上发版说明
```

### 版本号规则

- `1.0.x` — Bug 修复
- `1.x.0` — 新功能
- `x.0.0` — 重大架构变更

---

## 调试技巧

### 1. 确认脚本是否运行

```javascript
// 在控制台输入
console.log(window.__CAA_LOADER_V2__);  // 有值 = loader 运行过
console.log(window.__CAA_LOADED_V2__);  // 有值 = dist 执行过
document.querySelector('#caa-panel');   // null = 面板不存在
```

### 2. 手动触发面板重建

```javascript
// 在控制台粘贴执行
const script = document.createElement('script');
script.src = 'https://raw.githubusercontent.com/xiaowang4588/canva_helper-script/master/dist/canva-ai-assistant.js';
document.head.appendChild(script);
// 注意：这样加载无法使用 GM_* API，只能用于 UI 调试
```

### 3. 检查 TM 脚本状态

Tampermonkey 图标 → 查看脚本是否已启用、@match 是否正确。

### 4. 检查网络请求

DevTools → Network → 筛选 `raw.githubusercontent` 或 `jsdelivr` → 查看 HTTP 状态码。

### 5. 检查 API Key 是否保存

```javascript
// 在 TM 脚本编辑器中，或控制台（如果 TM 配置允许）
GM_getValue('caa_openai_key');
```

---

## 相关链接

- [Tampermonkey 文档](https://www.tampermonkey.net/documentation.php)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Anthropic API 文档](https://docs.anthropic.com)
- [Unsplash API 文档](https://unsplash.com/documentation)
- [jsDelivr GitHub 集成](https://www.jsdelivr.com/?docs=gh)
