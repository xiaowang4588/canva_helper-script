(function () {
  'use strict';

  // 防止重复加载（SPA 页面切换时）
  if (window.__CAA_LOADED_V2__) return;
  window.__CAA_LOADED_V2__ = true;
  console.log('[CAA] 完整代码开始执行...');

  // ==================== CSS 样式 ====================
  GM_addStyle(`
    /* CSS 变量 */
    :root {
      --caa-bg: #1a1a2e;
      --caa-bg-secondary: #16213e;
      --caa-bg-tertiary: #0f3460;
      --caa-text: #e0e0e0;
      --caa-text-secondary: #a0a0b0;
      --caa-accent: #7c4dff;
      --caa-accent-hover: #651fff;
      --caa-accent-light: rgba(124, 77, 255, 0.15);
      --caa-border: #2a2a4a;
      --caa-danger: #ff5252;
      --caa-success: #69f0ae;
      --caa-warning: #ffd740;
      --caa-radius: 10px;
      --caa-radius-sm: 6px;
      --caa-shadow: 0 8px 32px rgba(0,0,0,0.4);
      --caa-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
      --caa-font-mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    }

    /* 触发按钮 */
    #caa-toggle-btn {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 99998;
      width: 36px;
      height: 80px;
      background: var(--caa-accent);
      border: none;
      border-radius: 10px 0 0 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      writing-mode: vertical-lr;
      letter-spacing: 4px;
      box-shadow: -2px 0 12px rgba(124,77,255,0.3);
      transition: all 0.25s ease;
      user-select: none;
    }
    #caa-toggle-btn:hover {
      width: 42px;
      background: var(--caa-accent-hover);
      box-shadow: -4px 0 20px rgba(124,77,255,0.5);
    }
    #caa-toggle-btn.caa-hidden {
      right: -50px;
      opacity: 0;
      pointer-events: none;
    }

    /* 主面板 */
    #caa-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      z-index: 99999;
      background: var(--caa-bg);
      border-left: 1px solid var(--caa-border);
      box-shadow: var(--caa-shadow);
      display: flex;
      flex-direction: column;
      font-family: var(--caa-font);
      color: var(--caa-text);
      transform: translateX(0);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    #caa-panel.caa-collapsed {
      transform: translateX(100%);
    }

    /* 面板头部 */
    .caa-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--caa-bg-secondary);
      border-bottom: 1px solid var(--caa-border);
      flex-shrink: 0;
    }
    .caa-header-title {
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .caa-header-actions {
      display: flex;
      gap: 6px;
    }
    .caa-header-actions button {
      background: none;
      border: none;
      color: var(--caa-text-secondary);
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: var(--caa-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.15s;
    }
    .caa-header-actions button:hover {
      background: var(--caa-bg-tertiary);
      color: var(--caa-text);
    }

    /* Tab 栏 */
    .caa-tabs {
      display: flex;
      background: var(--caa-bg-secondary);
      border-bottom: 1px solid var(--caa-border);
      flex-shrink: 0;
    }
    .caa-tab {
      flex: 1;
      padding: 10px 6px;
      background: none;
      border: none;
      color: var(--caa-text-secondary);
      cursor: pointer;
      font-size: 12px;
      font-family: var(--caa-font);
      transition: all 0.2s;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }
    .caa-tab:hover {
      color: var(--caa-text);
      background: rgba(255,255,255,0.03);
    }
    .caa-tab.caa-active {
      color: var(--caa-accent);
      border-bottom-color: var(--caa-accent);
    }
    .caa-tab-icon {
      font-size: 16px;
    }

    /* 内容区 */
    .caa-content {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .caa-content::-webkit-scrollbar {
      width: 5px;
    }
    .caa-content::-webkit-scrollbar-track {
      background: transparent;
    }
    .caa-content::-webkit-scrollbar-thumb {
      background: var(--caa-border);
      border-radius: 3px;
    }

    /* 消息气泡 */
    .caa-message {
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: caa-fadeIn 0.3s ease;
    }
    @keyframes caa-fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .caa-message-user {
      align-items: flex-end;
    }
    .caa-message-ai {
      align-items: flex-start;
    }
    .caa-msg-label {
      font-size: 11px;
      color: var(--caa-text-secondary);
      font-weight: 500;
    }
    .caa-msg-bubble {
      max-width: 90%;
      padding: 10px 14px;
      border-radius: var(--caa-radius);
      font-size: 13px;
      line-height: 1.55;
      word-break: break-word;
    }
    .caa-message-user .caa-msg-bubble {
      background: var(--caa-accent);
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .caa-message-ai .caa-msg-bubble {
      background: var(--caa-bg-secondary);
      border: 1px solid var(--caa-border);
      border-bottom-left-radius: 4px;
    }
    .caa-msg-bubble p { margin: 0 0 6px 0; }
    .caa-msg-bubble p:last-child { margin: 0; }
    .caa-msg-bubble ul, .caa-msg-bubble ol { margin: 4px 0; padding-left: 18px; }
    .caa-msg-bubble li { margin: 2px 0; }
    .caa-msg-bubble strong { color: var(--caa-accent); }
    .caa-msg-bubble code {
      background: rgba(255,255,255,0.08);
      padding: 2px 5px;
      border-radius: 3px;
      font-family: var(--caa-font-mono);
      font-size: 12px;
    }
    .caa-msg-bubble pre {
      background: rgba(0,0,0,0.3);
      padding: 10px;
      border-radius: var(--caa-radius-sm);
      overflow-x: auto;
      font-family: var(--caa-font-mono);
      font-size: 12px;
    }

    /* 复制按钮 */
    .caa-copy-btn {
      background: var(--caa-accent-light);
      border: 1px solid var(--caa-accent);
      color: var(--caa-accent);
      padding: 4px 10px;
      border-radius: var(--caa-radius-sm);
      cursor: pointer;
      font-size: 11px;
      font-family: var(--caa-font);
      transition: all 0.15s;
      margin-top: 4px;
      align-self: flex-start;
    }
    .caa-copy-btn:hover {
      background: var(--caa-accent);
      color: #fff;
    }
    .caa-copy-btn.caa-copied {
      background: var(--caa-success);
      border-color: var(--caa-success);
      color: #000;
    }

    /* 输入区 */
    .caa-input-area {
      padding: 10px 12px;
      border-top: 1px solid var(--caa-border);
      background: var(--caa-bg-secondary);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .caa-input-row {
      display: flex;
      gap: 8px;
    }
    .caa-input-row textarea {
      flex: 1;
      background: var(--caa-bg);
      border: 1px solid var(--caa-border);
      border-radius: var(--caa-radius-sm);
      color: var(--caa-text);
      padding: 10px;
      font-family: var(--caa-font);
      font-size: 13px;
      resize: none;
      min-height: 60px;
      max-height: 150px;
      outline: none;
      transition: border-color 0.2s;
    }
    .caa-input-row textarea:focus {
      border-color: var(--caa-accent);
    }
    .caa-input-row textarea::placeholder {
      color: var(--caa-text-secondary);
    }
    .caa-send-btn {
      align-self: flex-end;
      background: var(--caa-accent);
      border: none;
      color: #fff;
      padding: 8px 18px;
      border-radius: var(--caa-radius-sm);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      font-family: var(--caa-font);
      transition: all 0.2s;
      white-space: nowrap;
    }
    .caa-send-btn:hover {
      background: var(--caa-accent-hover);
    }
    .caa-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .caa-input-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .caa-input-options select, .caa-input-options button {
      background: var(--caa-bg);
      border: 1px solid var(--caa-border);
      color: var(--caa-text);
      padding: 5px 10px;
      border-radius: var(--caa-radius-sm);
      font-size: 12px;
      font-family: var(--caa-font);
      cursor: pointer;
      outline: none;
    }
    .caa-input-options select:focus {
      border-color: var(--caa-accent);
    }

    /* 设置面板 */
    .caa-settings-section {
      margin-bottom: 16px;
    }
    .caa-settings-section h3 {
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--caa-accent);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .caa-settings-field {
      margin-bottom: 8px;
    }
    .caa-settings-field label {
      display: block;
      font-size: 11px;
      color: var(--caa-text-secondary);
      margin-bottom: 4px;
    }
    .caa-settings-field input,
    .caa-settings-field select {
      width: 100%;
      box-sizing: border-box;
      background: var(--caa-bg);
      border: 1px solid var(--caa-border);
      border-radius: var(--caa-radius-sm);
      color: var(--caa-text);
      padding: 8px 10px;
      font-size: 12px;
      font-family: var(--caa-font-mono);
      outline: none;
    }
    .caa-settings-field input:focus {
      border-color: var(--caa-accent);
    }
    .caa-settings-field input::placeholder {
      color: #555;
    }
    .caa-test-btn {
      background: var(--caa-bg-tertiary);
      border: 1px solid var(--caa-border);
      color: var(--caa-text);
      padding: 5px 12px;
      border-radius: var(--caa-radius-sm);
      cursor: pointer;
      font-size: 11px;
      font-family: var(--caa-font);
      transition: all 0.15s;
    }
    .caa-test-btn:hover {
      border-color: var(--caa-accent);
      color: var(--caa-accent);
    }
    .caa-test-btn.caa-test-ok {
      border-color: var(--caa-success);
      color: var(--caa-success);
    }
    .caa-test-btn.caa-test-fail {
      border-color: var(--caa-danger);
      color: var(--caa-danger);
    }

    /* 图片网格 */
    .caa-image-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .caa-image-card {
      background: var(--caa-bg-secondary);
      border: 1px solid var(--caa-border);
      border-radius: var(--caa-radius-sm);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;
    }
    .caa-image-card:hover {
      border-color: var(--caa-accent);
      transform: translateY(-2px);
    }
    .caa-image-card img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      display: block;
    }
    .caa-image-card .caa-img-actions {
      display: flex;
      gap: 4px;
      padding: 6px;
    }
    .caa-image-card .caa-img-actions button {
      flex: 1;
      background: var(--caa-accent-light);
      border: none;
      color: var(--caa-accent);
      padding: 4px 6px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 10px;
      font-family: var(--caa-font);
    }
    .caa-image-card .caa-img-actions button:hover {
      background: var(--caa-accent);
      color: #fff;
    }

    /* 加载动画 */
    .caa-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      color: var(--caa-text-secondary);
      font-size: 12px;
    }
    .caa-loading-dots {
      display: flex;
      gap: 4px;
    }
    .caa-loading-dots span {
      width: 6px;
      height: 6px;
      background: var(--caa-accent);
      border-radius: 50%;
      animation: caa-dot 1.4s infinite;
    }
    .caa-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .caa-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes caa-dot {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.2); }
    }

    /* 提示信息 */
    .caa-hint {
      text-align: center;
      color: var(--caa-text-secondary);
      font-size: 12px;
      padding: 30px 20px;
      line-height: 1.6;
    }
    .caa-hint-icon {
      font-size: 40px;
      display: block;
      margin-bottom: 10px;
    }

    /* Toast */
    .caa-toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--caa-bg-secondary);
      border: 1px solid var(--caa-border);
      color: var(--caa-text);
      padding: 10px 20px;
      border-radius: var(--caa-radius);
      font-size: 13px;
      font-family: var(--caa-font);
      z-index: 100000;
      box-shadow: var(--caa-shadow);
      animation: caa-toastIn 0.3s ease;
      pointer-events: none;
    }
    @keyframes caa-toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* 响应式：小屏幕时面板占满 */
    @media (max-width: 600px) {
      #caa-panel { width: 100vw; }
    }
  `);

  // ==================== 常量 & 配置 ====================
  const CONFIG = {
    PANEL_WIDTH: '400px',
    STORAGE_PREFIX: 'caa_',
  };

  const API_ENDPOINTS = {
    openai: 'https://api.openai.com/v1/chat/completions',
    anthropic: 'https://api.anthropic.com/v1/messages',
    stability: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    unsplash: 'https://api.unsplash.com',
  };

  const MODELS = {
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o (推荐)' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (快速)' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ],
    anthropic: [
      { id: 'claude-sonnet-5-20251001', name: 'Claude Sonnet 5' },
      { id: 'claude-fable-5', name: 'Claude Fable 5' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5 (快速)' },
    ],
  };

  const STYLE_OPTIONS = [
    { value: 'professional', label: '商务专业' },
    { value: 'creative', label: '创意设计' },
    { value: 'minimal', label: '简约清新' },
    { value: 'promo', label: '促销活动' },
    { value: 'tech', label: '科技现代' },
    { value: 'warm', label: '温馨亲和' },
  ];

  // ==================== 存储模块 ====================
  const Storage = {
    get(key, defaultValue = null) {
      const val = GM_getValue(CONFIG.STORAGE_PREFIX + key, null);
      if (val === null || val === undefined) return defaultValue;
      try { return JSON.parse(val); } catch (e) { return val; }
    },
    set(key, value) {
      GM_setValue(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
    },
    defaults() {
      return {
        openai_key: this.get('openai_key', ''),
        openai_model: this.get('openai_model', 'gpt-4o'),
        anthropic_key: this.get('anthropic_key', ''),
        anthropic_model: this.get('anthropic_model', 'claude-sonnet-5-20251001'),
        image_service: this.get('image_service', 'openai'),
        stability_key: this.get('stability_key', ''),
        unsplash_key: this.get('unsplash_key', ''),
        primary_text_ai: this.get('primary_text_ai', 'openai'),
        primary_design_ai: this.get('primary_design_ai', 'openai'),
      };
    },
  };

  // ==================== Toast 通知 ====================
  function showToast(msg, duration = 2000) {
    const el = document.createElement('div');
    el.className = 'caa-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  // ==================== SSE 流式解析器 ====================
  class SSEParser {
    constructor() {
      this.buffer = '';
    }

    feed(chunk) {
      this.buffer += chunk;
      const lines = this.buffer.split('\n');
      this.buffer = lines.pop() || ''; // 最后一行可能不完整
      const events = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // OpenAI SSE: "data: {...}"
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            events.push({ type: 'done' });
            continue;
          }
          try {
            events.push({ type: 'data', payload: JSON.parse(data) });
          } catch (e) {
            // 忽略解析失败的数据行
          }
        }

        // Anthropic SSE (也是 data: 格式但结构不同)
        // "data: {"type":"content_block_delta", ...}"
        // 也兼容 event: 行（Anthropic 格式）
        if (trimmed.startsWith('event: ')) {
          events.push({ type: 'event', payload: trimmed.slice(7) });
        }
      }
      return events;
    }

    flush() {
      if (this.buffer.trim()) {
        const events = this.feed('\n');
        this.buffer = '';
        return events;
      }
      return [];
    }
  }

  // ==================== AI 服务层 ====================

  // OpenAI Chat (流式)
  function streamOpenAIChat(apiKey, model, messages, onToken, onDone, onError) {
    const parser = new SSEParser();
    let lastLength = 0;
    let calledDone = false;

    function processChunk(fullText) {
      const delta = fullText.substring(lastLength);
      lastLength = fullText.length;
      if (!delta) return;
      const events = parser.feed(delta);
      for (const ev of events) {
        if (ev.type === 'data' && ev.payload) {
          const content = ev.payload.choices?.[0]?.delta?.content;
          if (content) onToken(content);
        }
      }
    }

    function finish() {
      if (calledDone) return;
      calledDone = true;
      const remaining = parser.flush();
      for (const ev of remaining) {
        if (ev.type === 'data' && ev.payload) {
          const content = ev.payload.choices?.[0]?.delta?.content;
          if (content) onToken(content);
        }
      }
      onDone();
    }

    GM_xmlhttpRequest({
      method: 'POST',
      url: API_ENDPOINTS.openai,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      data: JSON.stringify({
        model: model,
        messages: messages,
        stream: true,
        temperature: 0.8,
      }),
      onprogress: function (resp) {
        const text = resp.responseText || resp.response || '';
        if (text) processChunk(text);
      },
      onreadystatechange: function (resp) {
        if (resp.readyState === 4) {
          const text = resp.responseText || resp.response || '';
          if (text) processChunk(text);
        }
      },
      onload: function (resp) {
        const text = resp.responseText || resp.response || '';
        if (text) processChunk(text);
        finish();
      },
      onerror: function (err) {
        finish();
        onError(new Error('OpenAI 请求失败: ' + (err?.statusText || err?.status || '网络错误')));
      },
      ontimeout: function () {
        finish();
        onError(new Error('OpenAI 请求超时'));
      },
      timeout: 120000,
    });
  }

  // Anthropic Claude Chat (流式)
  function streamClaudeChat(apiKey, model, messages, onToken, onDone, onError) {
    // 转换消息格式: OpenAI format → Anthropic format
    const systemMsg = messages.find(m => m.role === 'system');
    const anthropicMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    const parser = new SSEParser();
    let lastLength = 0;
    let calledDone = false;

    function extractText(payload) {
      // Anthropic 流式格式: delta.text 或 content_block.text
      if (payload.type === 'content_block_delta' && payload.delta?.text) {
        return payload.delta.text;
      }
      if (payload.type === 'content_block_start' && payload.content_block?.text) {
        return payload.content_block.text;
      }
      return payload.delta?.text || payload.content_block?.text || '';
    }

    function processChunk(fullText) {
      const delta = fullText.substring(lastLength);
      lastLength = fullText.length;
      if (!delta) return;
      const events = parser.feed(delta);
      for (const ev of events) {
        if (ev.type === 'data' && ev.payload) {
          const text = extractText(ev.payload);
          if (text) onToken(text);
        }
      }
    }

    function finish() {
      if (calledDone) return;
      calledDone = true;
      const remaining = parser.flush();
      for (const ev of remaining) {
        if (ev.type === 'data' && ev.payload) {
          const text = extractText(ev.payload);
          if (text) onToken(text);
        }
      }
      onDone();
    }

    GM_xmlhttpRequest({
      method: 'POST',
      url: API_ENDPOINTS.anthropic,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      data: JSON.stringify({
        model: model,
        max_tokens: 4096,
        system: systemMsg ? systemMsg.content : undefined,
        messages: anthropicMessages,
        stream: true,
      }),
      onprogress: function (resp) {
        const text = resp.responseText || resp.response || '';
        if (text) processChunk(text);
      },
      onreadystatechange: function (resp) {
        if (resp.readyState === 4) {
          const text = resp.responseText || resp.response || '';
          if (text) processChunk(text);
        }
      },
      onload: function (resp) {
        const text = resp.responseText || resp.response || '';
        if (text) processChunk(text);
        finish();
      },
      onerror: function (err) {
        finish();
        onError(new Error('Claude 请求失败: ' + (err?.statusText || err?.status || '网络错误')));
      },
      ontimeout: function () {
        finish();
        onError(new Error('Claude 请求超时'));
      },
      timeout: 120000,
    });
  }

  // DALL-E 图片生成 (非流式)
  function generateDalleImage(apiKey, prompt, size = '1024x1024', n = 1) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.openai.com/v1/images/generations',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        data: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: n,
          size: size,
          quality: 'standard',
        }),
        onload: function (resp) {
          try {
            const data = JSON.parse(resp.responseText);
            if (data.data && data.data.length > 0) {
              resolve(data.data.map(d => d.url || d.b64_json));
            } else if (data.error) {
              reject(new Error(data.error.message || 'DALL-E 生成失败'));
            } else {
              reject(new Error('DALL-E 返回为空'));
            }
          } catch (e) {
            reject(new Error('解析 DALL-E 响应失败'));
          }
        },
        onerror: function (err) {
          reject(new Error('DALL-E 请求失败: ' + (err?.statusText || '网络错误')));
        },
        timeout: 60000,
      });
    });
  }

  // Stability AI 图片生成
  function generateStabilityImage(apiKey, prompt, width = 1024, height = 1024) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      // Stability API 用 multipart/form-data
      // GM_xmlhttpRequest 对于 FormData 需要特殊处理
      // 这里使用 JSON body 的 v1 API
      GM_xmlhttpRequest({
        method: 'POST',
        url: API_ENDPOINTS.stability,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        data: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1 }],
          cfg_scale: 7,
          height: height,
          width: width,
          samples: 1,
          steps: 30,
        }),
        onload: function (resp) {
          try {
            const data = JSON.parse(resp.responseText);
            if (data.artifacts && data.artifacts.length > 0) {
              // Stability 返回 base64
              resolve(data.artifacts.map(a => 'data:image/png;base64,' + a.base64));
            } else if (data.message) {
              reject(new Error(data.message));
            } else {
              reject(new Error('Stability AI 返回为空'));
            }
          } catch (e) {
            reject(new Error('解析 Stability AI 响应失败'));
          }
        },
        onerror: function (err) {
          reject(new Error('Stability AI 请求失败: ' + (err?.statusText || '网络错误')));
        },
        timeout: 60000,
      });
    });
  }

  // Unsplash 搜索
  function searchUnsplash(accessKey, query, page = 1, perPage = 10) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${API_ENDPOINTS.unsplash}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
        headers: {
          'Authorization': `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
        onload: function (resp) {
          try {
            const data = JSON.parse(resp.responseText);
            if (data.results) {
              resolve(data.results.map(r => ({
                id: r.id,
                url: r.urls.regular,
                thumb: r.urls.thumb,
                download: r.links.download_location,
                author: r.user.name,
                description: r.description || r.alt_description || '',
              })));
            } else if (data.errors) {
              reject(new Error(data.errors[0] || 'Unsplash 搜索失败'));
            } else {
              resolve([]);
            }
          } catch (e) {
            reject(new Error('解析 Unsplash 响应失败'));
          }
        },
        onerror: function (err) {
          reject(new Error('Unsplash 请求失败: ' + (err?.statusText || '网络错误')));
        },
        timeout: 30000,
      });
    });
  }

  // ==================== 统一的流式聊天调用 ====================
  function streamChat(service, apiKey, model, messages, onToken, onDone, onError) {
    if (service === 'openai') {
      streamOpenAIChat(apiKey, model, messages, onToken, onDone, onError);
    } else if (service === 'anthropic') {
      streamClaudeChat(apiKey, model, messages, onToken, onDone, onError);
    } else {
      onError(new Error(`未知的 AI 服务: ${service}`));
    }
  }

  // ==================== Markdown 简化渲染 ====================
  function renderMarkdown(text) {
    if (!text) return '';
    // 基础 Markdown → HTML
    let html = text
      // 转义 HTML
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // 代码块 (```...```)
      .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // 行内代码 (`...`)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 粗体 (**...**)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // 斜体 (*...*)
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // 标题 (### ...)
      .replace(/^### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^## (.+)$/gm, '<h3>$1</h3>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      // 无序列表
      .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
      // 有序列表
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // 换行
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // 包装连续的 <li> 到 <ul>
    html = html.replace(/((?:<li>.*?<\/li><br>?)+)/g, '<ul>$1</ul>');
    html = html.replace(/<\/li><br><ul>/g, '</li><ul>');
    html = html.replace(/<\/ul><br><li>/g, '</ul><li>');

    return '<p>' + html + '</p>';
  }

  // ==================== DOM 工具 ====================
  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'className') el.className = val;
      else if (key === 'innerHTML') el.innerHTML = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      } else if (key === 'style' && typeof val === 'object') {
        Object.assign(el.style, val);
      } else {
        el.setAttribute(key, val);
      }
    }
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child instanceof Node) el.appendChild(child);
    });
    return el;
  }

  // ==================== UI 组件 ====================

  // 主面板
  function createPanel() {
    const panel = createElement('div', { id: 'caa-panel', className: 'caa-collapsed' });

    // Header
    const header = createElement('div', { className: 'caa-header' }, [
      createElement('div', { className: 'caa-header-title' }, [
        createElement('span', { textContent: '🤖' }),
        createElement('span', { textContent: 'AI 设计助手' }),
      ]),
      createElement('div', { className: 'caa-header-actions' }, [
        createElement('button', { textContent: '🗑', title: '清空对话', onClick: () => clearCurrentChat() }),
        createElement('button', { textContent: '×', title: '关闭面板', onClick: () => togglePanel(false) }),
      ]),
    ]);

    // Tabs
    const tabBar = createElement('div', { className: 'caa-tabs' }, [
      createTab('📝', '文案', 'copy'),
      createTab('💡', '建议', 'design'),
      createTab('🎨', '图片', 'image'),
      createTab('⚙', '设置', 'settings'),
    ]);

    // Content
    const content = createElement('div', { className: 'caa-content', id: 'caa-content' });

    // Input area
    const inputArea = createElement('div', { className: 'caa-input-area', id: 'caa-input-area' });

    panel.appendChild(header);
    panel.appendChild(tabBar);
    panel.appendChild(content);
    panel.appendChild(inputArea);

    return panel;
  }

  function createTab(icon, label, id) {
    return createElement('button', {
      className: 'caa-tab',
      'data-tab': id,
      onClick: () => switchTab(id),
    }, [
      createElement('span', { className: 'caa-tab-icon', textContent: icon }),
      createElement('span', { textContent: label }),
    ]);
  }

  // 消息气泡
  function addMessage(content, role = 'ai') {
    const contentEl = $('#caa-content');
    if (!contentEl) return null;

    const msgDiv = createElement('div', {
      className: `caa-message caa-message-${role}`,
    }, [
      createElement('span', {
        className: 'caa-msg-label',
        textContent: role === 'user' ? '你' : 'AI',
      }),
      createElement('div', {
        className: 'caa-msg-bubble',
        innerHTML: role === 'ai' ? renderMarkdown(content) : content,
      }),
    ]);

    contentEl.appendChild(msgDiv);
    contentEl.scrollTop = contentEl.scrollHeight;
    return msgDiv;
  }

  function addStreamingMessage() {
    const contentEl = $('#caa-content');
    if (!contentEl) return null;

    const msgDiv = createElement('div', {
      className: 'caa-message caa-message-ai',
    }, [
      createElement('span', { className: 'caa-msg-label', textContent: 'AI' }),
      createElement('div', { className: 'caa-msg-bubble', id: 'caa-streaming-msg' }),
    ]);

    contentEl.appendChild(msgDiv);
    contentEl.scrollTop = contentEl.scrollHeight;
    return $('#caa-streaming-msg');
  }

  function addLoadingIndicator() {
    const contentEl = $('#caa-content');
    if (!contentEl) return null;

    const el = createElement('div', { className: 'caa-loading' }, [
      createElement('div', { className: 'caa-loading-dots' }, [
        createElement('span'), createElement('span'), createElement('span'),
      ]),
      createElement('span', { textContent: 'AI 思考中...' }),
    ]);

    contentEl.appendChild(el);
    contentEl.scrollTop = contentEl.scrollHeight;
    return el;
  }

  function removeLoadingIndicator(loadingEl) {
    if (loadingEl) loadingEl.remove();
  }

  function addCopyButton(targetMsgEl) {
    const btn = createElement('button', {
      className: 'caa-copy-btn',
      textContent: '📋 复制',
      onClick: function () {
        const bubble = targetMsgEl.querySelector('.caa-msg-bubble');
        if (bubble) {
          navigator.clipboard.writeText(bubble.textContent).then(() => {
            btn.textContent = '✅ 已复制';
            btn.classList.add('caa-copied');
            setTimeout(() => {
              btn.textContent = '📋 复制';
              btn.classList.remove('caa-copied');
            }, 2000);
          });
        }
      },
    });
    targetMsgEl.appendChild(btn);
  }

  // ==================== 功能模块 ====================

  // --- 文案生成 ---
  function renderCopyTab() {
    const inputArea = $('#caa-input-area');
    if (!inputArea) return;
    inputArea.innerHTML = '';

    const styleSelect = createElement('select', { id: 'caa-copy-style' },
      STYLE_OPTIONS.map(o => createElement('option', { value: o.value, textContent: o.label }))
    );

    inputArea.appendChild(
      createElement('div', { className: 'caa-input-options' }, [
        createElement('span', { textContent: '风格:', style: { fontSize: '12px', color: 'var(--caa-text-secondary)', alignSelf: 'center' } }),
        styleSelect,
      ])
    );

    inputArea.appendChild(
      createElement('div', { className: 'caa-input-row' }, [
        createElement('textarea', {
          id: 'caa-copy-input',
          placeholder: '描述你的海报主题，例如：\n"618年中大促，数码产品专场，主打性价比"',
          onKeydown: (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              runCopyGeneration();
            }
          },
        }),
        createElement('button', {
          className: 'caa-send-btn',
          textContent: '生成',
          onClick: () => runCopyGeneration(),
          id: 'caa-copy-send',
        }),
      ])
    );

    // placeholder 内容
    const contentEl = $('#caa-content');
    if (contentEl) {
      contentEl.innerHTML = '';
      contentEl.appendChild(
        createElement('div', { className: 'caa-hint' }, [
          createElement('span', { className: 'caa-hint-icon', textContent: '📝' }),
          createElement('p', { textContent: '输入你的海报主题，AI 帮你生成标题、副标题和正文文案' }),
        ])
      );
    }
  }

  async function runCopyGeneration() {
    const input = $('#caa-copy-input');
    const styleSelect = $('#caa-copy-style');
    const sendBtn = $('#caa-copy-send');
    const contentEl = $('#caa-content');
    if (!input || !contentEl) return;

    const topic = input.value.trim();
    if (!topic) { showToast('请先输入海报主题'); return; }

    const style = styleSelect ? styleSelect.value : 'professional';
    const styleLabel = STYLE_OPTIONS.find(s => s.value === style)?.label || style;

    // 获取设置
    const settings = Storage.defaults();
    const service = settings.primary_text_ai;
    const apiKey = service === 'openai' ? settings.openai_key : settings.anthropic_key;
    const model = service === 'openai' ? settings.openai_model : settings.anthropic_model;

    if (!apiKey) {
      showToast('请先在「设置」中配置 API Key');
      return;
    }

    // 清空并显示用户输入
    if (contentEl.querySelector('.caa-hint')) contentEl.innerHTML = '';
    addMessage(`主题：${topic}\n风格：${styleLabel}`, 'user');
    input.value = '';
    sendBtn.disabled = true;

    const loading = addLoadingIndicator();
    const streamingEl = addStreamingMessage();
    if (loading) loading.style.display = 'none';

    let fullText = '';

    const systemPrompt = `你是一个专业的海报文案策划专家。用户会告诉你海报的主题和风格偏好，你需要生成专业、吸引人的海报文案。

输出格式：
1. **标题方案**（提供 3 个备选，用数字编号）
2. **副标题**（简洁有力，1-2 句）
3. **核心正文**（80-150 字，突出卖点）

注意：
- 语言精炼，符合海报阅读习惯
- 根据风格调整语气
- 可以使用适当的 emoji 增强表现力`;

    const userPrompt = `请为以下海报主题生成文案：
- 主题：${topic}
- 风格：${styleLabel}

请按照标准格式输出。`;

    streamChat(
      service, apiKey, model,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      (token) => {
        if (loading) { loading.remove(); }
        fullText += token;
        if (streamingEl) streamingEl.innerHTML = renderMarkdown(fullText);
        contentEl.scrollTop = contentEl.scrollHeight;
      },
      () => {
        removeLoadingIndicator(loading);
        if (streamingEl) {
          streamingEl.removeAttribute('id');
          addCopyButton(streamingEl.closest('.caa-message'));
        }
        sendBtn.disabled = false;
      },
      (err) => {
        removeLoadingIndicator(loading);
        if (streamingEl) streamingEl.innerHTML = `<span style="color:var(--caa-danger)">❌ ${err.message}</span>`;
        sendBtn.disabled = false;
      }
    );
  }

  // --- 设计建议 ---
  function renderDesignTab() {
    const inputArea = $('#caa-input-area');
    if (!inputArea) return;
    inputArea.innerHTML = '';

    inputArea.appendChild(
      createElement('div', { className: 'caa-input-row' }, [
        createElement('textarea', {
          id: 'caa-design-input',
          placeholder: '描述你的设计需求或问题，例如：\n"我做了一张产品促销海报，感觉配色不够吸引人，帮我看看怎么优化"',
          onKeydown: (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              runDesignAdvice();
            }
          },
        }),
        createElement('button', {
          className: 'caa-send-btn',
          textContent: '提问',
          onClick: () => runDesignAdvice(),
          id: 'caa-design-send',
        }),
      ])
    );

    const contentEl = $('#caa-content');
    if (contentEl) {
      contentEl.innerHTML = '';
      contentEl.appendChild(
        createElement('div', { className: 'caa-hint' }, [
          createElement('span', { className: 'caa-hint-icon', textContent: '💡' }),
          createElement('p', { textContent: '描述你的设计问题，AI 会给出排版、配色、布局等方面的专业建议' }),
        ])
      );
    }
  }

  async function runDesignAdvice() {
    const input = $('#caa-design-input');
    const sendBtn = $('#caa-design-send');
    const contentEl = $('#caa-content');
    if (!input || !contentEl) return;

    const question = input.value.trim();
    if (!question) { showToast('请描述你的设计问题'); return; }

    const settings = Storage.defaults();
    const service = settings.primary_design_ai;
    const apiKey = service === 'openai' ? settings.openai_key : settings.anthropic_key;
    const model = service === 'openai' ? settings.openai_model : settings.anthropic_model;

    if (!apiKey) {
      showToast('请先在「设置」中配置 API Key');
      return;
    }

    if (contentEl.querySelector('.caa-hint')) contentEl.innerHTML = '';
    addMessage(question, 'user');
    input.value = '';
    sendBtn.disabled = true;

    const loading = addLoadingIndicator();
    const streamingEl = addStreamingMessage();
    if (loading) loading.style.display = 'none';

    let fullText = '';

    const systemPrompt = `你是一个资深平面设计师和设计顾问，精通海报设计、排版、配色和视觉传达。

你的任务是根据用户的描述，提供专业、具体、可操作的设计建议。

建议方向包括但不限于：
- 配色方案优化（给出具体色值或配色方向）
- 排版布局建议（层次、留白、对齐）
- 字体选择建议
- 视觉焦点和视线引导
- 与目标受众的匹配度

回答要求：
- 具体可操作，不要泛泛而谈
- 给出对比（当前 → 优化后）
- 如果用户描述不清楚，可以追问`;

    streamChat(
      service, apiKey, model,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      (token) => {
        if (loading) { loading.remove(); }
        fullText += token;
        if (streamingEl) streamingEl.innerHTML = renderMarkdown(fullText);
        contentEl.scrollTop = contentEl.scrollHeight;
      },
      () => {
        removeLoadingIndicator(loading);
        if (streamingEl) {
          streamingEl.removeAttribute('id');
          addCopyButton(streamingEl.closest('.caa-message'));
        }
        sendBtn.disabled = false;
      },
      (err) => {
        removeLoadingIndicator(loading);
        if (streamingEl) streamingEl.innerHTML = `<span style="color:var(--caa-danger)">❌ ${err.message}</span>`;
        sendBtn.disabled = false;
      }
    );
  }

  // --- 图片生成 & 智能配图 ---
  function renderImageTab() {
    const inputArea = $('#caa-input-area');
    if (!inputArea) return;
    inputArea.innerHTML = '';

    inputArea.appendChild(
      createElement('div', { className: 'caa-input-options' }, [
        createElement('select', { id: 'caa-image-mode' }, [
          createElement('option', { value: 'generate', textContent: '🎨 AI 生成图片' }),
          createElement('option', { value: 'search', textContent: '🔍 搜索配图 (Unsplash)' }),
        ]),
        createElement('select', { id: 'caa-image-size', style: { display: 'none' } }, [
          createElement('option', { value: '1024x1024', textContent: '1:1 方形' }),
          createElement('option', { value: '1792x1024', textContent: '16:9 横版' }),
          createElement('option', { value: '1024x1792', textContent: '9:16 竖版' }),
        ]),
      ])
    );

    inputArea.appendChild(
      createElement('div', { className: 'caa-input-row' }, [
        createElement('textarea', {
          id: 'caa-image-input',
          placeholder: '描述你需要的图片，例如：\n"一张科技感的蓝色背景图，带有抽象的电路板纹路"',
          onKeydown: (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              runImageAction();
            }
          },
        }),
        createElement('button', {
          className: 'caa-send-btn',
          textContent: '生成',
          onClick: () => runImageAction(),
          id: 'caa-image-send',
        }),
      ])
    );

    // 监听模式切换
    const modeSelect = $('#caa-image-mode');
    const sizeSelect = $('#caa-image-size');
    const sendBtn = $('#caa-image-send');
    if (modeSelect && sizeSelect && sendBtn) {
      modeSelect.addEventListener('change', () => {
        if (modeSelect.value === 'generate') {
          sizeSelect.style.display = '';
          sendBtn.textContent = '生成';
        } else {
          sizeSelect.style.display = 'none';
          sendBtn.textContent = '搜索';
        }
      });
    }

    const contentEl = $('#caa-content');
    if (contentEl) {
      contentEl.innerHTML = '';
      contentEl.appendChild(
        createElement('div', { className: 'caa-hint' }, [
          createElement('span', { className: 'caa-hint-icon', textContent: '🎨' }),
          createElement('p', { textContent: 'AI 生成图片 或 搜索 Unsplash 高质量免费素材' }),
        ])
      );
    }
  }

  async function runImageAction() {
    const input = $('#caa-image-input');
    const modeSelect = $('#caa-image-mode');
    const sizeSelect = $('#caa-image-size');
    const sendBtn = $('#caa-image-send');
    const contentEl = $('#caa-content');
    if (!input || !contentEl) return;

    const prompt = input.value.trim();
    if (!prompt) { showToast('请描述你需要的图片'); return; }

    const mode = modeSelect ? modeSelect.value : 'generate';
    const settings = Storage.defaults();

    if (contentEl.querySelector('.caa-hint')) contentEl.innerHTML = '';
    addMessage(`「${prompt}」`, 'user');
    input.value = '';
    sendBtn.disabled = true;

    const loading = addLoadingIndicator();

    try {
      if (mode === 'generate') {
        // AI 图片生成
        const service = settings.image_service;
        if (service === 'openai' && !settings.openai_key) {
          throw new Error('请先在设置中配置 OpenAI API Key');
        }
        if (service === 'stability' && !settings.stability_key) {
          throw new Error('请先在设置中配置 Stability AI API Key');
        }

        let urls = [];
        if (service === 'openai') {
          const size = sizeSelect ? sizeSelect.value : '1024x1024';
          urls = await generateDalleImage(settings.openai_key, prompt, size);
        } else if (service === 'stability') {
          const [w, h] = (sizeSelect?.value || '1024x1024').split('x').map(Number);
          urls = await generateStabilityImage(settings.stability_key, prompt, w, h);
        }

        loading.remove();
        renderImageResults(urls, 'ai');
      } else {
        // Unsplash 搜索
        if (!settings.unsplash_key) {
          // Unsplash 免费额度不需要 key 也能用（Demo 模式），但有 key 更好
          // 这里先尝试无 key 模式，给出提示
        }

        // 先用 AI 优化搜索关键词
        let searchQuery = prompt;
        if (settings.openai_key || settings.anthropic_key) {
          try {
            searchQuery = await optimizeSearchKeywords(prompt, settings);
          } catch (e) {
            // 优化失败就用原始输入
          }
        }

        const results = await searchUnsplash(settings.unsplash_key || 'demo', searchQuery);
        loading.remove();

        if (results.length === 0) {
          addMessage('未找到相关配图，请尝试更换搜索词', 'ai');
        } else {
          // 显示 AI 优化后的关键词
          if (searchQuery !== prompt) {
            addMessage(`🔍 搜索关键词: "${searchQuery}"`, 'ai');
          }
          renderImageResults(results.map(r => r.url), 'unsplash', results);
        }
      }
    } catch (err) {
      loading.remove();
      addMessage(`❌ ${err.message}`, 'ai');
    } finally {
      sendBtn.disabled = false;
    }
  }

  async function optimizeSearchKeywords(prompt, settings) {
    const service = settings.primary_text_ai;
    const apiKey = service === 'openai' ? settings.openai_key : settings.anthropic_key;
    const model = service === 'openai' ? settings.openai_model : settings.anthropic_model;
    if (!apiKey) return prompt;

    return new Promise((resolve) => {
      let result = '';
      streamChat(
        service, apiKey, model,
        [
          { role: 'system', content: '你是一个图片搜索关键词优化专家。将用户的中文描述转换为最适合在 Unsplash 上搜索的英文关键词（2-5个词）。只输出关键词，不要其他内容。' },
          { role: 'user', content: prompt },
        ],
        (token) => { result += token; },
        () => { resolve(result.trim() || prompt); },
        () => { resolve(prompt); }
      );
    });
  }

  function renderImageResults(urls, type = 'ai', rawData = []) {
    const contentEl = $('#caa-content');
    if (!contentEl) return;

    const grid = createElement('div', { className: 'caa-image-grid' });

    urls.forEach((url, i) => {
      const card = createElement('div', { className: 'caa-image-card' }, [
        createElement('img', { src: url, alt: '生成图片', title: rawData[i]?.description || '',
          onClick: () => window.open(url, '_blank'),
        }),
        createElement('div', { className: 'caa-img-actions' }, [
          createElement('button', {
            textContent: '⬇ 下载',
            onClick: async () => {
              try {
                const resp = await fetch(url);
                const blob = await resp.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `canva-ai-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(a.href);
                showToast('下载中...');
              } catch (e) {
                window.open(url, '_blank');
              }
            },
          }),
          createElement('button', {
            textContent: '🔗 打开',
            onClick: () => window.open(url, '_blank'),
          }),
        ]),
      ]);
      grid.appendChild(card);
    });

    contentEl.appendChild(grid);
    contentEl.scrollTop = contentEl.scrollHeight;
  }

  // --- 设置面板 ---
  function renderSettingsTab() {
    const inputArea = $('#caa-input-area');
    if (inputArea) inputArea.innerHTML = '';

    const contentEl = $('#caa-content');
    if (!contentEl) return;

    const settings = Storage.defaults();
    contentEl.innerHTML = '';

    // OpenAI 配置
    contentEl.appendChild(createSettingsSection('🔵 OpenAI', [
      createSettingsField('API Key', 'caa-setting-openai-key', 'password', settings.openai_key,
        'sk-...'),
      createSettingsField('模型', 'caa-setting-openai-model', 'select', settings.openai_model, null,
        MODELS.openai),
      createElement('button', {
        className: 'caa-test-btn',
        textContent: '🔌 测试连接',
        id: 'caa-test-openai',
        onClick: () => testOpenAI(),
      }),
    ]));

    // Anthropic 配置
    contentEl.appendChild(createSettingsSection('🟣 Anthropic (Claude)', [
      createSettingsField('API Key', 'caa-setting-anthropic-key', 'password', settings.anthropic_key,
        'sk-ant-...'),
      createSettingsField('模型', 'caa-setting-anthropic-model', 'select', settings.anthropic_model, null,
        MODELS.anthropic),
      createElement('button', {
        className: 'caa-test-btn',
        textContent: '🔌 测试连接',
        id: 'caa-test-anthropic',
        onClick: () => testAnthropic(),
      }),
    ]));

    // AI 路由配置
    contentEl.appendChild(createSettingsSection('🔀 AI 路由', [
      createSettingsField('文案生成使用', 'caa-setting-text-ai', 'select', settings.primary_text_ai, null, [
        { id: 'openai', name: 'OpenAI' },
        { id: 'anthropic', name: 'Anthropic Claude' },
      ]),
      createSettingsField('设计建议使用', 'caa-setting-design-ai', 'select', settings.primary_design_ai, null, [
        { id: 'openai', name: 'OpenAI' },
        { id: 'anthropic', name: 'Anthropic Claude' },
      ]),
    ]));

    // 图片生成配置
    contentEl.appendChild(createSettingsSection('🖼 图片生成', [
      createSettingsField('图片服务', 'caa-setting-image-service', 'select', settings.image_service, null, [
        { id: 'openai', name: 'DALL-E 3' },
        { id: 'stability', name: 'Stability AI' },
      ]),
      createSettingsField('Stability AI Key (如使用)', 'caa-setting-stability-key', 'password', settings.stability_key,
        'sk-...'),
    ]));

    // Unsplash 配置
    contentEl.appendChild(createSettingsSection('📷 Unsplash 配图', [
      createSettingsField('Access Key (可选)', 'caa-setting-unsplash-key', 'password', settings.unsplash_key,
        '留空使用 Demo 模式'),
    ]));

    // 保存按钮
    contentEl.appendChild(
      createElement('button', {
        className: 'caa-send-btn',
        textContent: '💾 保存设置',
        style: { width: '100%', marginTop: '12px' },
        onClick: () => saveAllSettings(),
      })
    );

    contentEl.scrollTop = 0;
  }

  function createSettingsSection(title, children) {
    return createElement('div', { className: 'caa-settings-section' }, [
      createElement('h3', { textContent: title }),
      ...children,
    ]);
  }

  function createSettingsField(label, id, type, value, placeholder, options = null) {
    let inputEl;
    if (options) {
      inputEl = createElement('select', { id: id },
        options.map(o => createElement('option', {
          value: o.id,
          textContent: o.name,
          ...(value === o.id ? { selected: 'selected' } : {}),
        }))
      );
    } else {
      inputEl = createElement('input', {
        type: type,
        id: id,
        value: value || '',
        placeholder: placeholder || '',
        ...(type === 'password' ? { autocomplete: 'off' } : {}),
      });
    }

    return createElement('div', { className: 'caa-settings-field' }, [
      createElement('label', { textContent: label }),
      inputEl,
    ]);
  }

  function saveAllSettings() {
    const getVal = (id) => {
      const el = $(`#${id}`);
      return el ? el.value : '';
    };

    Storage.set('openai_key', getVal('caa-setting-openai-key'));
    Storage.set('openai_model', getVal('caa-setting-openai-model'));
    Storage.set('anthropic_key', getVal('caa-setting-anthropic-key'));
    Storage.set('anthropic_model', getVal('caa-setting-anthropic-model'));
    Storage.set('primary_text_ai', getVal('caa-setting-text-ai'));
    Storage.set('primary_design_ai', getVal('caa-setting-design-ai'));
    Storage.set('image_service', getVal('caa-setting-image-service'));
    Storage.set('stability_key', getVal('caa-setting-stability-key'));
    Storage.set('unsplash_key', getVal('caa-setting-unsplash-key'));

    showToast('✅ 设置已保存');

    // 刷新功能 Tab
    renderCurrentTab();
  }

  async function testOpenAI() {
    const btn = $('#caa-test-openai');
    const keyInput = $('#caa-setting-openai-key');
    const apiKey = keyInput ? keyInput.value : Storage.defaults().openai_key;

    if (!apiKey) { showToast('请先输入 API Key'); return; }
    btn.textContent = '⏳ 测试中...';
    btn.className = 'caa-test-btn';

    try {
      await testOpenAIConnection(apiKey);
      btn.textContent = '✅ 连接成功';
      btn.className = 'caa-test-btn caa-test-ok';
    } catch (e) {
      btn.textContent = '❌ ' + e.message;
      btn.className = 'caa-test-btn caa-test-fail';
    }

    setTimeout(() => {
      btn.textContent = '🔌 测试连接';
      btn.className = 'caa-test-btn';
    }, 3000);
  }

  function testOpenAIConnection(apiKey) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: API_ENDPOINTS.openai,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        data: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 5,
        }),
        onload: function (resp) {
          if (resp.status === 200) resolve();
          else {
            try {
              const err = JSON.parse(resp.responseText);
              reject(new Error(err.error?.message || `HTTP ${resp.status}`));
            } catch { reject(new Error(`HTTP ${resp.status}`)); }
          }
        },
        onerror: () => reject(new Error('网络错误')),
        timeout: 15000,
      });
    });
  }

  async function testAnthropic() {
    const btn = $('#caa-test-anthropic');
    const keyInput = $('#caa-setting-anthropic-key');
    const apiKey = keyInput ? keyInput.value : Storage.defaults().anthropic_key;

    if (!apiKey) { showToast('请先输入 API Key'); return; }
    btn.textContent = '⏳ 测试中...';
    btn.className = 'caa-test-btn';

    try {
      await testAnthropicConnection(apiKey);
      btn.textContent = '✅ 连接成功';
      btn.className = 'caa-test-btn caa-test-ok';
    } catch (e) {
      btn.textContent = '❌ ' + e.message;
      btn.className = 'caa-test-btn caa-test-fail';
    }

    setTimeout(() => {
      btn.textContent = '🔌 测试连接';
      btn.className = 'caa-test-btn';
    }, 3000);
  }

  function testAnthropicConnection(apiKey) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: API_ENDPOINTS.anthropic,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        data: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'hi' }],
        }),
        onload: function (resp) {
          if (resp.status === 200) resolve();
          else {
            try {
              const err = JSON.parse(resp.responseText);
              reject(new Error(err.error?.message || `HTTP ${resp.status}`));
            } catch { reject(new Error(`HTTP ${resp.status}`)); }
          }
        },
        onerror: () => reject(new Error('网络错误')),
        timeout: 15000,
      });
    });
  }

  // ==================== Tab 切换 & 面板控制 ====================

  let currentTab = 'copy';

  function switchTab(tabId) {
    currentTab = tabId;

    // 更新 Tab 激活状态
    $$('.caa-tab').forEach(t => {
      t.classList.toggle('caa-active', t.dataset.tab === tabId);
    });

    // 渲染对应的内容
    renderCurrentTab();
  }

  function renderCurrentTab() {
    switch (currentTab) {
      case 'copy': renderCopyTab(); break;
      case 'design': renderDesignTab(); break;
      case 'image': renderImageTab(); break;
      case 'settings': renderSettingsTab(); break;
    }
  }

  function clearCurrentChat() {
    const contentEl = $('#caa-content');
    if (contentEl) {
      contentEl.innerHTML = '';
      renderCurrentTab();
    }
    showToast('对话已清空');
  }

  function togglePanel(show) {
    const panel = $('#caa-panel');
    const toggleBtn = $('#caa-toggle-btn');
    if (!panel) return;

    if (show === undefined) {
      show = panel.classList.contains('caa-collapsed');
    }

    if (show) {
      panel.classList.remove('caa-collapsed');
      if (toggleBtn) toggleBtn.classList.add('caa-hidden');
    } else {
      panel.classList.add('caa-collapsed');
      if (toggleBtn) toggleBtn.classList.remove('caa-hidden');
    }
  }

  // ==================== 初始化 ====================
  function init() {
    // 避免重复注入
    if ($('#caa-panel')) return;

    console.log('[CAA] init() 开始创建面板...');

    // 创建面板
    const panel = createPanel();
    document.body.appendChild(panel);

    // 创建触发按钮
    const toggleBtn = createElement('button', {
      id: 'caa-toggle-btn',
      className: 'caa-hidden',
      textContent: 'AI',
      onClick: () => togglePanel(true),
    });
    document.body.appendChild(toggleBtn);

    // 默认打开面板
    togglePanel(true);

    // 初始化第一个 Tab
    switchTab('copy');

    // 键盘快捷键: Ctrl+Shift+A 切换面板
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        togglePanel();
      }
    });

    // 注册 Tampermonkey 菜单命令
    GM_registerMenuCommand('切换 AI 面板 (显示/隐藏)', () => togglePanel());
    GM_registerMenuCommand('清空当前对话', () => clearCurrentChat());

    console.log('[CAA] ✅ init() 完成，面板已创建');
  }

  // ==================== SPA 路由监听 ====================
  // 可画是 SPA，页面切换不会触发页面刷新，需要监听 DOM 变化确保面板始终存在
  let initCheckTimer = null;

  function ensurePanelExists() {
    if (!$('#caa-panel') && document.body) {
      console.log('[CAA] 🔄 检测到面板缺失，重新创建...');
      init();
    }
  }

  // 启动定时检查（必须在 init() 之前声明）
  function startCheckTimer(interval) {
    if (initCheckTimer) clearInterval(initCheckTimer);
    initCheckTimer = setInterval(ensurePanelExists, interval);
  }

  // 初始加载 & 启动定时器
  if (document.body) {
    init();
    startCheckTimer(2000);
  } else {
    const bodyObserver = new MutationObserver(() => {
      if (document.body) {
        bodyObserver.disconnect();
        init();
        startCheckTimer(2000);
      }
    });
    bodyObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  // 页面隐藏时降低检查频率，恢复时立即检查
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      startCheckTimer(10000);
    } else {
      startCheckTimer(2000);
      ensurePanelExists(); // 恢复时立即检查一次
    }
  });

})();
