// ==UserScript==
// @name         可画 AI 设计助手
// @namespace    https://github.com/xiaowang4588/canva_helper-script
// @version      1.0.2
// @description  为可画(Canva)网页端注入 AI 辅助面板：文案生成、设计建议、AI 图片生成、智能配图。🚀 自动从 GitHub CDN 拉取最新代码，安装一次永久更新。
// @author       xiaowang4588
// @license      MIT
// @homepage     https://github.com/xiaowang4588/canva_helper-script
// @supportURL   https://github.com/xiaowang4588/canva_helper-script/issues
// @match        https://www.canva.cn/*
// @match        https://www.canva.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @connect      cdn.jsdelivr.net
// @connect      fastly.jsdelivr.net
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      api.stability.ai
// @connect      api.unsplash.com
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ==================== 去重 ====================
  const LOADER_KEY = '__CAA_LOADER_V2__';
  const LOADED_KEY = '__CAA_LOADED_V2__';

  // 每次页面会话只跑一次
  if (window[LOADER_KEY]) return;
  window[LOADER_KEY] = Date.now();

  // 如果完整代码已加载（SPA 导航后可能已有），跳过
  if (window[LOADED_KEY]) {
    console.log('[CAA] 代码已加载，跳过');
    return;
  }

  // ==================== CDN 地址 ====================
  // 主: GitHub Raw (可靠、不重定向)
  const MAIN_URL = 'https://raw.githubusercontent.com/xiaowang4588/canva_helper-script/master/dist/canva-ai-assistant.js';
  // 备用: jsDelivr CDN (国内可能更快，但有时会重定向)
  const FALLBACK_URL = 'https://cdn.jsdelivr.net/gh/xiaowang4588/canva_helper-script@master/dist/canva-ai-assistant.js';

  console.log('[CAA] 🚀 加载器启动 v1.0.1');
  console.log('[CAA] 主地址: GitHub Raw');

  // ==================== 加载并执行 ====================
  let resolved = false;

  function loadFrom(url, label) {
    console.log('[CAA] 尝试从 ' + label + ' 加载...');
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      timeout: 15000,
      onload: function (resp) {
        if (resolved) return;
        const text = (resp.responseText || resp.response || '').trim();
        console.log('[CAA] ' + label + ' 响应: status=' + resp.status + ', 长度=' + text.length);

        if (resp.status >= 200 && resp.status < 300 && text.length > 100) {
          resolved = true;
          try {
            // 在 Tampermonkey 沙箱中执行，GM_* 全部可用
            eval(text);
            console.log('[CAA] ✅ 加载成功! (' + label + ')');
            window[LOADED_KEY] = true;
          } catch (e) {
            console.error('[CAA] ❌ eval 执行失败:', e.message);
            console.error('[CAA] 堆栈:', e.stack);
            showErrorBanner('代码执行失败: ' + e.message);
          }
        } else {
          console.warn('[CAA] ⚠️ ' + label + ' 返回异常, status=' + resp.status + ', len=' + text.length);
        }
      },
      onerror: function (err) {
        console.warn('[CAA] ⚠️ ' + label + ' 网络错误:', err);
      },
      ontimeout: function () {
        console.warn('[CAA] ⚠️ ' + label + ' 超时');
      },
    });
  }

  // 主地址 + 备用地址 竞速加载
  loadFrom(MAIN_URL, 'GitHub Raw');

  // 1.5 秒后如果主地址还没返回，启动备用
  setTimeout(function () {
    if (!resolved) {
      console.log('[CAA] 主地址 1.5s 未响应，启动备用 CDN...');
      loadFrom(FALLBACK_URL, 'jsDelivr');
    }
  }, 1500);

  // ==================== 错误提示横幅 ====================
  function showErrorBanner(msg) {
    if (document.body) {
      const banner = document.createElement('div');
      banner.id = 'caa-error-banner';
      banner.style.cssText = [
        'position:fixed;top:0;left:0;right:0;z-index:2147483647;',
        'background:#ff4444;color:#fff;padding:12px 16px;',
        'font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;',
        'text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.3);',
        'cursor:pointer;',
      ].join('');
      banner.textContent = '⚠️ 可画 AI 助手加载失败: ' + msg + ' — 点击重试';
      banner.onclick = function () {
        banner.remove();
        resolved = false;
        window[LOADER_KEY] = undefined;
        window[LOADER_KEY] = Date.now();
        loadFrom(MAIN_URL, 'GitHub Raw(重试)');
        setTimeout(function () {
          if (!resolved) loadFrom(FALLBACK_URL, 'jsDelivr(重试)');
        }, 1500);
      };
      document.body.appendChild(banner);
    }
  }

})();
