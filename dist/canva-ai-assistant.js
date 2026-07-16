(function () {
  'use strict';

  // 防止重复加载（SPA 页面切换时）
  if (window.__CAA_LOADED_V2__) return;
  window.__CAA_LOADED_V2__ = true;
  console.log('[CAA] 完整代码开始执行...');

  // ==================== CSS 样式 ====================
  GM_addStyle(`
    /* ========== CSS 变量 ========== */
    :root {
      --caa-bg: #ffffff;
      --caa-bg-secondary: #f8f9fb;
      --caa-bg-tertiary: #f0f1f5;
      --caa-text: #1e1e2e;
      --caa-text-secondary: #8b8fa3;
      --caa-text-muted: #b0b5c6;
      --caa-accent: #6366f1;
      --caa-accent-hover: #4f46e5;
      --caa-accent-light: rgba(99, 102, 241, 0.08);
      --caa-accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
      --caa-border: #e5e7eb;
      --caa-border-light: #f0f1f5;
      --caa-danger: #ef4444;
      --caa-danger-light: #fef2f2;
      --caa-success: #10b981;
      --caa-success-light: #ecfdf5;
      --caa-warning: #f59e0b;
      --caa-radius: 12px;
      --caa-radius-sm: 8px;
      --caa-radius-xs: 6px;
      --caa-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
      --caa-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03);
      --caa-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
      --caa-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', Roboto, 'Noto Sans SC', sans-serif;
      --caa-font-mono: 'SF Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
    }

    /* ========== 触发按钮 ========== */
    #caa-toggle-btn {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 99998;
      width: 34px;
      height: 72px;
      background: var(--caa-accent-gradient);
      border: none;
      border-radius: 10px 0 0 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      writing-mode: vertical-lr;
      letter-spacing: 3px;
      box-shadow: -2px 0 16px rgba(99, 102, 241, 0.25);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
    }
    #caa-toggle-btn:hover {
      width: 40px;
      box-shadow: -4px 0 24px rgba(99, 102, 241, 0.4);
      transform: translateY(-50%) scale(1.02);
    }
    #caa-toggle-btn.caa-hidden {
      right: -50px;
      opacity: 0;
      pointer-events: none;
    }

    /* ========== 主面板 ========== */
    #caa-panel {
      position: fixed;
      top: 8px;
      right: 8px;
      width: 400px;
      height: calc(100vh - 16px);
      z-index: 99999;
      background: var(--caa-bg);
      border: 1px solid var(--caa-border);
      border-radius: 16px;
      box-shadow: var(--caa-shadow-lg);
      display: flex;
      flex-direction: column;
      font-family: var(--caa-font);
      color: var(--caa-text);
      transform: translateX(0);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
      overflow: hidden;
    }
    #caa-panel.caa-collapsed {
      transform: translateX(calc(100% + 16px));
      opacity: 0;
      pointer-events: none;
    }

    /* ========== 面板头部 ========== */
    .caa-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: var(--caa-bg);
      border-bottom: 1px solid var(--caa-border-light);
      flex-shrink: 0;
    }
    .caa-header-title {
      font-size: 15px;
      font-weight: 650;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--caa-text);
      letter-spacing: -0.01em;
    }
    .caa-header-actions {
      display: flex;
      gap: 4px;
    }
    .caa-header-actions button {
      background: none;
      border: none;
      color: var(--caa-text-secondary);
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: var(--caa-radius-xs);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      transition: all 0.2s;
    }
    .caa-header-actions button:hover {
      background: var(--caa-bg-tertiary);
      color: var(--caa-text);
    }

    /* ========== Tab 栏 ========== */
    .caa-tabs {
      display: flex;
      background: var(--caa-bg);
      border-bottom: 1px solid var(--caa-border-light);
      flex-shrink: 0;
      padding: 0 10px;
      gap: 2px;
    }
    .caa-tab {
      flex: 1;
      padding: 12px 6px 10px;
      background: none;
      border: none;
      color: var(--caa-text-secondary);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      font-family: var(--caa-font);
      transition: all 0.2s;
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-radius: var(--caa-radius-sm) var(--caa-radius-sm) 0 0;
      position: relative;
    }
    .caa-tab:hover {
      color: var(--caa-text);
      background: var(--caa-accent-light);
    }
    .caa-tab.caa-active {
      color: var(--caa-accent);
      font-weight: 600;
    }
    .caa-tab.caa-active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 20%;
      right: 20%;
      height: 2.5px;
      background: var(--caa-accent-gradient);
      border-radius: 3px;
    }
    .caa-tab-icon {
      font-size: 17px;
      line-height: 1;
    }

    /* ========== 内容区 ========== */
    .caa-content {
      flex: 1;
      overflow-y: auto;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: linear-gradient(180deg, #fafbfc 0%, var(--caa-bg) 30%);
    }
    .caa-content::-webkit-scrollbar {
      width: 4px;
    }
    .caa-content::-webkit-scrollbar-track {
      background: transparent;
      margin: 8px 0;
    }
    .caa-content::-webkit-scrollbar-thumb {
      background: var(--caa-border);
      border-radius: 10px;
    }
    .caa-content::-webkit-scrollbar-thumb:hover {
      background: #c4c7d0;
    }

    /* ========== 消息气泡 ========== */
    .caa-message {
      display: flex;
      flex-direction: column;
      gap: 2px;
      animation: caa-fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes caa-fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .caa-message-user {
      align-items: flex-end;
    }
    .caa-message-ai {
      align-items: flex-start;
    }
    .caa-msg-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--caa-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 1px;
    }
    .caa-msg-bubble {
      max-width: 88%;
      padding: 11px 15px;
      border-radius: var(--caa-radius);
      font-size: 13.5px;
      line-height: 1.6;
      word-break: break-word;
    }
    .caa-message-user .caa-msg-bubble {
      background: var(--caa-accent-gradient);
      color: #fff;
      border-bottom-right-radius: var(--caa-radius-xs);
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
    }
    .caa-message-ai .caa-msg-bubble {
      background: var(--caa-bg);
      border: 1px solid var(--caa-border);
      border-bottom-left-radius: var(--caa-radius-xs);
      box-shadow: var(--caa-shadow-sm);
    }
    .caa-msg-bubble p { margin: 0 0 6px 0; }
    .caa-msg-bubble p:last-child { margin: 0; }
    .caa-msg-bubble ul, .caa-msg-bubble ol { margin: 6px 0; padding-left: 20px; }
    .caa-msg-bubble li { margin: 3px 0; }
    .caa-msg-bubble strong { color: var(--caa-accent); font-weight: 650; }
    .caa-msg-bubble code {
      background: var(--caa-bg-tertiary);
      color: var(--caa-accent-hover);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: var(--caa-font-mono);
      font-size: 12px;
      font-weight: 500;
    }
    .caa-msg-bubble pre {
      background: #f1f5f9;
      padding: 12px;
      border-radius: var(--caa-radius-sm);
      overflow-x: auto;
      font-family: var(--caa-font-mono);
      font-size: 12px;
      border: 1px solid var(--caa-border-light);
    }

    /* ========== 复制按钮 ========== */
    .caa-copy-btn {
      background: var(--caa-bg);
      border: 1px solid var(--caa-border);
      color: var(--caa-text-secondary);
      padding: 5px 12px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      font-family: var(--caa-font);
      transition: all 0.2s;
      margin-top: 4px;
      align-self: flex-start;
    }
    .caa-copy-btn:hover {
      border-color: var(--caa-accent);
      color: var(--caa-accent);
      background: var(--caa-accent-light);
    }
    .caa-copy-btn.caa-copied {
      background: var(--caa-success-light);
      border-color: var(--caa-success);
      color: var(--caa-success);
    }

    /* ========== 输入区 ========== */
    .caa-input-area {
      padding: 12px 16px 14px;
      border-top: 1px solid var(--caa-border-light);
      background: var(--caa-bg);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .caa-input-row {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    .caa-input-row textarea {
      flex: 1;
      background: var(--caa-bg-secondary);
      border: 1.5px solid var(--caa-border);
      border-radius: var(--caa-radius-sm);
      color: var(--caa-text);
      padding: 10px 14px;
      font-family: var(--caa-font);
      font-size: 13.5px;
      line-height: 1.5;
      resize: none;
      min-height: 52px;
      max-height: 140px;
      outline: none;
      transition: all 0.2s ease;
    }
    .caa-input-row textarea:focus {
      border-color: var(--caa-accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      background: var(--caa-bg);
    }
    .caa-input-row textarea::placeholder {
      color: var(--caa-text-muted);
    }
    .caa-send-btn {
      align-self: flex-end;
      background: var(--caa-accent-gradient);
      border: none;
      color: #fff;
      padding: 10px 20px;
      border-radius: var(--caa-radius-sm);
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      font-family: var(--caa-font);
      transition: all 0.25s ease;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
      letter-spacing: 0.01em;
    }
    .caa-send-btn:hover {
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
      transform: translateY(-1px);
    }
    .caa-send-btn:active {
      transform: translateY(0);
      box-shadow: 0 1px 4px rgba(99, 102, 241, 0.2);
    }
    .caa-send-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .caa-input-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .caa-input-options select,
    .caa-input-options button {
      background: var(--caa-bg-secondary);
      border: 1px solid var(--caa-border);
      color: var(--caa-text);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-family: var(--caa-font);
      font-weight: 500;
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
    }
    .caa-input-options select:hover {
      border-color: var(--caa-accent);
      background: var(--caa-accent-light);
    }
    .caa-input-options select:focus {
      border-color: var(--caa-accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    /* ========== 设置面板 ========== */
    .caa-settings-section {
      margin-bottom: 18px;
      background: var(--caa-bg-secondary);
      border: 1px solid var(--caa-border-light);
      border-radius: var(--caa-radius);
      padding: 16px;
      transition: border-color 0.2s;
    }
    .caa-settings-section:hover {
      border-color: var(--caa-border);
    }
    .caa-settings-section h3 {
      font-size: 13px;
      font-weight: 650;
      margin: 0 0 12px 0;
      color: var(--caa-text);
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: -0.01em;
    }
    .caa-settings-field {
      margin-bottom: 10px;
    }
    .caa-settings-field:last-child { margin-bottom: 0; }
    .caa-settings-field label {
      display: block;
      font-size: 11.5px;
      font-weight: 550;
      color: var(--caa-text-secondary);
      margin-bottom: 5px;
    }
    .caa-settings-field input,
    .caa-settings-field select {
      width: 100%;
      box-sizing: border-box;
      background: var(--caa-bg);
      border: 1.5px solid var(--caa-border);
      border-radius: var(--caa-radius-xs);
      color: var(--caa-text);
      padding: 9px 12px;
      font-size: 13px;
      font-family: var(--caa-font-mono);
      outline: none;
      transition: all 0.2s;
    }
    .caa-settings-field input:focus,
    .caa-settings-field select:focus {
      border-color: var(--caa-accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
    }
    .caa-settings-field input::placeholder {
      color: var(--caa-text-muted);
      font-family: var(--caa-font);
      font-size: 12px;
    }
    .caa-test-btn {
      background: var(--caa-bg);
      border: 1.5px solid var(--caa-border);
      color: var(--caa-text-secondary);
      padding: 7px 14px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 11.5px;
      font-weight: 550;
      font-family: var(--caa-font);
      transition: all 0.2s;
      margin-top: 4px;
    }
    .caa-test-btn:hover {
      border-color: var(--caa-accent);
      color: var(--caa-accent);
      background: var(--caa-accent-light);
    }
    .caa-test-btn.caa-test-ok {
      border-color: var(--caa-success);
      color: var(--caa-success);
      background: var(--caa-success-light);
    }
    .caa-test-btn.caa-test-fail {
      border-color: var(--caa-danger);
      color: var(--caa-danger);
      background: var(--caa-danger-light);
    }

    /* ========== 图片网格 ========== */
    .caa-image-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .caa-image-card {
      background: var(--caa-bg);
      border: 1px solid var(--caa-border-light);
      border-radius: var(--caa-radius-sm);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: var(--caa-shadow-sm);
    }
    .caa-image-card:hover {
      border-color: var(--caa-accent);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.12);
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
      padding: 8px;
    }
    .caa-image-card .caa-img-actions button {
      flex: 1;
      background: var(--caa-bg-secondary);
      border: 1px solid var(--caa-border-light);
      color: var(--caa-text-secondary);
      padding: 6px 8px;
      border-radius: var(--caa-radius-xs);
      cursor: pointer;
      font-size: 10.5px;
      font-weight: 550;
      font-family: var(--caa-font);
      transition: all 0.2s;
    }
    .caa-image-card .caa-img-actions button:hover {
      background: var(--caa-accent);
      color: #fff;
      border-color: var(--caa-accent);
    }

    /* ========== 加载动画 ========== */
    .caa-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      color: var(--caa-text-secondary);
      font-size: 12.5px;
      font-weight: 500;
    }
    .caa-loading-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .caa-loading-dots span {
      width: 6px;
      height: 6px;
      background: var(--caa-accent);
      border-radius: 50%;
      animation: caa-dot 1.4s infinite ease-in-out;
    }
    .caa-loading-dots span:nth-child(2) { animation-delay: 0.16s; }
    .caa-loading-dots span:nth-child(3) { animation-delay: 0.32s; }
    @keyframes caa-dot {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.7); }
      40% { opacity: 1; transform: scale(1); }
    }

    /* ========== 提示信息 ========== */
    .caa-hint {
      text-align: center;
      color: var(--caa-text-muted);
      font-size: 13px;
      padding: 36px 24px;
      line-height: 1.7;
    }
    .caa-hint-icon {
      font-size: 44px;
      display: block;
      margin-bottom: 14px;
      opacity: 0.8;
    }

    /* ========== Toast ========== */
    .caa-toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e1e2e;
      color: #fff;
      padding: 10px 22px;
      border-radius: 24px;
      font-size: 13px;
      font-weight: 500;
      font-family: var(--caa-font);
      z-index: 100000;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      animation: caa-toastIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      letter-spacing: 0.01em;
    }
    @keyframes caa-toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(16px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ========== 响应式 ========== */
    @media (max-width: 600px) {
      #caa-panel {
        width: 100vw;
        top: 0;
        right: 0;
        height: 100vh;
        border-radius: 0;
      }
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
        // 服务器模式
        use_server: this.get('use_server', false),
        server_url: this.get('server_url', ''),
        server_token: this.get('server_token', ''),
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

  // ==================== 服务器模式 API 调用 ====================
  // 当用户在设置中配置了服务器 URL 和 Token 时，走服务器中转。
  // 优点：API Key 在服务端，更安全；有额度控制；国内网络优化。

  /**
   * 服务器流式聊天
   * 用 GM_xmlhttpRequest 调用用户自己的服务器 /api/chat 端点，
   * 服务器再转发到 AI（通过 one-api 等中转）
   */
  function streamServerChat(serverUrl, serverToken, model, messages, onToken, onDone, onError) {
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
          // 服务器返回的是 OpenAI 兼容的 SSE 格式
          const content = ev.payload.choices?.[0]?.delta?.content;
          if (content) onToken(content);

          // 服务器返回的错误
          if (ev.payload.error) {
            onError(new Error(ev.payload.error.message || '服务器错误'));
            calledDone = true;
          }
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

    const url = serverUrl.replace(/\/+$/, '') + '/api/chat';

    console.log('[CAA] 🌐 服务器模式: ' + url);

    GM_xmlhttpRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + serverToken,
      },
      data: JSON.stringify({
        model: model,
        messages: messages,
        feature: 'chat',
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

        // 检查 HTTP 错误
        if (resp.status >= 400) {
          finish();
          if (resp.status === 401) {
            onError(new Error('服务器认证失败，请检查 Token'));
          } else if (resp.status === 429) {
            // 解读服务器的额度耗尽或限流响应
            try {
              const errBody = JSON.parse(text);
              onError(new Error(errBody.message || '额度已用完或请求太频繁'));
            } catch (_) {
              onError(new Error('请求被限制 (HTTP ' + resp.status + ')'));
            }
          } else {
            onError(new Error('服务器返回错误 (HTTP ' + resp.status + ')'));
          }
          return;
        }

        finish();
      },
      onerror: function (err) {
        finish();
        onError(new Error('无法连接到服务器，请检查服务器地址'));
      },
      ontimeout: function () {
        finish();
        onError(new Error('服务器响应超时'));
      },
      timeout: 120000,
    });
  }

  /**
   * 服务器图片生成
   * 非流式调用 /api/image，返回 JSON { urls: [...] }
   */
  function generateServerImage(serverUrl, serverToken, prompt, size) {
    const url = serverUrl.replace(/\/+$/, '') + '/api/image';

    console.log('[CAA] 🌐 服务器图片: ' + url);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + serverToken,
        },
        data: JSON.stringify({
          prompt: prompt,
          size: size || '1024x1024',
        }),
        onload: function (resp) {
          try {
            const data = JSON.parse(resp.responseText);
            if (resp.status >= 400) {
              reject(new Error(data.message || data.error || '图片生成失败 (HTTP ' + resp.status + ')'));
            } else if (data.urls && data.urls.length > 0) {
              resolve(data.urls);
            } else {
              reject(new Error('服务器未返回图片'));
            }
          } catch (_) {
            reject(new Error('服务器返回格式错误 (HTTP ' + resp.status + ')'));
          }
        },
        onerror: function () {
          reject(new Error('无法连接到服务器'));
        },
        timeout: 60000,
      });
    });
  }

  /**
   * 查询服务器上的剩余额度
   * GET /api/user/quota
   */
  function fetchServerQuota(serverUrl, serverToken) {
    const url = serverUrl.replace(/\/+$/, '') + '/api/user/quota';

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Bearer ' + serverToken,
        },
        onload: function (resp) {
          try {
            const data = JSON.parse(resp.responseText);
            resolve(data);
          } catch (_) {
            reject(new Error('无法解析额度信息'));
          }
        },
        onerror: function () {
          reject(new Error('无法连接到服务器'));
        },
        timeout: 10000,
      });
    });
  }

  // ==================== 统一的流式聊天调用 ====================
  /**
   * 统一流式聊天入口
   *
   * @param {string} service - 'openai' | 'anthropic' | 'server'
   * @param {string} apiKey   - 直连模式的 API Key；服务器模式时为 serverToken
   * @param {string} model    - 模型 ID
   * @param {Array}  messages - 消息数组
   * @param {string} [serverUrl] - 服务器地址（仅 server 模式需要）
   */
  function streamChat(service, apiKey, model, messages, onToken, onDone, onError, serverUrl) {
    if (service === 'openai') {
      streamOpenAIChat(apiKey, model, messages, onToken, onDone, onError);
    } else if (service === 'anthropic') {
      streamClaudeChat(apiKey, model, messages, onToken, onDone, onError);
    } else if (service === 'server') {
      streamServerChat(serverUrl, apiKey, model, messages, onToken, onDone, onError);
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
        createElement('span', {
          style: { width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', flexShrink: '0' },
          innerHTML: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="display:block"><path d="M469.3 42.7v42.6H298.7a128 128 0 0 0-128 128v128a213.3 213.3 0 0 0 213.3 213.4h256a213.3 213.3 0 0 0 213.4-213.4V213.3a128 128 0 0 0-128-128H554.7V42.7h-85.4zM256 213.3a42.7 42.7 0 0 1 42.7-42.6h426.6a42.7 42.7 0 0 1 42.7 42.6v128a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128v-128zm149.3 170.7a64 64 0 1 0 0-128 64 64 0 0 0 0 128zm213.4 0a64 64 0 1 0 0-128 64 64 0 0 0 0 128zM256 938.7a256 256 0 0 1 512 0h85.3a341.3 341.3 0 1 0-682.6 0h85.3z" fill="currentColor"/></svg>'
        }),
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
    // 检测服务器模式
    const useServer = settings.use_server && settings.server_url && settings.server_token;

    let service, apiKey, model;

    if (useServer) {
      service = 'server';
      apiKey = settings.server_token;
      model = 'gpt-4o'; // 服务器端 one-api 统一管理模型
    } else {
      service = settings.primary_text_ai;
      apiKey = service === 'openai' ? settings.openai_key : settings.anthropic_key;
      model = service === 'openai' ? settings.openai_model : settings.anthropic_model;

      if (!apiKey) {
        showToast('请先在「设置」中配置 API Key 或启用服务器模式');
        return;
      }
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
      },
      useServer ? settings.server_url : undefined
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
    const useServer = settings.use_server && settings.server_url && settings.server_token;

    let service, apiKey, model;

    if (useServer) {
      service = 'server';
      apiKey = settings.server_token;
      model = 'gpt-4o';
    } else {
      service = settings.primary_design_ai;
      apiKey = service === 'openai' ? settings.openai_key : settings.anthropic_key;
      model = service === 'openai' ? settings.openai_model : settings.anthropic_model;

      if (!apiKey) {
        showToast('请先在「设置」中配置 API Key 或启用服务器模式');
        return;
      }
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
      },
      useServer ? settings.server_url : undefined
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
        // 检测服务器模式
        const useServer = settings.use_server && settings.server_url && settings.server_token;

        let urls = [];
        if (useServer) {
          // 服务器模式：由服务器中转调用 DALL-E
          const size = sizeSelect ? sizeSelect.value : '1024x1024';
          urls = await generateServerImage(settings.server_url, settings.server_token, prompt, size);
        } else {
          // 直连模式
          const service = settings.image_service;
          if (service === 'openai' && !settings.openai_key) {
            throw new Error('请先在设置中配置 OpenAI API Key 或启用服务器模式');
          }
          if (service === 'stability' && !settings.stability_key) {
            throw new Error('请先在设置中配置 Stability AI API Key 或启用服务器模式');
          }

          if (service === 'openai') {
            const size = sizeSelect ? sizeSelect.value : '1024x1024';
            urls = await generateDalleImage(settings.openai_key, prompt, size);
          } else if (service === 'stability') {
            const [w, h] = (sizeSelect?.value || '1024x1024').split('x').map(Number);
            urls = await generateStabilityImage(settings.stability_key, prompt, w, h);
          }
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

    // ---- 服务器模式（推荐） ----
    contentEl.appendChild(createSettingsSection('🌐 服务器模式 (推荐)', [
      createElement('div', { className: 'caa-settings-field' }, [
        createElement('label', { textContent: '启用服务器中转' }),
        createElement('select', { id: 'caa-setting-use-server' }, [
          createElement('option', { value: '0', textContent: '❌ 直连模式（自己配 Key）',
            ...(settings.use_server ? {} : { selected: 'selected' }) }),
          createElement('option', { value: '1', textContent: '✅ 服务器模式（API Key 在服务端，更安全）',
            ...(settings.use_server ? { selected: 'selected' } : {}) }),
        ]),
      ]),
      createSettingsField('服务器地址', 'caa-setting-server-url', 'text', settings.server_url,
        'https://your-server.com'),
      createSettingsField('用户 Token', 'caa-setting-server-token', 'password', settings.server_token,
        '从管理员处获取'),
      createElement('button', {
        className: 'caa-test-btn',
        textContent: '🔌 测试连接 & 查额度',
        id: 'caa-test-server',
        onClick: () => testServerConnection(),
      }),
      createElement('div', {
        id: 'caa-server-quota-info',
        style: { fontSize: '12px', color: 'var(--caa-text-secondary)', marginTop: '6px', display: 'none' },
      }),
    ]));

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
    // 服务器模式
    Storage.set('use_server', getVal('caa-setting-use-server') === '1');
    Storage.set('server_url', getVal('caa-setting-server-url'));
    Storage.set('server_token', getVal('caa-setting-server-token'));

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

  /**
   * 测试服务器连接 & 显示剩余额度
   */
  async function testServerConnection() {
    const btn = $('#caa-test-server');
    const quotaInfo = $('#caa-server-quota-info');
    const urlInput = $('#caa-setting-server-url');
    const tokenInput = $('#caa-setting-server-token');

    const serverUrl = urlInput ? urlInput.value.trim() : Storage.defaults().server_url;
    const serverToken = tokenInput ? tokenInput.value.trim() : Storage.defaults().server_token;

    if (!serverUrl || !serverToken) { showToast('请先填写服务器地址和 Token'); return; }

    btn.textContent = '⏳ 测试中...';
    btn.className = 'caa-test-btn';

    try {
      const quota = await fetchServerQuota(serverUrl, serverToken);
      btn.textContent = '✅ 连接成功';
      btn.className = 'caa-test-btn caa-test-ok';

      if (quotaInfo) {
        quotaInfo.style.display = 'block';
        quotaInfo.innerHTML = `
          📊 免费额度: ${quota.quota_daily_remaining || '?'}/${quota.quota_daily_total || '?'} 次/天
          | 🌟 充值额度: ${quota.quota_extra_remaining || 0} 次
          | 🕐 每日 ${quota.reset_at || '00:00'} 重置
        `;
      }
    } catch (e) {
      btn.textContent = '❌ ' + e.message;
      btn.className = 'caa-test-btn caa-test-fail';
      if (quotaInfo) quotaInfo.style.display = 'none';
    }

    setTimeout(() => {
      btn.textContent = '🔌 测试连接 & 查额度';
      btn.className = 'caa-test-btn';
    }, 5000);
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
