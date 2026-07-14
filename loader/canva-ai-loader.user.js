// ==UserScript==
// @name         可画 AI 设计助手
// @namespace    https://github.com/xiaowang4588/canva_helper-script
// @version      1.0.1
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
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      api.stability.ai
// @connect      api.unsplash.com
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // 防止页面内重复加载
  if (window.__CAA_LOADER_RUN__) return;
  window.__CAA_LOADER_RUN__ = true;

  const CDN_URL = 'https://cdn.jsdelivr.net/gh/xiaowang4588/canva_helper-script@main/dist/canva-ai-assistant.js';
  const FALLBACK_URL = 'https://raw.githubusercontent.com/xiaowang4588/canva_helper-script/main/dist/canva-ai-assistant.js';

  // 检查是否已注入完整代码
  if (window.__CAA_LOADED__) return;

  console.log('[可画AI助手] 🚀 正在从 CDN 加载最新代码...');

  GM_xmlhttpRequest({
    method: 'GET',
    url: CDN_URL,
    timeout: 10000,
    onload: function (resp) {
      if (resp.status === 200 && resp.responseText) {
        try {
          eval(resp.responseText);
          console.log('[可画AI助手] ✅ 加载成功');
        } catch (e) {
          console.error('[可画AI助手] ❌ 代码执行失败:', e);
          tryFallback();
        }
      } else {
        console.warn('[可画AI助手] ⚠️ CDN 返回异常，尝试备用地址...');
        tryFallback();
      }
    },
    onerror: function () {
      console.warn('[可画AI助手] ⚠️ CDN 连接失败，尝试备用地址...');
      tryFallback();
    },
    ontimeout: function () {
      console.warn('[可画AI助手] ⚠️ CDN 超时，尝试备用地址...');
      tryFallback();
    },
  });

  function tryFallback() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: FALLBACK_URL,
      timeout: 10000,
      onload: function (resp) {
        if (resp.status === 200 && resp.responseText) {
          try {
            eval(resp.responseText);
            console.log('[可画AI助手] ✅ 从备用地址加载成功');
          } catch (e) {
            console.error('[可画AI助手] ❌ 备用地址也失败了:', e);
          }
        } else {
          console.error('[可画AI助手] ❌ 所有加载方式均失败，请检查网络或访问 GitHub 获取帮助');
        }
      },
      onerror: function () {
        console.error('[可画AI助手] ❌ 所有加载方式均失败');
      },
    });
  }

})();
