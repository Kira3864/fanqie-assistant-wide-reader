// ==UserScript==
// @name         番茄小说助手
// @namespace    https://github.com/naiyQAQ/fanqie-assistant
// @version      0.0.3
// @author       naiyQAQ
// @description  番茄小说助手，去广告、去推广、解锁章节、优化体验。
// @license      GPLv3
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNMjMuMzExNSAxSDYuNjg4NTNDMy41NDY4NCAxIDEgMy41NDY4NCAxIDYuNjg4NTNWMjMuMzExNUMxIDI2LjQ1MzIgMy41NDY4NCAyOSA2LjY4ODUzIDI5SDIzLjMxMTVDMjYuNDUzMiAyOSAyOSAyNi40NTMyIDI5IDIzLjMxMTVWNi42ODg1M0MyOSAzLjU0Njg0IDI2LjQ1MzIgMSAyMy4zMTE1IDFaIg0KICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgIDxwYXRoDQogICAgICAgIGQ9Ik0yMy4zMTE1IDAuNzVINi42ODg1M0MzLjQwODc3IDAuNzUgMC43NSAzLjQwODc3IDAuNzUgNi42ODg1M1YyMy4zMTE1QzAuNzUgMjYuNTkxMiAzLjQwODc3IDI5LjI1IDYuNjg4NTMgMjkuMjVIMjMuMzExNUMyNi41OTEyIDI5LjI1IDI5LjI1IDI2LjU5MTIgMjkuMjUgMjMuMzExNVY2LjY4ODUzQzI5LjI1IDMuNDA4NzcgMjYuNTkxMiAwLjc1IDIzLjMxMTUgMC43NVoiDQogICAgICAgIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjA4IiBzdHJva2Utd2lkdGg9IjAuNSI+PC9wYXRoPg0KICAgIDxtYXNrIGlkPSJtYXNrMF80NzBfNDgzNjQiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjEiIHk9IjEiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMjMuMzExNSAxSDYuNjg4NTNDMy41NDY4NCAxIDEgMy41NDY4NCAxIDYuNjg4NTNWMjMuMzExNUMxIDI2LjQ1MzIgMy41NDY4NCAyOSA2LjY4ODUzIDI5SDIzLjMxMTVDMjYuNDUzMiAyOSAyOSAyNi40NTMyIDI5IDIzLjMxMTVWNi42ODg1M0MyOSAzLjU0Njg0IDI2LjQ1MzIgMSAyMy4zMTE1IDFaIg0KICAgICAgICAgICAgZmlsbD0id2hpdGUiPjwvcGF0aD4NCiAgICA8L21hc2s+DQogICAgPGcgbWFzaz0idXJsKCNtYXNrMF80NzBfNDgzNjQpIj4NCiAgICAgICAgPHBhdGgNCiAgICAgICAgICAgIGQ9Ik0yMy4zMTE1IDFINi42ODg1M0MzLjU0Njg0IDEgMSAzLjU0Njg0IDEgNi42ODg1M1YyMy4zMTE1QzEgMjYuNDUzMiAzLjU0Njg0IDI5IDYuNjg4NTMgMjlIMjMuMzExNUMyNi40NTMyIDI5IDI5IDI2LjQ1MzIgMjkgMjMuMzExNVY2LjY4ODUzQzI5IDMuNTQ2ODQgMjYuNDUzMiAxIDIzLjMxMTUgMVoiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICAgZD0iTTE1LjAwMDggNDguNjY0MkMyNS40MDE3IDQ4LjY2NDIgMzMuODMzNCA0MC4yMzI2IDMzLjgzMzQgMjkuODMxNkMzMy44MzM0IDE5LjQzMDcgMjUuNDAxNyAxMC45OTkgMTUuMDAwOCAxMC45OTlDNC41OTk4NSAxMC45OTkgLTMuODMxNzkgMTkuNDMwNyAtMy44MzE3OSAyOS44MzE2Qy0zLjgzMTc5IDQwLjIzMjYgNC41OTk4NSA0OC42NjQyIDE1LjAwMDggNDguNjY0MloiDQogICAgICAgICAgICBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDcwXzQ4MzY0KSI+PC9wYXRoPg0KICAgICAgICA8cGF0aCBkPSJNMjMuMjY4OCAxVjcuMjEyOTRMMjAuNjY2MyA1LjcxNDM3TDE4LjA2NzQgNy4yMTI5NFYxSDIzLjI2ODhaIiBmaWxsPSIjRkY1RjAwIj48L3BhdGg+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMTUuMTM0MyAxOC44ODFDMTUuMTM0MyAxOC44ODEgMTYuMTAxNCAxNy41NTEzIDE2LjEwMTQgMTYuNDA2NUMxNi4xMDE0IDE1LjI2MTcgMTUuNjY3NiAxNC43MzczIDE1LjEzNDMgMTQuNzM3M0MxNC42MDEgMTQuNzM3MyAxNC4xNjczIDE1LjI2MzUgMTQuMTY3MyAxNi40MDY1QzE0LjE2NzMgMTcuNTQ5NiAxNS4xMzQzIDE4Ljg4MSAxNS4xMzQzIDE4Ljg4MVoiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICAgZD0iTTcuNjI3MjQgMjIuNjU4NUM4Ljc3MjA1IDIyLjY1ODUgMTAuMTAxNyAyMy42MjU2IDEwLjEwMTcgMjMuNjI1NkMxMC4xMDE3IDIzLjYyNTYgOC43NzAyNyAyNC41OTI2IDcuNjI3MjQgMjQuNTkyNkM2LjQ4NDIgMjQuNTkyNiA1Ljk1ODAxIDI0LjE1ODkgNS45NTgwMSAyMy42MjU2QzUuOTU4MDEgMjMuMDkyMyA2LjQ4MjQyIDIyLjY1ODUgNy42MjcyNCAyMi42NTg1WiINCiAgICAgICAgICAgIGZpbGw9IndoaXRlIj48L3BhdGg+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMjIuNjM5NiAyNC41OTI2QzIxLjQ5NDggMjQuNTkyNiAyMC4xNjUxIDIzLjYyNTYgMjAuMTY1MSAyMy42MjU2QzIwLjE2NTEgMjMuNjI1NiAyMS40OTY2IDIyLjY1ODUgMjIuNjM5NiAyMi42NTg1QzIzLjc4MjYgMjIuNjU4NSAyNC4zMDg4IDIzLjA5MjMgMjQuMzA4OCAyMy42MjU2QzI0LjMwODggMjQuMTU4OSAyMy43ODQ0IDI0LjU5MjYgMjIuNjM5NiAyNC41OTI2WiINCiAgICAgICAgICAgIGZpbGw9IndoaXRlIj48L3BhdGg+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMTAuNDU1NSAxOC4zMTM5QzExLjI2NDMgMTkuMTIyNyAxMS41MjIxIDIwLjc0NzUgMTEuNTIyMSAyMC43NDc1QzExLjUyMjEgMjAuNzQ3NSA5Ljg5NzMyIDIwLjQ4OTcgOS4wODg0OCAxOS42ODA5QzguMjc5NjQgMTguODcyMSA4LjIxMzg3IDE4LjE5NDggOC41OTI1MSAxNy44MTYxQzguOTcxMTUgMTcuNDM3NSA5LjY0NjY2IDE3LjUwMzMgMTAuNDU3MyAxOC4zMTIxTDEwLjQ1NTUgMTguMzEzOVoiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICAgZD0iTTE4Ljc0NjUgMjAuNzQ3NkMxOC43NDY1IDIwLjc0NzYgMTkuMDA0MyAxOS4xMjI4IDE5LjgxMzEgMTguMzE0TDE5LjgxMTMgMTguMzEyMkMyMC42MjIgMTcuNTAzMyAyMS4yOTkzIDE3LjQzOTMgMjEuNjc2MSAxNy44MTYyQzIyLjA1NDggMTguMTk0OSAyMS45ODkgMTguODcyMSAyMS4xODAyIDE5LjY4MUMyMC4zNzEzIDIwLjQ4OTggMTguNzQ2NSAyMC43NDc2IDE4Ljc0NjUgMjAuNzQ3NloiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgIDwvZz4NCiAgICA8ZGVmcz4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDBfcmFkaWFsXzQ3MF80ODM2NCIgY3g9IjAiIGN5PSIwIiByPSIxIg0KICAgICAgICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiDQogICAgICAgICAgICBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE1LjAwMDggMjkuODMxNikgc2NhbGUoMTguODMyNikiPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0NDMDUwMCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1RjAwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+DQogICAgPC9kZWZzPg0KPC9zdmc+
// @match        *://*.fanqienovel.com/*
// @require      https://registry.npmmirror.com/vue/3.5.40/files/dist/vue.global.prod.js
// @require      https://registry.npmmirror.com/moment/2.30.1/files/min/moment.min.js
// @connect      fanqienovel.com
// @connect      api5-sinfonlinec.jxbhmy.com
// @connect      api3-sinfonlinec.jxbhmy.com
// @connect      reading.snssdk.com
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function (moment, vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
  const shared_key = new Uint8Array([172, 37, 198, 125, 221, 143, 56, 193, 179, 122, 35, 72, 130, 142, 34, 46]).buffer;
  const fetch = unsafeWindow.fetch;
  unsafeWindow.XMLHttpRequest;
  const defaultConfig = {
    install_id: "2187355326270644",
    device_id: "2187355326004404",
    device_type: "P30"
  };
  const _config = {
    currentConfig: defaultConfig
  };
  const scriptcss = "/* 移除章节锁定图标 */\r\n.muyeicon-lock {\r\n	display: none;\r\n}\r\n/* 移除APP推广图标 */\r\n.muye-to-fanqie {\r\n	display: none!important;\r\n}\r\n.reader-toolbar-item-download {\r\n	display: none!important;\r\n}\r\n.download-btn {\r\n	display: none!important;\r\n}\r\n.download-icon {\r\n	display: none!important;\r\n}\r\n\r\n.fqa-hide {\r\n	display: none!important;\r\n}\r\n/* 404 */\r\n.no-content {\r\n	display: none!important;\r\n}\r\n\r\n.fqa-comic-img {\r\n	width: 100%!important;\r\n	height: 100%!important;\r\n	max-width: 100%!important;\r\n	max-height: 100%!important;\r\n	padding-top: 0!important;\r\n	padding-bottom: 0!important;\r\n	margin-top: 0!important;\r\n	margin-bottom: 0!important;\r\n}\r\n\r\n.fqa-comic-reader {\r\n	line-height: 0!important;\r\n}\r\n\r\n.fqa-menu-item,\r\n.arco-menu-item {\r\n	width: 100%!important;\r\n}\r\n\r\n#dynamic-el {\r\n	display: none!important;\r\n}";
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function cloneElement(element) {
    return element.cloneNode(true);
  }
  function waitForElement(selector, timeout = 15e3) {
    const existing = document.querySelector(selector);
    if (existing) return Promise.resolve(existing);
    return new Promise((resolve) => {
      let timer;
      const observer2 = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          if (timer) clearTimeout(timer);
          observer2.disconnect();
          resolve(el);
        }
      });
      const start = () => {
        observer2.observe(document.documentElement, { childList: true, subtree: true });
        timer = setTimeout(() => {
          observer2.disconnect();
          resolve(document.querySelector(selector));
        }, timeout);
      };
      if (document.documentElement) {
        start();
      } else {
        document.addEventListener("DOMContentLoaded", start, { once: true });
      }
    });
  }
  function chunk(list, size) {
    const result = [];
    for (let i = 0; i < list.length; i += size) {
      result.push(list.slice(i, i + size));
    }
    return result;
  }
  async function inject() {
    while (!document.body) {
      console.log("Waiting for body...");
      await sleep(200);
    }
    GM_addStyle(scriptcss);
    console.log("CSS injected successfully!");
  }
  const enTag = ".font-DNMrHsV173Pd4pgy";
  const code_ed = 58715;
  const code_st = 58344;
  const mapping = [
    "D",
    "在",
    "主",
    "特",
    "家",
    "军",
    "然",
    "表",
    "场",
    "4",
    "要",
    "只",
    "v",
    "和",
    "?",
    "6",
    "别",
    "还",
    "g",
    "现",
    "儿",
    "岁",
    "?",
    "?",
    "此",
    "象",
    "月",
    "3",
    "出",
    "战",
    "工",
    "相",
    "o",
    "男",
    "直",
    "失",
    "世",
    "F",
    "都",
    "平",
    "文",
    "什",
    "V",
    "O",
    "将",
    "真",
    "T",
    "那",
    "当",
    "?",
    "会",
    "立",
    "些",
    "u",
    "是",
    "十",
    "张",
    "学",
    "气",
    "大",
    "爱",
    "两",
    "命",
    "全",
    "后",
    "东",
    "性",
    "通",
    "被",
    "1",
    "它",
    "乐",
    "接",
    "而",
    "感",
    "车",
    "山",
    "公",
    "了",
    "常",
    "以",
    "何",
    "可",
    "话",
    "先",
    "p",
    "i",
    "叫",
    "轻",
    "M",
    "士",
    "w",
    "着",
    "变",
    "尔",
    "快",
    "l",
    "个",
    "说",
    "少",
    "色",
    "里",
    "安",
    "花",
    "远",
    "7",
    "难",
    "师",
    "放",
    "t",
    "报",
    "认",
    "面",
    "道",
    "S",
    "?",
    "克",
    "地",
    "度",
    "I",
    "好",
    "机",
    "U",
    "民",
    "写",
    "把",
    "万",
    "同",
    "水",
    "新",
    "没",
    "书",
    "电",
    "吃",
    "像",
    "斯",
    "5",
    "为",
    "y",
    "白",
    "几",
    "日",
    "教",
    "看",
    "但",
    "第",
    "加",
    "候",
    "作",
    "上",
    "拉",
    "住",
    "有",
    "法",
    "r",
    "事",
    "应",
    "位",
    "利",
    "你",
    "声",
    "身",
    "国",
    "问",
    "马",
    "女",
    "他",
    "Y",
    "比",
    "父",
    "x",
    "A",
    "H",
    "N",
    "s",
    "X",
    "边",
    "美",
    "对",
    "所",
    "金",
    "活",
    "回",
    "意",
    "到",
    "z",
    "从",
    "j",
    "知",
    "又",
    "内",
    "因",
    "点",
    "Q",
    "三",
    "定",
    "8",
    "R",
    "b",
    "正",
    "或",
    "夫",
    "向",
    "德",
    "听",
    "更",
    "?",
    "得",
    "告",
    "并",
    "本",
    "q",
    "过",
    "记",
    "L",
    "让",
    "打",
    "f",
    "人",
    "就",
    "者",
    "去",
    "原",
    "满",
    "体",
    "做",
    "经",
    "K",
    "走",
    "如",
    "孩",
    "c",
    "G",
    "给",
    "使",
    "物",
    "?",
    "最",
    "笑",
    "部",
    "?",
    "员",
    "等",
    "受",
    "k",
    "行",
    "一",
    "条",
    "果",
    "动",
    "光",
    "门",
    "头",
    "见",
    "往",
    "自",
    "解",
    "成",
    "处",
    "天",
    "能",
    "于",
    "名",
    "其",
    "发",
    "总",
    "母",
    "的",
    "死",
    "手",
    "入",
    "路",
    "进",
    "心",
    "来",
    "h",
    "时",
    "力",
    "多",
    "开",
    "已",
    "许",
    "d",
    "至",
    "由",
    "很",
    "界",
    "n",
    "小",
    "与",
    "Z",
    "想",
    "代",
    "么",
    "分",
    "生",
    "口",
    "再",
    "妈",
    "望",
    "次",
    "西",
    "风",
    "种",
    "带",
    "J",
    "?",
    "实",
    "情",
    "才",
    "这",
    "?",
    "E",
    "我",
    "神",
    "格",
    "长",
    "觉",
    "间",
    "年",
    "眼",
    "无",
    "不",
    "亲",
    "关",
    "结",
    "0",
    "友",
    "信",
    "下",
    "却",
    "重",
    "己",
    "老",
    "2",
    "音",
    "字",
    "m",
    "呢",
    "明",
    "之",
    "前",
    "高",
    "P",
    "B",
    "目",
    "太",
    "e",
    "9",
    "起",
    "稜",
    "她",
    "也",
    "W",
    "用",
    "方",
    "子",
    "英",
    "每",
    "理",
    "便",
    "四",
    "数",
    "期",
    "中",
    "C",
    "外",
    "样",
    "a",
    "海",
    "们",
    "任"
  ];
  function decryptText(text) {
    let result = "";
    let changed = false;
    for (const char of text) {
      const codePoint = char.codePointAt(0);
      if (typeof codePoint !== "number") {
        return text;
      }
      if (codePoint < code_st || codePoint > code_ed) {
        result += char;
        continue;
      }
      const mapped = mapping[codePoint - code_st];
      if (mapped && mapped !== "?") {
        result += mapped;
        changed = true;
      } else {
        result += char;
      }
    }
    return changed ? result : text;
  }
  function decryptElement(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT
    );
    let textNode;
    while (textNode = walker.nextNode()) {
      const oldText = textNode.nodeValue;
      if (!oldText) {
        continue;
      }
      const newText = decryptText(oldText);
      if (newText !== oldText) {
        textNode.nodeValue = newText;
      }
    }
  }
  function decryptPage(root) {
    if (root instanceof Element && root.matches(enTag)) {
      decryptElement(root);
    }
    root.querySelectorAll(enTag).forEach(decryptElement);
  }
  function initFontDecrypt() {
    const observer2 = new MutationObserver((mutations) => {
      var _a, _b;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const encryptedElement = (_a = mutation.target.parentElement) == null ? void 0 : _a.closest(
            enTag
          );
          if (encryptedElement) {
            decryptElement(encryptedElement);
          }
          continue;
        }
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            decryptPage(node);
            continue;
          }
          if (node.nodeType === Node.TEXT_NODE) {
            const encryptedElement = (_b = node.parentElement) == null ? void 0 : _b.closest(
              enTag
            );
            if (encryptedElement) {
              decryptElement(encryptedElement);
            }
          }
        }
      }
    });
    observer2.observe(document, {
      subtree: true,
      childList: true,
      characterData: true
    });
    decryptPage(document);
  }
  const supportedMethods = /* @__PURE__ */ new Set([
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE"
  ]);
  function apiFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      const { signal } = options;
      if (signal == null ? void 0 : signal.aborted) {
        reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
        return;
      }
      const headers = normalizeHeaders(options.headers);
      const data = normalizeBody(options.body);
      const method = options.method ?? (data ? "POST" : "GET");
      if (!supportedMethods.has(method)) {
        reject(new TypeError(`Unsupported request method: ${method}`));
        return;
      }
      let request;
      const abort = () => request == null ? void 0 : request.abort();
      function cleanup() {
        signal == null ? void 0 : signal.removeEventListener("abort", abort);
      }
      request = GM_xmlhttpRequest({
        url,
        method,
        headers,
        data,
        anonymous: options.credentials === "omit",
        redirect: options.redirect === "error" ? "error" : "follow",
        onload(response) {
          cleanup();
          resolve(Object.assign(response, {
            json() {
              return JSON.parse(this.responseText);
            }
          }));
        },
        onerror(response) {
          cleanup();
          reject(createRequestError("Network request failed", response));
        },
        ontimeout() {
          cleanup();
          reject(createRequestError("Network request timed out", {
            status: 0,
            statusText: "Timeout",
            url
          }));
        },
        onabort() {
          cleanup();
          reject(
            (signal == null ? void 0 : signal.reason) ?? new DOMException("The operation was aborted", "AbortError")
          );
        }
      });
      signal == null ? void 0 : signal.addEventListener("abort", abort, { once: true });
    });
  }
  function normalizeHeaders(headers) {
    if (!headers) {
      return void 0;
    }
    return Object.fromEntries(new Headers(headers).entries());
  }
  function normalizeBody(body) {
    if (body == null) {
      return void 0;
    }
    if (body instanceof URLSearchParams) {
      return body.toString();
    }
    if (typeof body === "string" || body instanceof Blob || body instanceof ArrayBuffer || body instanceof FormData) {
      return body;
    }
    if (ArrayBuffer.isView(body)) {
      return body.buffer.slice(
        body.byteOffset,
        body.byteOffset + body.byteLength
      );
    }
    throw new TypeError(
      "GM_xmlhttpRequest does not support ReadableStream request bodies"
    );
  }
  function createRequestError(message, response) {
    const error = new TypeError(message);
    Object.defineProperty(error, "response", {
      configurable: true,
      enumerable: false,
      value: response
    });
    return error;
  }
  unsafeWindow.localStorage;
  function write(key, value) {
    GM_setValue(key, JSON.stringify(value));
  }
  function read(key) {
    return JSON.parse(GM_getValue(key) || "null");
  }
  function del(key) {
    GM_deleteValue(key);
  }
  function getCookie(key) {
    var _a;
    return ((_a = document.cookie.split(";").find((c) => c.trim().startsWith(key + "="))) == null ? void 0 : _a.split("=")[1]) || null;
  }
  const baseUrl = "https://api5-sinfonlinec.jxbhmy.com/redcandle/search";
  const baseQuery = {
    aid: "1967",
    app_name: "novelapp"
  };
  async function get(path, cookie, query, headers, optionsOverride) {
    let url = baseUrl + path;
    getCookie("sessionid");
    const h = {
      Cookie: "",
      ...headers
    };
    const deviceQuery = {
      device_id: _config.currentConfig.device_id,
      iid: _config.currentConfig.install_id
    };
    const finalQuery = {
      ...baseQuery,
      ...deviceQuery,
      ...query
    };
    url += "?" + new URLSearchParams(finalQuery).toString();
    const options = {
      method: "GET",
      headers: h,
      ...optionsOverride
    };
    console.log("---start--- GET ", url, options);
    const res = await apiFetch(url, options);
    console.log("---complete--- GET ", url, res);
    return res;
  }
  async function post(path, cookie, query, body, headers, optionsOverride) {
    let url = baseUrl + path;
    getCookie("sessionid");
    const h = {
      Cookie: "",
      ...headers
    };
    const deviceQuery = {
      device_id: _config.currentConfig.device_id,
      iid: _config.currentConfig.install_id
    };
    const finalQuery = {
      ...baseQuery,
      ...deviceQuery,
      ...query
    };
    url += "?" + new URLSearchParams(finalQuery).toString();
    const options = {
      method: "POST",
      headers: h,
      body,
      ...optionsOverride
    };
    console.log("---start--- POST ", url, options);
    const res = await apiFetch(url, options);
    console.log("---complete--- POST ", url, res);
    return res;
  }
  function getCrypto() {
    const c = globalThis.crypto ?? unsafeWindow.crypto;
    if (!(c == null ? void 0 : c.subtle)) {
      throw new Error("Crypto API不可用，请检查浏览器版本是否支持该API");
    }
    return c;
  }
  function getSubtle() {
    return getCrypto().subtle;
  }
  function b64decode(b64) {
    const binaryString = atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  function b64encode(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 32768;
    const chunks = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
      chunks.push(
        String.fromCharCode(...bytes.subarray(i, i + chunkSize))
      );
    }
    return btoa(chunks.join(""));
  }
  function unhex(hex) {
    if (hex.length % 2 !== 0) {
      throw new Error("Invalid hex string");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.slice(i, i + 2), 16);
      if (Number.isNaN(byte)) {
        throw new Error("Invalid hex string");
      }
      bytes[i / 2] = byte;
    }
    return bytes.buffer;
  }
  function randomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const array = new Uint8Array(length);
    getCrypto().getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length);
    }
    return result;
  }
  async function decryptChapter(encrypted, config = defaultConfig) {
    var _a;
    if (!encrypted) {
      throw new Error("Invalid encrypted chapter");
    }
    const buf = b64decode(encrypted);
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const key = (_a = config.key_info) == null ? void 0 : _a.key;
    if (!key) {
      throw new Error("Missing decrypt key");
    }
    const subtle = getSubtle();
    const cryptoKey = await subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
    return subtle.decrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      data
    ).then((decrypted) => {
      const decoder = new TextDecoder();
      const plain = decoder.decode(decrypted);
      if (plain.trim().startsWith("<")) {
        return plain;
      }
      try {
        return JSON.parse(plain);
      } catch (e) {
        console.warn("Invalid chapter content: ", plain, e);
        return void 0;
      }
    });
  }
  function reverseHex(value) {
    const be = BigInt(value).toString(16).padStart(32, "0");
    let result = "";
    for (let i = be.length; i > 0; i -= 2) result += be.slice(i - 2, i);
    return result;
  }
  async function encryptKeyinfoBody(config) {
    const deviceId = config.device_id;
    const iv = new TextEncoder().encode(randomString(16));
    const data = new Uint8Array(unhex(reverseHex(deviceId))).slice(0, 8);
    console.log(data);
    const subtle = getSubtle();
    const k = await subtle.importKey(
      "raw",
      shared_key,
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );
    const encrypted = await subtle.encrypt(
      { name: "AES-CBC", iv },
      k,
      data
    );
    const final = new Uint8Array(iv.length + encrypted.byteLength);
    console.log(final);
    final.set(iv, 0);
    final.set(new Uint8Array(encrypted), iv.length);
    return JSON.stringify({
      content: b64encode(final.buffer)
    });
  }
  async function decryptKeyinfoResponse(encrypted) {
    const buf = b64decode(encrypted);
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const subtle = getSubtle();
    const k = await subtle.importKey(
      "raw",
      shared_key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
    return subtle.decrypt(
      { name: "AES-CBC", iv },
      k,
      data
    );
  }
  async function decryptComicImage(image, key) {
    const subtle = getSubtle();
    const cryptoKey = await subtle.importKey(
      "raw",
      unhex(key),
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    const iv = image.slice(0, 12);
    const data = image.slice(12);
    return await subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data
    );
  }
  async function refreshKeyinfo() {
    var _a, _b, _c;
    const b = await encryptKeyinfoBody(_config.currentConfig);
    const res = await post("/reader/crypt/registerkey/v1", false, {}, b);
    console.log(res);
    const j = res.json();
    console.log("response: ", j);
    const ek = (_a = j == null ? void 0 : j.data) == null ? void 0 : _a.key;
    if (!ek) {
      throw new Error("Failed to get key info");
    }
    const key = await decryptKeyinfoResponse(ek);
    const keyinfo = {
      key,
      keyver: (_b = j == null ? void 0 : j.data) == null ? void 0 : _b.keyver
    };
    console.log("Refreshed key info:", keyinfo);
    _config.currentConfig.key_info = keyinfo;
    write("keyinfo", {
      key: b64encode(key),
      keyver: (_c = j == null ? void 0 : j.data) == null ? void 0 : _c.keyver
    });
  }
  async function ensureKeyinfo(expectedKeyVersion) {
    const keyinfo = _config.currentConfig.key_info;
    const cachedKeyInfo = read("keyinfo");
    console.log("cached key info: ", cachedKeyInfo);
    if (cachedKeyInfo) {
      const cki = {
        key: b64decode(cachedKeyInfo.key),
        keyver: cachedKeyInfo.keyver
      };
      if (typeof expectedKeyVersion === "undefined" || cki.keyver === expectedKeyVersion) {
        _config.currentConfig.key_info = cki;
        return;
      }
    }
    if (!keyinfo) {
      return await refreshKeyinfo();
    }
    if ((keyinfo == null ? void 0 : keyinfo.keyver) !== expectedKeyVersion) {
      return await refreshKeyinfo();
    }
  }
  async function getChapter(itemId, _retry) {
    var _a, _b;
    if (typeof _retry === "undefined") _retry = 0;
    if (_retry > 5) {
      throw new Error(`Failed to get chapter: ${itemId}`);
    }
    if (!_config.currentConfig.key_info) {
      await ensureKeyinfo();
    }
    const res = await get(`/reader/full/v1`, false, { item_id: itemId });
    const j = (_a = res.json()) == null ? void 0 : _a.data;
    if (!j) {
      console.warn("Failed to get chapter: ", itemId, ", response: ", j);
      return await getChapter(itemId, _retry + 1);
    }
    if ((j == null ? void 0 : j.content) === "Invalid" || (j == null ? void 0 : j.key_version) !== ((_b = _config.currentConfig.key_info) == null ? void 0 : _b.keyver)) {
      console.warn("Key reg expired, regster again and retrying...");
      await ensureKeyinfo(parseInt(j == null ? void 0 : j.key_version));
      return await getChapter(itemId, _retry + 1);
    }
    j.content = await decryptChapter(j == null ? void 0 : j.content, _config.currentConfig);
    return j;
  }
  async function getCatalogRaw(bookId) {
    const response = await apiFetch(`https://fanqienovel.com/api/reader/directory/detail?bookId=${bookId}`);
    const j = response.json();
    if (j.code !== 0 || j.data.chapterListWithVolume.length === 0) {
      throw new Error("Empty catalog");
    }
    return [j.data.chapterListWithVolume, j.data.allItemIds];
  }
  async function getCatalog(bookId) {
    const r = await getCatalogRaw(bookId);
    const catalogRaw = r[0];
    const allItemIds = r[1];
    const vmap = {};
    const chapters = [];
    catalogRaw[0].map((item) => {
      const chapterItem = {
        item_id: item.itemId,
        title: item.title,
        // YYYY-MM-DD HH:mm:ss
        update_time: moment(item.firstPassTime * 1e3).format("YYYY-MM-DD HH:mm:ss"),
        char_count: item.charCount || 0,
        volume_title: item.volume_name
      };
      chapters.push(chapterItem);
      if (!vmap[item.volume_name]) {
        vmap[item.volume_name] = {
          title: item.volume_name,
          book_id: bookId,
          chapter_list: []
        };
      }
      vmap[item.volume_name].chapter_list.push(chapterItem);
    });
    return {
      book_id: bookId,
      volume_list: Object.values(vmap),
      chapter_list: chapters,
      all_item_ids: allItemIds
    };
  }
  function mappingCreationStatus(status) {
    switch (status) {
      case "0":
        return "完结";
      case "1":
        return "连载";
      case "4":
        return "断更";
      default:
        return "未知";
    }
  }
  async function getBookInfoRaw(bookId) {
    const response = await apiFetch(`https://api5-sinfonlinec.jxbhmy.com/reading/bookapi/multi-detail/v?book_id=${bookId}&aid=1967`);
    const j = response.json();
    console.log("Book Info:", j);
    if (typeof j === "object" && j !== null && "data" in j && Array.isArray(j.data) && j.data.length > 0) return j.data[0];
    return null;
  }
  async function getBookInfo(bookId) {
    const bookInfo = await getBookInfoRaw(bookId);
    if (!bookInfo) {
      throw new Error("Book not found");
    }
    return {
      book_id: bookInfo.book_id,
      title: bookInfo.book_name || bookInfo.original_book_name,
      author: bookInfo.author,
      cover_url: bookInfo.thumb_url,
      summary: bookInfo.abstract,
      // volume_list: bookInfo.volume_list,
      update_time: moment(bookInfo.last_chapter_first_pass_time * 1e3).format("YYYY-MM-DD HH:mm:ss"),
      status: mappingCreationStatus(bookInfo.creation_status)
      // chapter_count: bookInfo.chapter_count,
    };
  }
  async function getBookInfoAndCatalog(book) {
    if (typeof book !== "string") {
      book = book.book_id;
    }
    const bookInfo = await getBookInfo(book);
    if (!bookInfo) {
      throw new Error("Book not found");
    }
    const catalog = await getCatalog(bookInfo.book_id);
    console.log("Catalog:", catalog);
    bookInfo.volume_list = catalog.volume_list;
    bookInfo.chapter_list = catalog.chapter_list;
    return bookInfo;
  }
  let currentBook = null;
  let latestItemId = null;
  async function insertContent() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const itemId = ((_a = window.location.pathname.split("/").pop()) == null ? void 0 : _a.substring(0, 19)) || "";
    if (!itemId) {
      console.warn("No item_id found in URL");
      return;
    }
    latestItemId = itemId;
    const chapter = await getChapter(itemId);
    if (!chapter) {
      console.warn("No chapter found for item_id:", itemId);
      return;
    }
    if (latestItemId !== itemId) {
      console.debug("Stale chapter response discarded:", itemId);
      return;
    }
    console.log("Chapter:", chapter);
    const pageState = unsafeWindow.__INITIAL_STATE__;
    const chapterTitle = ((_b = chapter.novel_data) == null ? void 0 : _b.title) || ((_d = (_c = pageState == null ? void 0 : pageState.reader) == null ? void 0 : _c.chapterData) == null ? void 0 : _d.title);
    if (typeof chapter.content === "string") {
      const dp = new DOMParser();
      const doc = dp.parseFromString(chapter.content, "text/html");
      const body = doc.body;
      const article = body.querySelector("article");
      const toProcess = article || body;
      for (let i = 0; i < toProcess.childNodes.length; i++) {
        if (i < 1 && ((_e = toProcess.childNodes[i]) == null ? void 0 : _e.innerHTML.includes(chapterTitle))) {
          toProcess.removeChild(toProcess.childNodes[i]);
        }
      }
      const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)");
      if (readerContainer) {
        let scriptContainer = document.getElementById("fqa-reader-content");
        if (!scriptContainer) {
          scriptContainer = cloneElement(readerContainer);
          scriptContainer.id = "fqa-reader-content";
          scriptContainer.classList.add("fqa");
          scriptContainer.classList.remove("noselect");
          readerContainer.insertAdjacentElement("beforebegin", scriptContainer);
        }
        scriptContainer.innerHTML = "";
        readerContainer.classList.add("fqa-hide");
        scriptContainer.appendChild(toProcess);
      }
    } else if (chapter.content.picInfos) {
      if (chapter.content.encrypt) {
        const imgs = [];
        for (let i = 0; i < chapter.content.picInfos.length; i++) {
          const picInfo = chapter.content.picInfos[i];
          const img = document.createElement("img");
          img.className = "fqa-comic-img fqa-comic-encrypted";
          img.alt = `第${i + 1}页`;
          img.dataset.encryptedUrl = picInfo.picUrl;
          img.dataset.encryptKey = chapter.content.encrypt_key;
          img.dataset.pageIndex = i.toString();
          img.style.minHeight = "500px";
          img.style.backgroundColor = "#f0f0f0";
          imgs.push(img);
        }
        const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)");
        if (readerContainer) {
          let scriptContainer = document.getElementById("fqa-comic-content");
          if (!scriptContainer) {
            scriptContainer = cloneElement(readerContainer);
            scriptContainer.id = "fqa-reader-content";
            scriptContainer.classList.add("fqa");
            scriptContainer.classList.add("fqa-comic-reader");
            scriptContainer.classList.remove("noselect");
            readerContainer.insertAdjacentElement("beforebegin", scriptContainer);
          }
          scriptContainer.innerHTML = "";
          readerContainer.classList.add("fqa-hide");
          imgs.forEach((img) => scriptContainer.appendChild(img));
          const observer2 = new IntersectionObserver(
            async (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  const img = entry.target;
                  if (img.dataset.encryptedUrl && img.dataset.encryptKey && !img.src) {
                    observer2.unobserve(img);
                    try {
                      const response = await fetch(img.dataset.encryptedUrl);
                      const encryptedBuffer = await response.arrayBuffer();
                      const decryptedBuffer = await decryptComicImage(
                        encryptedBuffer,
                        img.dataset.encryptKey
                      );
                      const blob = new Blob([decryptedBuffer], { type: "image/jpeg" });
                      const blobUrl = URL.createObjectURL(blob);
                      img.src = blobUrl;
                      img.style.minHeight = "";
                      img.style.backgroundColor = "";
                      img.onload = () => {
                        URL.revokeObjectURL(blobUrl);
                      };
                    } catch (error) {
                      console.error(`解密图片失败 (页 ${img.dataset.pageIndex}):`, error);
                      img.alt = `第${Number(img.dataset.pageIndex) + 1}页 - 解密失败`;
                      img.style.backgroundColor = "#ffebee";
                    }
                  }
                }
              }
            },
            {
              rootMargin: "200px"
            }
          );
          imgs.forEach((img) => observer2.observe(img));
        }
      } else {
        const imgs = [];
        for (let i = 0; i < chapter.content.picInfos.length; i++) {
          const picInfo = chapter.content.picInfos[i];
          const img = document.createElement("img");
          img.className = "fqa-comic-img";
          img.alt = `第${i + 1}页`;
          img.src = picInfo.picUrl;
          imgs.push(img);
        }
        const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)");
        if (readerContainer) {
          let scriptContainer = document.getElementById("fqa-comic-content");
          if (!scriptContainer) {
            scriptContainer = cloneElement(readerContainer);
            scriptContainer.id = "fqa-reader-content";
            scriptContainer.classList.add("fqa");
            scriptContainer.classList.add("fqa-comic-reader");
            scriptContainer.classList.remove("noselect");
            readerContainer.insertAdjacentElement("beforebegin", scriptContainer);
          }
          scriptContainer.innerHTML = "";
          readerContainer.classList.add("fqa-hide");
          imgs.forEach((img) => scriptContainer.appendChild(img));
        }
      }
    }
    const muyeReaderTitle = document.querySelector("h1.muye-reader-title");
    let muyeReaderSubtitle = document.querySelector("div.muye-reader-subtitle");
    (_f = document.querySelector("#fqa-subtitle")) == null ? void 0 : _f.remove();
    if (muyeReaderSubtitle) {
      let _cloned = cloneElement(muyeReaderSubtitle);
      muyeReaderSubtitle.classList.add("fqa-hide");
      _cloned.id = "fqa-subtitle";
      muyeReaderSubtitle.insertAdjacentElement("afterend", _cloned);
      muyeReaderSubtitle = _cloned;
      _cloned.classList.remove("fqa-hide");
      console.log("clone subtitle: ", _cloned);
    }
    if (muyeReaderTitle) {
      muyeReaderTitle.textContent = chapterTitle;
    }
    console.log("Current book:", currentBook);
    if (!currentBook || currentBook == null || currentBook.book_id !== ((_g = chapter.novel_data) == null ? void 0 : _g.book_id)) {
      currentBook = await getBookInfoAndCatalog((_h = chapter.novel_data) == null ? void 0 : _h.book_id);
      console.log("Current book:", currentBook);
    }
    if (currentBook && currentBook.chapter_list) {
      const currentChapterItem = currentBook.chapter_list.find((c) => c.item_id === itemId);
      if (currentChapterItem) {
        console.log("Current chapter:", currentChapterItem);
        document.title = currentChapterItem.title + " - " + currentBook.title + " - 番茄小说";
        if (document.getElementById("fqa-current-chapter-volume")) {
          const c = document.getElementById("fqa-current-chapter-volume");
          if (c) {
            c.textContent = currentChapterItem.volume_title;
          }
        } else {
          const volSpan = document.createElement("span");
          volSpan.className = "desc-item";
          volSpan.id = "fqa-current-chapter-volume";
          volSpan.textContent = currentChapterItem.volume_title;
          const c = muyeReaderSubtitle == null ? void 0 : muyeReaderSubtitle.firstChild;
          if (c) {
            c.insertAdjacentElement("beforebegin", volSpan);
          }
        }
        let updateTimeSpans = (muyeReaderSubtitle == null ? void 0 : muyeReaderSubtitle.querySelectorAll("span.desc-item")) || [];
        if (updateTimeSpans.length >= 2) {
          let updateTimeSpan = updateTimeSpans[updateTimeSpans.length - 1];
          let uttspan = updateTimeSpan.firstChild;
          uttspan == null ? void 0 : uttspan.remove();
          updateTimeSpan.innerHTML = "更新时间：" + currentChapterItem.update_time;
        } else {
          let updateTimeSpan = document.createElement("span");
          updateTimeSpan.className = "desc-item";
          updateTimeSpan.textContent = `更新时间：${currentChapterItem.update_time}`;
        }
      }
    }
  }
  async function onUrlChange$1(_previous) {
    await insertContent();
  }
  async function onHashChange$1(_previous) {
  }
  async function onLoad$1() {
    document.querySelector("div.muye-reader-btns");
    await insertContent();
  }
  function readerFilter(path, _query, _hash) {
    return path.startsWith("/reader") || path.startsWith("reader");
  }
  const _exports$3 = [
    {
      id: "readerHook_load",
      event: "load",
      handler: onLoad$1,
      filter: readerFilter
    },
    {
      id: "readerHook_urlChange",
      event: "onUrlChange",
      handler: onUrlChange$1,
      filter: readerFilter
    },
    {
      id: "readerHook_hashChange",
      event: "onHashChange",
      handler: onHashChange$1,
      filter: readerFilter
    }
  ];
  const blackList = [
    "mcs.zijieapi.com",
    "vcs.zijieapi.com/vc/setting",
    "mon.zijieapi.com",
    "mssdk.bytedance.com/web/common",
    "hm.baidu.com"
  ];
  const BLOCKED_BODY = JSON.stringify({
    e: 0,
    sc: 10,
    tc: 10
  });
  function checkBlack(url) {
    return blackList.some((black) => url.includes(black));
  }
  const originalFetch = unsafeWindow.fetch.bind(unsafeWindow);
  unsafeWindow.fetch = function fetch2(input, init2) {
    let url;
    if (input instanceof Request) {
      url = input.url;
    } else if (input instanceof URL) {
      url = input.href;
    } else {
      url = input;
    }
    if (checkBlack(url)) {
      console.log("blocked request: " + url);
      return Promise.resolve(new Response(BLOCKED_BODY, {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }));
    }
    return originalFetch(input, init2);
  };
  const originalXMLHttpRequest = unsafeWindow.XMLHttpRequest;
  unsafeWindow.XMLHttpRequest = class XMLHttpRequest extends originalXMLHttpRequest {
    constructor() {
      super(...arguments);
      __publicField(this, "_blockedUrl");
    }
    open(method, url, async = true, user, password) {
      if (checkBlack(url)) {
        console.log("blocked request: " + url);
        this._blockedUrl = url;
        return;
      }
      this._blockedUrl = void 0;
      super.open(method, url, async, user, password);
    }
    setRequestHeader(name2, value) {
      if (this._blockedUrl !== void 0) return;
      super.setRequestHeader(name2, value);
    }
    send(body) {
      if (this._blockedUrl === void 0) {
        super.send(body);
        return;
      }
      const url = this._blockedUrl;
      const shadow = (prop, value) => Object.defineProperty(this, prop, { configurable: true, get: () => value });
      setTimeout(() => {
        shadow("readyState", 4);
        shadow("status", 200);
        shadow("statusText", "OK");
        shadow("responseURL", url);
        shadow("responseText", this.responseType === "" || this.responseType === "text" ? BLOCKED_BODY : "");
        shadow("response", this.responseType === "json" ? {
          "e": 0,
          "sc": 10,
          "tc": 10
        } : BLOCKED_BODY);
        this.dispatchEvent(new Event("readystatechange"));
        this.dispatchEvent(new ProgressEvent("load"));
        this.dispatchEvent(new ProgressEvent("loadend"));
      }, 0);
    }
    abort() {
      if (this._blockedUrl !== void 0) return;
      super.abort();
    }
    getAllResponseHeaders() {
      if (this._blockedUrl !== void 0) return "content-type: application/json\r\n";
      return super.getAllResponseHeaders();
    }
    getResponseHeader(name2) {
      if (this._blockedUrl !== void 0) {
        return name2.toLowerCase() === "content-type" ? "application/json" : null;
      }
      return super.getResponseHeader(name2);
    }
  };
  const _exports$2 = [];
  let userState = {
    isLogin: false,
    userInfo: null
  };
  if (read("userState")) {
    userState = read("userState");
  }
  console.log("userState:", userState);
  async function getDetailedUserInfo() {
    if (!(userState == null ? void 0 : userState.isLogin) || !(userState == null ? void 0 : userState.userInfo)) {
      return null;
    }
    if (userState.userInfo.gender !== void 0 && userState.userInfo.recommend_gender !== void 0 && userState.userInfo.fans_num !== void 0 && userState.userInfo.following_num !== void 0 && userState.userInfo.is_author !== void 0 && userState.userInfo.author_desc !== void 0 && userState.userInfo.read_book_num !== void 0 && userState.userInfo.read_book_time !== void 0) {
      return userState.userInfo;
    }
    const response = await fetch("https://fanqienovel.com/reading/user/basic_info/get/v?aid=1967");
    const j = await response.json();
    if (j == null ? void 0 : j.data) {
      const data = j.data;
      userState.userInfo.gender = data.profile_gender;
      userState.userInfo.recommend_gender = data.gender;
      userState.userInfo.fans_num = data.fans_num;
      userState.userInfo.following_num = data.follow_user_num;
      userState.userInfo.is_author = data.is_author;
      userState.userInfo.author_desc = data.author_desc;
      userState.userInfo.read_book_num = data.read_book_num;
      userState.userInfo.read_book_time = BigInt(data.read_book_time);
      return userState.userInfo;
    }
    write("userState", userState);
    return userState.userInfo;
  }
  async function checkLogin() {
    var _a, _b, _c, _d, _e, _f;
    const response = await fetch("https://fanqienovel.com/api/user/info/v2");
    const j = await response.json();
    const _userInfo = {
      id: (_a = j == null ? void 0 : j.data) == null ? void 0 : _a.id,
      username: (_b = j == null ? void 0 : j.data) == null ? void 0 : _b.name,
      avatar: (_c = j == null ? void 0 : j.data) == null ? void 0 : _c.avatar,
      desc: (_d = j == null ? void 0 : j.data) == null ? void 0 : _d.desc,
      age: (_e = j == null ? void 0 : j.data) == null ? void 0 : _e.age
    };
    if (((_f = j == null ? void 0 : j.data) == null ? void 0 : _f.id) > 1) {
      userState.isLogin = true;
      userState.userInfo = _userInfo;
      write("userState", userState);
      return true;
    } else {
      del("userState");
      return false;
    }
  }
  async function init() {
    var _a;
    await checkLogin();
    if (userState.isLogin) {
      console.log("Hello, ", (_a = userState == null ? void 0 : userState.userInfo) == null ? void 0 : _a.username);
    }
  }
  const bookshelf = '<svg xmlns="http://www.w3.org/2000/svg"\r\n     width="24"\r\n     height="24"\r\n     viewBox="0 0 24 24"\r\n     fill="none"\r\n     stroke="currentColor"\r\n     stroke-width="1.2"\r\n     stroke-linecap="round"\r\n     stroke-linejoin="round">\r\n  <path d="M3.5 20h17"/>\r\n  <rect x="5" y="7" width="3.5" height="13" rx="0.8"/>\r\n  <rect x="8.5" y="5" width="4" height="15" rx="0.8"/>\r\n  <path d="M15.1 6.2 18 5.5l3.1 13.6-2.9.7z"/>\r\n  <path d="M9.8 8h1.4M6.1 10h1.3M17 8.8l1.3-.3"/>\r\n</svg>';
  function formatReadingTime(readBookTime) {
    let minutes = readBookTime / 60000n;
    const hours = minutes / 60n;
    minutes = minutes % 60n;
    return `${hours} 时 ${minutes} 分`;
  }
  function createMenuItem(text, icon, onclick) {
    const item = document.createElement("div");
    item.role = "menuitem";
    item.classList.add("fqa-menu-item", "arco-menu-item", "serial-menu-item", "slogin-user-avatar__menu-item-wrapper");
    const inner1 = document.createElement("div");
    inner1.classList.add("slogin-user-avatar__menu-item");
    if (icon) {
      const iconDiv = document.createElement("div");
      iconDiv.classList.add("slogin-user-avatar__menu-item__icon");
      iconDiv.innerHTML = icon;
      inner1.appendChild(iconDiv);
    }
    const inner2 = document.createElement("div");
    inner2.classList.add("slogin-user-avatar__menu-item__content");
    inner2.textContent = text;
    inner1.appendChild(inner2);
    item.appendChild(inner1);
    if (onclick) {
      item.addEventListener("click", onclick);
    }
    return item;
  }
  async function mainHook$1(_previous) {
    const userInfo = await getDetailedUserInfo();
    if (!userInfo) {
      return;
    }
    const injected = /* @__PURE__ */ new WeakSet();
    const inject2 = (menuInner) => {
      if (injected.has(menuInner)) {
        return;
      }
      injected.add(menuInner);
      console.log("user action dialog created", menuInner);
      const firstDiv = createMenuItem(`阅读 ${userInfo.read_book_num} 本书`);
      menuInner.insertAdjacentElement("afterbegin", firstDiv);
      const secondDiv = createMenuItem(formatReadingTime(userInfo.read_book_time ?? 0n));
      firstDiv.insertAdjacentElement("afterend", secondDiv);
      const thirdDiv = createMenuItem("我的书架", bookshelf, () => {
        window.open("https://fanqienovel.com/bookshelf", "_blank");
      });
      secondDiv.insertAdjacentElement("afterend", thirdDiv);
    };
    const scan = (root) => {
      if (root.classList.contains("arco-menu-inner")) {
        inject2(root);
      }
      root.querySelectorAll(".arco-menu-inner").forEach(inject2);
    };
    const observer2 = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              scan(node);
            }
          });
        }
      });
    });
    observer2.observe(document.body, { childList: true, subtree: true });
    scan(document.body);
  }
  function filter$1(path, _query, _hash) {
    return userState.isLogin && !path.startsWith("/writer") && !path.startsWith("/welfare");
  }
  const _exports$1 = [
    {
      id: "userHook",
      event: "load",
      filter: filter$1,
      handler: mainHook$1
    }
  ];
  const _hoisted_1$3 = ["aria-label"];
  const _hoisted_2$3 = { class: "fqa-cover" };
  const _hoisted_3$3 = ["src", "alt"];
  const _hoisted_4$3 = {
    key: 1,
    class: "fqa-cover-progress"
  };
  const _hoisted_5$3 = ["title"];
  const _hoisted_6$3 = ["title"];
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookCard",
    props: {
      entry: {}
    },
    emits: ["hover", "leave", "open", "visible"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const detail = vue.computed(() => props.entry.detail);
      const title = vue.computed(() => {
        var _a;
        return ((_a = detail.value) == null ? void 0 : _a.title) ?? "";
      });
      const tag = vue.computed(() => {
        const d = detail.value;
        if (!d) return null;
        if (d.update_status === "1") return { text: "更新", cls: "" };
        if (d.status === "4") return { text: "断更", cls: "fqa-cover-tag-gray" };
        if (d.status === "0") return { text: "完结", cls: "fqa-cover-tag-gray" };
        if (d.status === "1") return { text: "连载", cls: "fqa-cover-tag-gray" };
        return null;
      });
      const progressText = vue.computed(() => {
        const d = detail.value;
        if (!d) return "";
        const total = d.total_chapter_count || 0;
        const order = Math.max(0, Math.min(d.current_chapter_order || 0, total));
        if (!order) return total ? `未读 · 共${total}章` : "未读";
        return `${order}章/${total}章`;
      });
      const progressPercent = vue.computed(() => {
        const d = detail.value;
        if (!d || !d.total_chapter_count) return 0;
        const ratio = (d.current_chapter_order || 0) / d.total_chapter_count;
        return Math.max(0, Math.min(1, ratio)) * 100;
      });
      function onEnter(event) {
        emit("hover", { entry: props.entry, el: event.currentTarget });
      }
      const imgLoaded = vue.ref(false);
      vue.watch(
        () => {
          var _a;
          return (_a = detail.value) == null ? void 0 : _a.cover_url;
        },
        () => {
          imgLoaded.value = false;
        }
      );
      const cardRef = vue.ref(null);
      let io = null;
      vue.onMounted(() => {
        if (typeof IntersectionObserver === "undefined") {
          emit("visible", props.entry);
          return;
        }
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              emit("visible", props.entry);
            }
          },
          { rootMargin: "200px" }
        );
        if (cardRef.value) io.observe(cardRef.value);
      });
      vue.onBeforeUnmount(() => {
        io == null ? void 0 : io.disconnect();
        io = null;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "cardRef",
          ref: cardRef,
          class: "fqa-card",
          role: "link",
          tabindex: "0",
          "aria-label": title.value,
          onMouseenter: onEnter,
          onMouseleave: _cache[2] || (_cache[2] = ($event) => emit("leave")),
          onClick: _cache[3] || (_cache[3] = ($event) => emit("open", __props.entry)),
          onKeydown: [
            _cache[4] || (_cache[4] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.entry), ["prevent"]), ["enter"])),
            _cache[5] || (_cache[5] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.entry), ["prevent"]), ["space"]))
          ]
        }, [
          !detail.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            _cache[6] || (_cache[6] = vue.createElementVNode("div", { class: "fqa-sk-cover fqa-sk-anim" }, null, -1)),
            _cache[7] || (_cache[7] = vue.createElementVNode("div", {
              class: "fqa-sk-line fqa-sk-anim",
              style: { "width": "90%" }
            }, null, -1)),
            _cache[8] || (_cache[8] = vue.createElementVNode("div", {
              class: "fqa-sk-line fqa-sk-anim",
              style: { "width": "55%" }
            }, null, -1))
          ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createElementVNode("div", _hoisted_2$3, [
              vue.createElementVNode("img", {
                class: vue.normalizeClass(["fqa-cover-img", { "fqa-cover-img-loading": !imgLoaded.value }]),
                crossorigin: "anonymous",
                loading: "lazy",
                referrerpolicy: "no-referrer",
                src: detail.value.cover_url,
                alt: title.value,
                onLoad: _cache[0] || (_cache[0] = ($event) => imgLoaded.value = true),
                onError: _cache[1] || (_cache[1] = ($event) => imgLoaded.value = true)
              }, null, 42, _hoisted_3$3),
              tag.value ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(["fqa-cover-tag", tag.value.cls])
              }, vue.toDisplayString(tag.value.text), 3)) : vue.createCommentVNode("", true),
              progressPercent.value > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$3, [
                vue.createElementVNode("span", {
                  class: "fqa-cover-progress-bar",
                  style: vue.normalizeStyle({ width: progressPercent.value + "%" })
                }, null, 4)
              ])) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", {
              class: "fqa-card-title",
              title: title.value
            }, vue.toDisplayString(title.value), 9, _hoisted_5$3),
            vue.createElementVNode("div", {
              class: "fqa-card-sub",
              title: detail.value.current_chapter_title
            }, vue.toDisplayString(progressText.value), 9, _hoisted_6$3)
          ], 64))
        ], 40, _hoisted_1$3);
      };
    }
  });
  const _hoisted_1$2 = ["aria-label"];
  const _hoisted_2$2 = { class: "fqa-group-cover" };
  const _hoisted_3$2 = { class: "fqa-group-grid" };
  const _hoisted_4$2 = ["src", "alt"];
  const _hoisted_5$2 = ["title"];
  const _hoisted_6$2 = { class: "fqa-card-sub" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookGroupCard",
    props: {
      group: {}
    },
    emits: ["open", "visible"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const previewBooks = vue.computed(() => props.group.books.slice(0, 4));
      const covers = vue.computed(
        () => previewBooks.value.map((entry) => entry.detail).filter((detail) => !!detail)
      );
      const cardRef = vue.ref(null);
      let io = null;
      function request() {
        const pending = previewBooks.value.filter((entry) => !entry.detail);
        if (pending.length) emit("visible", pending);
      }
      vue.onMounted(() => {
        if (typeof IntersectionObserver === "undefined") {
          request();
          return;
        }
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) request();
          },
          { rootMargin: "200px" }
        );
        if (cardRef.value) io.observe(cardRef.value);
      });
      vue.onBeforeUnmount(() => {
        io == null ? void 0 : io.disconnect();
        io = null;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "cardRef",
          ref: cardRef,
          class: "fqa-card",
          role: "button",
          tabindex: "0",
          "aria-label": `分组 ${__props.group.name}`,
          onClick: _cache[0] || (_cache[0] = ($event) => emit("open", __props.group)),
          onKeydown: [
            _cache[1] || (_cache[1] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.group), ["prevent"]), ["enter"])),
            _cache[2] || (_cache[2] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.group), ["prevent"]), ["space"]))
          ]
        }, [
          vue.createElementVNode("div", _hoisted_2$2, [
            vue.createElementVNode("div", _hoisted_3$2, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(covers.value, (detail) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: detail.book_id,
                  class: "fqa-group-cell"
                }, [
                  vue.createElementVNode("img", {
                    crossorigin: "anonymous",
                    loading: "lazy",
                    referrerpolicy: "no-referrer",
                    src: detail.cover_url,
                    alt: detail.title
                  }, null, 8, _hoisted_4$2)
                ]);
              }), 128))
            ])
          ]),
          vue.createElementVNode("div", {
            class: "fqa-card-title",
            title: __props.group.name
          }, vue.toDisplayString(__props.group.name), 9, _hoisted_5$2),
          vue.createElementVNode("div", _hoisted_6$2, "共" + vue.toDisplayString(__props.group.books.length) + "本书", 1)
        ], 40, _hoisted_1$2);
      };
    }
  });
  const SECOND = 1e3;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  function normalizeTimestamp(ts) {
    if (!ts || ts <= 0) return 0;
    return ts < 1e12 ? ts * 1e3 : ts;
  }
  function fromNow(ts) {
    const time = normalizeTimestamp(ts);
    if (!time) return "从未";
    const diff = Date.now() - time;
    if (diff < MINUTE) return "刚刚";
    if (diff < HOUR) return `${Math.floor(diff / MINUTE)}分钟前`;
    if (diff < DAY) return `${Math.floor(diff / HOUR)}小时前`;
    if (diff < MONTH) return `${Math.floor(diff / DAY)}天前`;
    if (diff < YEAR) return `${Math.floor(diff / MONTH)}个月前`;
    return `${Math.floor(diff / YEAR)}年前`;
  }
  function formatDateTime(ts) {
    const time = normalizeTimestamp(ts);
    if (!time) return "未知";
    const d = new Date(time);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  const _hoisted_1$1 = ["title"];
  const _hoisted_2$1 = {
    key: 0,
    class: "fqa-hover-author"
  };
  const _hoisted_3$1 = { class: "fqa-hover-stats" };
  const _hoisted_4$1 = ["title"];
  const _hoisted_5$1 = { class: "fqa-hover-stat-k" };
  const _hoisted_6$1 = { class: "fqa-hover-stat" };
  const _hoisted_7$1 = { class: "fqa-hover-stat-v" };
  const _hoisted_8$1 = { class: "fqa-hover-stat" };
  const _hoisted_9$1 = { class: "fqa-hover-stat-v" };
  const _hoisted_10$1 = { class: "fqa-hover-seg" };
  const _hoisted_11$1 = { class: "fqa-hover-abstract" };
  const _hoisted_12$1 = {
    key: 0,
    class: "fqa-hover-chapter"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookHoverCard",
    props: {
      entry: {},
      x: {},
      y: {},
      height: {},
      visible: { type: Boolean }
    },
    emits: ["panel-enter", "panel-leave"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const detail = vue.computed(() => {
        var _a;
        return ((_a = props.entry) == null ? void 0 : _a.detail) ?? null;
      });
      const item = vue.computed(() => {
        var _a;
        return ((_a = props.entry) == null ? void 0 : _a.item) ?? null;
      });
      const readAt = vue.computed(() => {
        var _a;
        return fromNow((_a = item.value) == null ? void 0 : _a.last_read_timestamp);
      });
      const addedAt = vue.computed(() => {
        var _a;
        return fromNow((_a = item.value) == null ? void 0 : _a.add_shelf_time);
      });
      const updatedAt = vue.computed(() => {
        var _a;
        return fromNow((_a = detail.value) == null ? void 0 : _a.last_chapter_update_time);
      });
      const updatedAtFull = vue.computed(() => {
        var _a;
        return formatDateTime((_a = detail.value) == null ? void 0 : _a.last_chapter_update_time);
      });
      const showUpdateTime = vue.ref(false);
      const latestChapter = vue.computed(() => {
        const d = detail.value;
        if (!d) return "—";
        return d.total_chapter_count ? `${d.total_chapter_count}章` : "—";
      });
      const pickedTab = vue.ref(null);
      const chapterText = vue.computed(() => {
        var _a, _b;
        return ((_b = (_a = detail.value) == null ? void 0 : _a.current_chapter_summary) == null ? void 0 : _b.trim()) ?? "";
      });
      const bookText = vue.computed(() => {
        var _a, _b;
        return ((_b = (_a = detail.value) == null ? void 0 : _a.summary) == null ? void 0 : _b.trim()) ?? "";
      });
      const activeTab = vue.computed(() => {
        if (pickedTab.value) return pickedTab.value;
        return chapterText.value ? "chapter" : "book";
      });
      const abstractText = vue.computed(() => {
        const text = activeTab.value === "chapter" ? chapterText.value : bookText.value;
        return text || "暂无数据";
      });
      vue.watch(
        () => {
          var _a;
          return (_a = props.entry) == null ? void 0 : _a.item.book_id;
        },
        () => {
          pickedTab.value = null;
          showUpdateTime.value = false;
        }
      );
      const root = vue.ref(null);
      const supportsPopover = typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";
      vue.watch(
        () => props.visible && !!detail.value,
        (show) => {
          const el = root.value;
          if (!el || !supportsPopover) return;
          try {
            if (show) el.showPopover();
            else el.hidePopover();
          } catch {
          }
        }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          id: "fqa-bookshelf-hover",
          ref_key: "root",
          ref: root,
          popover: "manual",
          class: vue.normalizeClass({ "fqa-visible": __props.visible && !!detail.value }),
          style: vue.normalizeStyle({ left: __props.x + "px", top: __props.y + "px" }),
          onMouseenter: _cache[4] || (_cache[4] = ($event) => emit("panel-enter")),
          onMouseleave: _cache[5] || (_cache[5] = ($event) => emit("panel-leave"))
        }, [
          detail.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "fqa-hover-inner",
            style: vue.normalizeStyle(__props.height ? { height: __props.height + "px" } : void 0)
          }, [
            vue.createElementVNode("div", {
              class: "fqa-hover-title",
              title: detail.value.title
            }, vue.toDisplayString(detail.value.title), 9, _hoisted_1$1),
            detail.value.author ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, vue.toDisplayString(detail.value.author), 1)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_3$1, [
              vue.createElementVNode("div", {
                class: "fqa-hover-stat",
                onMouseenter: _cache[0] || (_cache[0] = ($event) => showUpdateTime.value = true),
                onMouseleave: _cache[1] || (_cache[1] = ($event) => showUpdateTime.value = false)
              }, [
                vue.createElementVNode("div", {
                  class: "fqa-hover-stat-v",
                  title: updatedAtFull.value
                }, vue.toDisplayString(showUpdateTime.value ? updatedAt.value : latestChapter.value), 9, _hoisted_4$1),
                vue.createElementVNode("div", _hoisted_5$1, vue.toDisplayString(showUpdateTime.value ? "更新于" : "最新章"), 1)
              ], 32),
              vue.createElementVNode("div", _hoisted_6$1, [
                vue.createElementVNode("div", _hoisted_7$1, vue.toDisplayString(readAt.value), 1),
                _cache[6] || (_cache[6] = vue.createElementVNode("div", { class: "fqa-hover-stat-k" }, "阅读过", -1))
              ]),
              vue.createElementVNode("div", _hoisted_8$1, [
                vue.createElementVNode("div", _hoisted_9$1, vue.toDisplayString(addedAt.value), 1),
                _cache[7] || (_cache[7] = vue.createElementVNode("div", { class: "fqa-hover-stat-k" }, "已加入书架", -1))
              ])
            ]),
            vue.createElementVNode("div", _hoisted_10$1, [
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["fqa-hover-seg-btn", { "fqa-hover-seg-active": activeTab.value === "chapter" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => pickedTab.value = "chapter")
              }, " 本章梗概 ", 2),
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["fqa-hover-seg-btn", { "fqa-hover-seg-active": activeTab.value === "book" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => pickedTab.value = "book")
              }, " 全书简介 ", 2)
            ]),
            vue.createElementVNode("div", _hoisted_11$1, [
              activeTab.value === "chapter" && detail.value.current_chapter_title ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_12$1, vue.toDisplayString(detail.value.current_chapter_title), 1)) : vue.createCommentVNode("", true),
              vue.createTextVNode(" " + vue.toDisplayString(abstractText.value), 1)
            ])
          ], 4)) : vue.createCommentVNode("", true)
        ], 38);
      };
    }
  });
  async function getBookshelf() {
    const responses = await Promise.all([
      fetch("https://fanqienovel.com/reading/bookapi/bookshelf/info/v:version/?aid=1967&iid=0&version_code=57700&update_version_code=57700"),
      fetch("https://fanqienovel.com/api/reader/book/progress")
    ]);
    const response = responses[0];
    const response2 = responses[1];
    const data = await response.json();
    const info = data.data.book_shelf_info;
    const data_ = await response2.json();
    const data2 = data_.data;
    const all_items = info.map((item) => item.book_id);
    const response3 = await fetch("https://fanqienovel.com/api/book/simple/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        book_ids: all_items
      })
    });
    const data__ = await response3.json();
    const data3 = data__.data.bookList;
    const results = [];
    for (let i of data.data.book_shelf_info) {
      const progress = data2.find((it) => it.book_id === i.book_id);
      const simple = data3.find((it) => it.book_id === i.book_id);
      const item = {
        book_id: i.book_id,
        last_operate_time: progress ? progress.read_timestamp : i.last_operate_time,
        add_shelf_time: i.add_shelf_time,
        group_name: i.group_name,
        last_read_timestamp: progress ? progress.read_timestamp : 0,
        last_read_chapter_id: progress ? progress.item_id : "0",
        is_publish: (simple == null ? void 0 : simple.genre) === "6"
      };
      results.push(item);
    }
    return results;
  }
  async function multidetail(books) {
    const response = await fetch("https://fanqienovel.com/api/bookshelf/multidetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        books: books.map((book) => {
          return {
            book_id: book.book_id,
            item_id: book.last_read_chapter_id
          };
        })
      })
    });
    const data = await response.json();
    const list = data.data.detail_list;
    const results = [];
    for (let i of list) {
      const item = {
        book_id: i.book_id,
        summary: i.abstract,
        title: i.book_name,
        author: i.author_name,
        cover_url: i.thumb_url,
        current_chapter_title: i.item_show_title,
        current_chapter_id: i.item_id,
        current_chapter_order: i.real_chapter_order,
        total_chapter_count: i.serial_count,
        last_chapter_update_time: i.last_chapter_update_time * 1e3,
        last_chapter_id: i.last_chapter_item_id,
        current_chapter_summary: i.item_abstract,
        // last_chapter_title: i.last_chapter_show_title,
        status: i.update_stop === "1" ? 4 : i.creation_status,
        update_status: i.update_status
      };
      results.push(item);
    }
    return results;
  }
  const DETAIL_BATCH_SIZE = 20;
  const PAGE_SIZE = 24;
  const TABS = [
    { key: "all", label: "全部" },
    { key: "group", label: "分组" },
    { key: "publish", label: "出版" }
  ];
  function useBookshelf() {
    const entries = vue.ref([]);
    const loading = vue.ref(false);
    const detailLoading = vue.ref(false);
    const error = vue.ref(null);
    let loadToken = 0;
    let detailCache = /* @__PURE__ */ new Map();
    let inflight = /* @__PURE__ */ new Set();
    function applyDetails(details) {
      if (!details.length) return;
      const byId = new Map(details.map((d) => [d.book_id, d]));
      entries.value = entries.value.map((entry) => {
        const detail = byId.get(entry.item.book_id);
        return detail ? { ...entry, detail } : entry;
      });
    }
    async function ensureDetails(items) {
      const token = loadToken;
      const pending = items.filter(
        (item) => !detailCache.has(item.book_id) && !inflight.has(item.book_id)
      );
      if (!pending.length) return;
      pending.forEach((item) => inflight.add(item.book_id));
      detailLoading.value = true;
      try {
        for (const batch of chunk(pending, DETAIL_BATCH_SIZE)) {
          if (token !== loadToken) return;
          try {
            const details = await multidetail(batch);
            if (token !== loadToken) return;
            details.forEach((d) => detailCache.set(d.book_id, d));
            applyDetails(details);
          } catch (err) {
            console.error("[fqa:bookshelf] 加载书籍详情失败:", err);
          }
        }
      } finally {
        pending.forEach((item) => inflight.delete(item.book_id));
        if (token === loadToken && inflight.size === 0) detailLoading.value = false;
      }
    }
    async function load(force = false) {
      const token = ++loadToken;
      inflight.clear();
      if (force) detailCache = /* @__PURE__ */ new Map();
      loading.value = true;
      error.value = null;
      try {
        const items = await getBookshelf();
        if (token !== loadToken) return;
        items.sort((a, b) => b.last_operate_time - a.last_operate_time);
        entries.value = items.map((item) => ({
          item,
          detail: detailCache.get(item.book_id) ?? null
        }));
        loading.value = false;
      } catch (err) {
        if (token !== loadToken) return;
        console.error("[fqa:bookshelf] 加载书架失败:", err);
        error.value = err instanceof Error ? err.message : String(err);
        loading.value = false;
      }
    }
    const groups = vue.computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const entry of entries.value) {
        const name2 = entry.item.group_name;
        if (!name2) continue;
        let group = map.get(name2);
        if (!group) {
          group = { name: name2, books: [], last_operate_time: 0 };
          map.set(name2, group);
        }
        group.books.push(entry);
        group.last_operate_time = Math.max(group.last_operate_time, entry.item.last_operate_time);
      }
      return [...map.values()].sort((a, b) => b.last_operate_time - a.last_operate_time);
    });
    const allCells = vue.computed(() => {
      const sortable = [];
      for (const entry of entries.value) {
        if (entry.item.group_name) continue;
        sortable.push({
          time: entry.item.last_operate_time,
          cell: { kind: "book", key: `book:${entry.item.book_id}`, entry }
        });
      }
      for (const group of groups.value) {
        sortable.push({
          time: group.last_operate_time,
          cell: { kind: "group", key: `group:${group.name}`, group }
        });
      }
      return sortable.sort((a, b) => b.time - a.time).map((s) => s.cell);
    });
    const groupCells = vue.computed(
      () => groups.value.map((group) => ({ kind: "group", key: `group:${group.name}`, group }))
    );
    const publishCells = vue.computed(
      () => entries.value.filter((entry) => entry.item.is_publish).map((entry) => ({ kind: "book", key: `book:${entry.item.book_id}`, entry }))
    );
    const counts = vue.computed(() => ({
      all: entries.value.length,
      group: groups.value.length,
      publish: entries.value.filter((entry) => entry.item.is_publish).length
    }));
    function cellsOf(tab) {
      if (tab === "group") return groupCells.value;
      if (tab === "publish") return publishCells.value;
      return allCells.value;
    }
    function findGroup(name2) {
      return groups.value.find((group) => group.name === name2) ?? null;
    }
    return {
      entries,
      loading,
      detailLoading,
      error,
      groups,
      counts,
      load,
      ensureDetails,
      cellsOf,
      findGroup,
      PAGE_SIZE
    };
  }
  const _hoisted_1 = { id: "fqa-bookshelf" };
  const _hoisted_2 = { class: "fqa-bs-header" };
  const _hoisted_3 = { class: "fqa-bs-actions" };
  const _hoisted_4 = { key: 0 };
  const _hoisted_5 = ["disabled"];
  const _hoisted_6 = ["aria-selected", "onClick", "onKeydown"];
  const _hoisted_7 = { class: "fqa-tab-count" };
  const _hoisted_8 = {
    key: 0,
    class: "fqa-groupbar"
  };
  const _hoisted_9 = { class: "fqa-groupbar-name" };
  const _hoisted_10 = { class: "fqa-groupbar-count" };
  const _hoisted_11 = {
    key: 1,
    class: "fqa-status"
  };
  const _hoisted_12 = {
    key: 2,
    class: "fqa-status"
  };
  const _hoisted_13 = { class: "fqa-status-title" };
  const _hoisted_14 = { class: "fqa-grid" };
  const HOVER_DELAY = 300;
  const HIDE_DELAY = 160;
  const HOVER_WIDTH = 280;
  const HOVER_GAP = 12;
  const VIEWPORT_MARGIN = 8;
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "BookshelfView",
    setup(__props) {
      const { loading, detailLoading, error, counts, load, ensureDetails, cellsOf, findGroup, PAGE_SIZE: PAGE_SIZE2 } = useBookshelf();
      const activeTab = vue.ref("all");
      const openedGroupName = vue.ref(null);
      const tabsRef = vue.ref(null);
      const inkStyle = vue.ref({ left: "0px", width: "0px" });
      const hoverEntry = vue.ref(null);
      const hoverVisible = vue.ref(false);
      const hoverPos = vue.ref({ x: 0, y: 0 });
      const hoverHeight = vue.ref(0);
      let hoverTimer;
      let hideTimer;
      let hoverAnchor = null;
      const pointerInPanel = vue.ref(false);
      const openedGroup = vue.computed(
        () => openedGroupName.value ? findGroup(openedGroupName.value) : null
      );
      const allCells = vue.computed(() => {
        const group = openedGroup.value;
        if (group) {
          return group.books.map((entry) => ({
            kind: "book",
            key: `book:${entry.item.book_id}`,
            entry
          }));
        }
        return cellsOf(activeTab.value);
      });
      const visibleCount = vue.ref(PAGE_SIZE2);
      const cells = vue.computed(() => allCells.value.slice(0, visibleCount.value));
      const hasMore = vue.computed(() => visibleCount.value < allCells.value.length);
      const sentinel = vue.ref(null);
      let pageObserver = null;
      function resetPaging() {
        visibleCount.value = PAGE_SIZE2;
      }
      async function refresh() {
        resetPaging();
        await load(true);
      }
      vue.watch([activeTab, openedGroupName], resetPaging);
      const isEmpty = vue.computed(() => !loading.value && !error.value && allCells.value.length === 0);
      const emptyText = vue.computed(() => {
        if (openedGroup.value) return "这个分组还没有书";
        if (activeTab.value === "group") return "还没有创建任何分组";
        if (activeTab.value === "publish") return "书架里还没有出版物";
        return "书架空空如也，去首页找几本书看看吧";
      });
      function updateInk() {
        const wrap = tabsRef.value;
        if (!wrap) return;
        const index = TABS.findIndex((tab) => tab.key === activeTab.value);
        const el = wrap.querySelectorAll(".fqa-tab")[index];
        if (!el) return;
        inkStyle.value = {
          left: `${el.offsetLeft}px`,
          width: `${el.offsetWidth}px`
        };
      }
      function selectTab(key) {
        openedGroupName.value = null;
        activeTab.value = key;
        hideHover(true);
      }
      vue.watch(activeTab, () => vue.nextTick(updateInk));
      vue.watch(counts, () => vue.nextTick(updateInk), { deep: true });
      function computePosition(el) {
        const cover = el.querySelector(".fqa-cover") ?? el;
        const rect = cover.getBoundingClientRect();
        let x = rect.right + HOVER_GAP;
        if (x + HOVER_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
          x = rect.left - HOVER_WIDTH - HOVER_GAP;
        }
        x = Math.max(VIEWPORT_MARGIN, Math.min(x, window.innerWidth - HOVER_WIDTH - VIEWPORT_MARGIN));
        const topLimit = VIEWPORT_MARGIN;
        const bottomLimit = window.innerHeight - VIEWPORT_MARGIN;
        const height = Math.min(rect.height, bottomLimit - topLimit);
        const y = Math.max(topLimit, Math.min(rect.top, bottomLimit - height));
        hoverHeight.value = height;
        hoverPos.value = { x, y };
      }
      function onCardHover({ entry, el }) {
        if (hoverTimer) clearTimeout(hoverTimer);
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = void 0;
        }
        if (!entry.detail) return;
        hoverAnchor = el;
        if (hoverVisible.value && hoverEntry.value !== entry) {
          computePosition(el);
          hoverEntry.value = entry;
          return;
        }
        hoverTimer = setTimeout(() => {
          hoverTimer = void 0;
          computePosition(el);
          hoverEntry.value = entry;
          hoverVisible.value = true;
        }, HOVER_DELAY);
      }
      function scheduleHide() {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = void 0;
        }
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          hideTimer = void 0;
          if (!pointerInPanel.value) hideHover(true);
        }, HIDE_DELAY);
      }
      function hideHover(immediate = false) {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = void 0;
        }
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = void 0;
        }
        pointerInPanel.value = false;
        hoverAnchor = null;
        hoverVisible.value = false;
        if (immediate) hoverEntry.value = null;
      }
      function onPanelEnter() {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = void 0;
        }
        pointerInPanel.value = true;
      }
      function onPanelLeave() {
        pointerInPanel.value = false;
        scheduleHide();
      }
      let pendingItems = [];
      let flushTimer;
      function queueDetails(entries) {
        const pending = entries.filter((entry) => !entry.detail);
        if (!pending.length) return;
        pendingItems.push(...pending.map((entry) => entry.item));
        if (flushTimer) return;
        flushTimer = setTimeout(() => {
          flushTimer = void 0;
          const batch = pendingItems;
          pendingItems = [];
          void ensureDetails(batch);
        }, 50);
      }
      function onCardVisible(entry) {
        queueDetails([entry]);
      }
      function onGroupVisible(entries) {
        queueDetails(entries);
      }
      function openBook(entry) {
        var _a;
        hideHover(true);
        const chapterId = ((_a = entry.detail) == null ? void 0 : _a.current_chapter_id) || entry.item.last_read_chapter_id;
        const url = chapterId && chapterId !== "0" ? `https://fanqienovel.com/reader/${chapterId}` : `https://fanqienovel.com/page/${entry.item.book_id}`;
        unsafeWindow.location.href = url;
      }
      function openGroup(group) {
        hideHover(true);
        openedGroupName.value = group.name;
      }
      function backToList() {
        openedGroupName.value = null;
        hideHover(true);
      }
      function onScrollOrResize() {
        if (hoverAnchor && (hoverVisible.value || hoverTimer)) {
          if (hoverAnchor.isConnected) {
            computePosition(hoverAnchor);
          } else {
            hideHover(true);
          }
        }
        updateInk();
      }
      vue.onMounted(async () => {
        await load();
        await vue.nextTick();
        updateInk();
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        if (typeof IntersectionObserver !== "undefined") {
          pageObserver = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting) && hasMore.value) {
                visibleCount.value += PAGE_SIZE2;
              }
            },
            { rootMargin: "400px" }
          );
          vue.watch(
            sentinel,
            (el) => {
              pageObserver == null ? void 0 : pageObserver.disconnect();
              if (el) pageObserver == null ? void 0 : pageObserver.observe(el);
            },
            { immediate: true }
          );
        }
      });
      vue.onBeforeUnmount(() => {
        if (hoverTimer) clearTimeout(hoverTimer);
        if (hideTimer) clearTimeout(hideTimer);
        if (flushTimer) clearTimeout(flushTimer);
        pageObserver == null ? void 0 : pageObserver.disconnect();
        pageObserver = null;
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            _cache[0] || (_cache[0] = vue.createElementVNode("div", { class: "fqa-bs-title" }, "我的书架", -1)),
            vue.createElementVNode("div", _hoisted_3, [
              vue.unref(detailLoading) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, "正在补全详情…")) : vue.createCommentVNode("", true),
              vue.createElementVNode("button", {
                class: "fqa-btn",
                disabled: vue.unref(loading),
                onClick: refresh
              }, vue.toDisplayString(vue.unref(loading) ? "刷新中…" : "刷新"), 9, _hoisted_5)
            ])
          ]),
          vue.createElementVNode("div", {
            ref_key: "tabsRef",
            ref: tabsRef,
            class: "fqa-tabs",
            role: "tablist"
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(TABS), (tab) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: tab.key,
                class: vue.normalizeClass(["fqa-tab", { "fqa-tab-active": activeTab.value === tab.key }]),
                role: "tab",
                tabindex: "0",
                "aria-selected": activeTab.value === tab.key,
                onClick: ($event) => selectTab(tab.key),
                onKeydown: vue.withKeys(vue.withModifiers(($event) => selectTab(tab.key), ["prevent"]), ["enter"])
              }, [
                vue.createTextVNode(vue.toDisplayString(tab.label), 1),
                vue.createElementVNode("span", _hoisted_7, vue.toDisplayString(vue.unref(counts)[tab.key]), 1)
              ], 42, _hoisted_6);
            }), 128)),
            vue.createElementVNode("span", {
              class: "fqa-tab-ink",
              style: vue.normalizeStyle(inkStyle.value)
            }, null, 4)
          ], 512),
          openedGroup.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
            vue.createElementVNode("button", {
              class: "fqa-btn",
              onClick: backToList
            }, "← 返回"),
            vue.createElementVNode("span", _hoisted_9, vue.toDisplayString(openedGroup.value.name), 1),
            vue.createElementVNode("span", _hoisted_10, "共" + vue.toDisplayString(openedGroup.value.books.length) + "本书", 1)
          ])) : vue.createCommentVNode("", true),
          vue.unref(error) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
            _cache[1] || (_cache[1] = vue.createElementVNode("div", { class: "fqa-status-title" }, "书架加载失败", -1)),
            vue.createElementVNode("div", null, vue.toDisplayString(vue.unref(error)), 1),
            vue.createElementVNode("button", {
              class: "fqa-btn",
              onClick: refresh
            }, "重试")
          ])) : isEmpty.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [
            vue.createElementVNode("div", _hoisted_13, vue.toDisplayString(emptyText.value), 1)
          ])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
            vue.createElementVNode("div", _hoisted_14, [
              vue.unref(loading) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(8, (n) => {
                return vue.createElementVNode("div", {
                  key: `sk-${n}`,
                  class: "fqa-card"
                }, [..._cache[2] || (_cache[2] = [
                  vue.createElementVNode("div", { class: "fqa-sk-cover fqa-sk-anim" }, null, -1),
                  vue.createElementVNode("div", {
                    class: "fqa-sk-line fqa-sk-anim",
                    style: { "width": "90%" }
                  }, null, -1),
                  vue.createElementVNode("div", {
                    class: "fqa-sk-line fqa-sk-anim",
                    style: { "width": "55%" }
                  }, null, -1)
                ])]);
              }), 64)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(cells.value, (cell) => {
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                  key: cell.key
                }, [
                  cell.kind === "book" ? (vue.openBlock(), vue.createBlock(_sfc_main$3, {
                    key: 0,
                    entry: cell.entry,
                    onHover: onCardHover,
                    onLeave: scheduleHide,
                    onOpen: openBook,
                    onVisible: onCardVisible
                  }, null, 8, ["entry"])) : (vue.openBlock(), vue.createBlock(_sfc_main$2, {
                    key: 1,
                    group: cell.group,
                    onOpen: openGroup,
                    onVisible: onGroupVisible
                  }, null, 8, ["group"]))
                ], 64);
              }), 128))
            ]),
            !vue.unref(loading) && hasMore.value ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              ref_key: "sentinel",
              ref: sentinel,
              class: "fqa-loadmore"
            }, "加载中…", 512)) : vue.createCommentVNode("", true)
          ], 64)),
          (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
            vue.createVNode(_sfc_main$1, {
              entry: hoverEntry.value,
              x: hoverPos.value.x,
              y: hoverPos.value.y,
              height: hoverHeight.value,
              visible: hoverVisible.value,
              onPanelEnter,
              onPanelLeave
            }, null, 8, ["entry", "x", "y", "height", "visible"])
          ]))
        ]);
      };
    }
  });
  const bookshelfcss = "#fqa-bookshelf {\n    --fqa-text: #1f2329;\n    --fqa-text-sub: #646a73;\n    --fqa-text-weak: #8f959e;\n    --fqa-border: rgba(31, 35, 41, 0.08);\n    --fqa-hover: rgba(31, 35, 41, 0.04);\n    --fqa-accent: #ff6f3d;\n    --fqa-skeleton: rgba(31, 35, 41, 0.06);\n    --fqa-skeleton-hl: rgba(31, 35, 41, 0.12);\n    --fqa-shadow: 0 4px 16px rgba(31, 35, 41, 0.08);\n\n    display: block;\n    box-sizing: border-box;\n    width: 100%;\n    max-width: 1100px;\n    margin: 0 auto;\n    /* 顶部留出原站 fixed 顶栏（80px）的高度，否则标题和 tab 会被压在下面 */\n    padding: calc(80px + 24px) 16px 64px;\n    color: var(--fqa-text);\n    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n        sans-serif;\n}\n\n#fqa-bookshelf *,\n#fqa-bookshelf *::before,\n#fqa-bookshelf *::after {\n    box-sizing: border-box;\n}\n\n#fqa-bookshelf div,\n#fqa-bookshelf span,\n#fqa-bookshelf h1,\n#fqa-bookshelf ul,\n#fqa-bookshelf li {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    list-style: none;\n    float: none;\n    position: static;\n}\n\n/* ------------------------------ 顶部 / Tabs ------------------------------ */\n\n#fqa-bookshelf .fqa-bs-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 16px;\n    margin-bottom: 8px;\n}\n\n#fqa-bookshelf .fqa-bs-title {\n    font-size: 24px;\n    font-weight: 600;\n    line-height: 1.4;\n}\n\n#fqa-bookshelf .fqa-bs-actions {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    font-size: 13px;\n    color: var(--fqa-text-weak);\n}\n\n#fqa-bookshelf .fqa-btn {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 6px 14px;\n    border: 1px solid var(--fqa-border);\n    border-radius: 999px;\n    background: transparent;\n    color: var(--fqa-text-sub);\n    font-size: 13px;\n    font-family: inherit;\n    line-height: 1.4;\n    cursor: pointer;\n    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;\n}\n\n#fqa-bookshelf .fqa-btn:hover:not(:disabled) {\n    border-color: var(--fqa-accent);\n    color: var(--fqa-accent);\n    background: rgba(255, 111, 61, 0.06);\n}\n\n#fqa-bookshelf .fqa-btn:disabled {\n    opacity: 0.5;\n    cursor: default;\n}\n\n#fqa-bookshelf .fqa-tabs {\n    position: relative;\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    margin-bottom: 24px;\n    border-bottom: 1px solid var(--fqa-border);\n}\n\n#fqa-bookshelf .fqa-tab {\n    padding: 10px 16px;\n    color: var(--fqa-text-sub);\n    font-size: 15px;\n    line-height: 22px;\n    cursor: pointer;\n    user-select: none;\n    transition: color 0.15s ease;\n}\n\n#fqa-bookshelf .fqa-tab:hover {\n    color: var(--fqa-text);\n}\n\n#fqa-bookshelf .fqa-tab-active {\n    color: var(--fqa-accent);\n    font-weight: 600;\n}\n\n#fqa-bookshelf .fqa-tab-count {\n    margin-left: 4px;\n    font-size: 12px;\n    font-weight: 400;\n    color: var(--fqa-text-weak);\n}\n\n#fqa-bookshelf .fqa-tab-ink {\n    position: absolute;\n    bottom: -1px;\n    left: 0;\n    width: 0;\n    height: 2px;\n    border-radius: 2px;\n    background: var(--fqa-accent);\n    transition: left 0.25s ease, width 0.25s ease;\n}\n\n/* ------------------------------- 书架网格 ------------------------------- */\n\n/* 原站一排最多 4 本；窄屏逐级降到 3 / 2 */\n#fqa-bookshelf .fqa-grid {\n    display: grid;\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    gap: 28px 24px;\n    align-items: start;\n}\n\n@media (max-width: 900px) {\n    #fqa-bookshelf .fqa-grid {\n        grid-template-columns: repeat(3, minmax(0, 1fr));\n    }\n}\n\n@media (max-width: 600px) {\n    #fqa-bookshelf .fqa-grid {\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n    }\n}\n\n#fqa-bookshelf .fqa-card {\n    display: block;\n    border-radius: 8px;\n    cursor: pointer;\n    outline: none;\n}\n\n#fqa-bookshelf .fqa-card:focus-visible {\n    box-shadow: 0 0 0 2px var(--fqa-accent);\n}\n\n/* 封面：3:4，靠 aspect-ratio 定高，内部元素绝对定位 */\n#fqa-bookshelf .fqa-cover {\n    position: relative;\n    display: block;\n    width: 100%;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    overflow: hidden;\n    background: var(--fqa-skeleton);\n    transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n#fqa-bookshelf .fqa-card:hover .fqa-cover {\n    transform: translateY(-4px);\n    box-shadow: var(--fqa-shadow);\n}\n\n#fqa-bookshelf .fqa-cover-img {\n    position: absolute;\n    inset: 0;\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    transition: opacity 0.25s ease;\n}\n\n#fqa-bookshelf .fqa-cover-img-loading {\n    opacity: 0;\n}\n\n#fqa-bookshelf .fqa-cover-tag {\n    position: absolute;\n    top: 0;\n    right: 0;\n    z-index: 2;\n    padding: 2px 6px;\n    border-radius: 0 6px 0 6px;\n    background: var(--fqa-accent);\n    color: #fff;\n    font-size: 11px;\n    line-height: 16px;\n    font-weight: 500;\n    white-space: nowrap;\n}\n\n/* 连载 / 完结 / 断更共用：灰底，弱化于“更新”角标 */\n#fqa-bookshelf .fqa-cover-tag-gray {\n    background: rgba(31, 35, 41, 0.55);\n}\n\n@media (prefers-color-scheme: dark) {\n    #fqa-bookshelf .fqa-cover-tag-gray {\n        background: rgba(0, 0, 0, 0.6);\n    }\n}\n\n#fqa-bookshelf .fqa-cover-progress {\n    position: absolute;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 2;\n    height: 3px;\n    background: rgba(255, 255, 255, 0.35);\n}\n\n#fqa-bookshelf .fqa-cover-progress-bar {\n    display: block;\n    height: 100%;\n    background: var(--fqa-accent);\n    transition: width 0.3s ease;\n}\n\n/* 文字区：与封面同为普通流元素，不会重叠 */\n#fqa-bookshelf .fqa-card-title {\n    display: -webkit-box;\n    margin-top: 8px;\n    color: var(--fqa-text);\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: 500;\n    -webkit-line-clamp: 2;\n    line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n    word-break: break-all;\n}\n\n#fqa-bookshelf .fqa-card-sub {\n    margin-top: 4px;\n    color: var(--fqa-text-weak);\n    font-size: 12px;\n    line-height: 18px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* ------------------------------- 分组卡片 ------------------------------- */\n\n#fqa-bookshelf .fqa-group-cover {\n    position: relative;\n    display: block;\n    width: 100%;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    overflow: hidden;\n    background: linear-gradient(135deg, rgba(255, 111, 61, 0.12), rgba(78, 131, 253, 0.12));\n    transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n#fqa-bookshelf .fqa-card:hover .fqa-group-cover {\n    transform: translateY(-4px);\n    box-shadow: var(--fqa-shadow);\n}\n\n#fqa-bookshelf .fqa-group-grid {\n    position: absolute;\n    inset: 0;\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr 1fr;\n    gap: 4px;\n    padding: 6px;\n}\n\n#fqa-bookshelf .fqa-group-cell {\n    position: relative;\n    border-radius: 3px;\n    overflow: hidden;\n    background: rgba(31, 35, 41, 0.06);\n}\n\n#fqa-bookshelf .fqa-group-cell img {\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n}\n\n/* 分组详情返回条 */\n\n#fqa-bookshelf .fqa-groupbar {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    margin-bottom: 16px;\n}\n\n#fqa-bookshelf .fqa-groupbar-name {\n    font-size: 16px;\n    font-weight: 600;\n}\n\n#fqa-bookshelf .fqa-groupbar-count {\n    color: var(--fqa-text-weak);\n    font-size: 13px;\n}\n\n/* --------------------------- hover 详情浮层 --------------------------- */\n\n/*\n * 用 popover 进入浏览器顶层，不参与页面 z-index 竞争，\n * 因此不会被相邻卡片或原站的层叠上下文盖住。z-index 仅作降级保险。\n */\n#fqa-bookshelf-hover {\n    position: fixed;\n    z-index: 2147483000;\n    /* 容器本身透传，只有内部卡片接收事件，避免空白区挡住下层 */\n    pointer-events: none;\n    opacity: 0;\n    transform: translateY(4px);\n    /* allow-discrete：顶层元素从 display:none 切入时也能播放淡入 */\n    transition: opacity 0.16s ease, transform 0.16s ease, display 0.16s allow-discrete;\n    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n        sans-serif;\n}\n\n/* popover 默认带边框/内边距/居中定位，全部清掉，改由 left/top 控制 */\n#fqa-bookshelf-hover:popover-open,\n#fqa-bookshelf-hover[popover] {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    background: transparent;\n    overflow: visible;\n    inset: auto;\n    width: auto;\n    height: auto;\n    max-width: none;\n    max-height: none;\n    color: inherit;\n}\n\n#fqa-bookshelf-hover::backdrop {\n    background: transparent;\n}\n\n#fqa-bookshelf-hover.fqa-visible {\n    opacity: 1;\n    transform: translateY(0);\n}\n\n@starting-style {\n    #fqa-bookshelf-hover.fqa-visible {\n        opacity: 0;\n        transform: translateY(4px);\n    }\n}\n\n/* 高度由 JS 按封面尺寸设定；纵向 flex 让简介吃掉剩余空间 */\n#fqa-bookshelf-hover .fqa-hover-inner {\n    display: flex;\n    flex-direction: column;\n    box-sizing: border-box;\n    width: 280px;\n    padding: 12px 14px;\n    border-radius: 10px;\n    background: #fff;\n    box-shadow: 0 8px 32px rgba(31, 35, 41, 0.16);\n    color: #1f2329;\n    overflow: hidden;\n    /* 卡片可交互：鼠标可以移进来而不触发收起 */\n    pointer-events: auto;\n}\n\n#fqa-bookshelf-hover .fqa-hover-title {\n    flex: none;\n    margin: 0;\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: 600;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-bookshelf-hover .fqa-hover-author {\n    flex: none;\n    margin-top: 2px;\n    color: #8f959e;\n    font-size: 12px;\n    line-height: 17px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stats {\n    display: flex;\n    flex: none;\n    margin-top: 10px;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat {\n    flex: 1 1 0;\n    min-width: 0;\n    padding: 0 6px;\n    text-align: center;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat:first-child {\n    padding-left: 0;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat:last-child {\n    padding-right: 0;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat + .fqa-hover-stat {\n    border-left: 1px solid rgba(31, 35, 41, 0.08);\n}\n\n/* 第一栏可悬停切换为更新时间，给个可交互提示 */\n#fqa-bookshelf-hover .fqa-hover-stat:first-child {\n    border-radius: 4px;\n    cursor: default;\n    transition: background 0.15s ease;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat:first-child:hover {\n    background: rgba(31, 35, 41, 0.05);\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat-v {\n    font-size: 13px;\n    line-height: 18px;\n    font-weight: 600;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat-k {\n    margin-top: 1px;\n    color: #8f959e;\n    font-size: 11px;\n    line-height: 16px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* 梗概 / 简介 双栏切换 */\n#fqa-bookshelf-hover .fqa-hover-seg {\n    display: flex;\n    flex: none;\n    gap: 4px;\n    margin-top: 10px;\n    padding-top: 10px;\n    border-top: 1px solid rgba(31, 35, 41, 0.08);\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-btn {\n    flex: 1 1 0;\n    padding: 4px 0;\n    border: 0;\n    border-radius: 5px;\n    background: rgba(31, 35, 41, 0.05);\n    color: #646a73;\n    font-family: inherit;\n    font-size: 12px;\n    line-height: 18px;\n    cursor: pointer;\n    transition: background 0.15s ease, color 0.15s ease;\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-btn:hover {\n    color: #1f2329;\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-active {\n    background: rgba(255, 111, 61, 0.12);\n    color: #ff6f3d;\n    font-weight: 500;\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-active:hover {\n    color: #ff6f3d;\n}\n\n/*\n * 撑满剩余高度。行数不再写死，由容器高度自然裁切；\n * min-height:0 让 flex 子项允许被压缩，否则 overflow 不生效。\n */\n#fqa-bookshelf-hover .fqa-hover-abstract {\n    flex: 1 1 auto;\n    min-height: 0;\n    margin-top: 8px;\n    color: #646a73;\n    font-size: 12px;\n    line-height: 18px;\n    overflow-y: auto;\n    overscroll-behavior: contain;\n}\n\n#fqa-bookshelf-hover .fqa-hover-abstract::-webkit-scrollbar {\n    width: 4px;\n}\n\n#fqa-bookshelf-hover .fqa-hover-abstract::-webkit-scrollbar-thumb {\n    border-radius: 2px;\n    background: rgba(31, 35, 41, 0.18);\n}\n\n\n#fqa-bookshelf-hover .fqa-hover-chapter {\n    display: block;\n    margin-bottom: 1px;\n    color: #1f2329;\n    font-weight: 500;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* ------------------------------- 骨架屏 ------------------------------- */\n\n#fqa-bookshelf .fqa-sk-cover {\n    display: block;\n    width: 100%;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    background: var(--fqa-skeleton);\n}\n\n#fqa-bookshelf .fqa-sk-line {\n    height: 12px;\n    margin-top: 8px;\n    border-radius: 4px;\n    background: var(--fqa-skeleton);\n}\n\n#fqa-bookshelf .fqa-sk-anim {\n    position: relative;\n    overflow: hidden;\n}\n\n#fqa-bookshelf .fqa-sk-anim::after {\n    content: '';\n    position: absolute;\n    inset: 0;\n    transform: translateX(-100%);\n    background: linear-gradient(90deg, transparent, var(--fqa-skeleton-hl), transparent);\n    animation: fqa-shimmer 1.4s infinite;\n}\n\n@keyframes fqa-shimmer {\n    100% {\n        transform: translateX(100%);\n    }\n}\n\n/* --------------------------- 空态 / 错误态 --------------------------- */\n\n#fqa-bookshelf .fqa-loadmore {\n    padding: 24px 0;\n    text-align: center;\n    color: var(--fqa-text-weak);\n    font-size: 13px;\n}\n\n#fqa-bookshelf .fqa-status {\n    padding: 80px 16px;\n    text-align: center;\n    color: var(--fqa-text-weak);\n    font-size: 14px;\n    line-height: 22px;\n}\n\n#fqa-bookshelf .fqa-status-title {\n    margin-bottom: 8px;\n    color: var(--fqa-text);\n    font-size: 16px;\n    font-weight: 500;\n}\n\n#fqa-bookshelf .fqa-status .fqa-btn {\n    margin-top: 16px;\n}\n\n/* ------------------------------- 深色模式 ------------------------------- */\n\n@media (prefers-color-scheme: dark) {\n    #fqa-bookshelf {\n        --fqa-text: #e6e6e6;\n        --fqa-text-sub: #a6a6a6;\n        --fqa-text-weak: #7a7a7a;\n        --fqa-border: rgba(255, 255, 255, 0.1);\n        --fqa-hover: rgba(255, 255, 255, 0.06);\n        --fqa-skeleton: rgba(255, 255, 255, 0.08);\n        --fqa-skeleton-hl: rgba(255, 255, 255, 0.14);\n        --fqa-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-inner {\n        background: #212125;\n        color: #e6e6e6;\n        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-chapter {\n        color: #e6e6e6;\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-abstract {\n        color: #a6a6a6;\n        border-top-color: rgba(255, 255, 255, 0.1);\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-stat + .fqa-hover-stat {\n        border-left-color: rgba(255, 255, 255, 0.1);\n    }\n}\n";
  const CONTAINER_ID = "fqa-bookshelf-root";
  const STYLE_ID = "fqa-bookshelf-style";
  const ORIGIN_SELECTOR = ".muye-bookshelf, .muye-bookshelf-home-page, .bookshelf-tabs";
  let app = null;
  let container = null;
  let observer = null;
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = bookshelfcss;
    document.head.appendChild(style);
  }
  function hideOrigin(root = document) {
    root.querySelectorAll(ORIGIN_SELECTOR).forEach((el) => {
      if (el.id === CONTAINER_ID || el.closest(`#${CONTAINER_ID}`)) return;
      el.classList.add("fqa-hide");
    });
  }
  function isBookshelfPath(path) {
    return path.startsWith("/bookshelf");
  }
  function unmount() {
    var _a;
    observer == null ? void 0 : observer.disconnect();
    observer = null;
    app == null ? void 0 : app.unmount();
    app = null;
    container == null ? void 0 : container.remove();
    container = null;
    (_a = document.getElementById("fqa-bookshelf-hover")) == null ? void 0 : _a.remove();
    document.querySelectorAll(ORIGIN_SELECTOR).forEach((el) => {
      el.classList.remove("fqa-hide");
    });
  }
  async function mainHook(_previous) {
    if (!isBookshelfPath(window.location.pathname)) {
      unmount();
      return;
    }
    if (app) {
      hideOrigin();
      return;
    }
    injectStyle();
    const origin = await waitForElement(ORIGIN_SELECTOR);
    if (!isBookshelfPath(window.location.pathname)) return;
    if (app) return;
    hideOrigin();
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    const anchor = origin ?? document.querySelector("#root") ?? document.body;
    if (origin == null ? void 0 : origin.parentElement) {
      origin.insertAdjacentElement("beforebegin", container);
    } else {
      anchor.appendChild(container);
    }
    app = vue.createApp(_sfc_main);
    app.config.errorHandler = (err, _instance, info) => {
      console.error(`[fqa:bookshelf] Vue error (${info}):`, err);
    };
    app.mount(container);
    console.log("[fqa:bookshelf] 书架视图已挂载");
    document.title = "我的书架 - 番茄小说";
    observer = new MutationObserver((mutations) => {
      var _a;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.id === CONTAINER_ID || node.closest(`#${CONTAINER_ID}`)) continue;
          if ((_a = node.matches) == null ? void 0 : _a.call(node, ORIGIN_SELECTOR)) {
            node.classList.add("fqa-hide");
          } else {
            hideOrigin(node);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function filter(path, _query, _hash) {
    return isBookshelfPath(path) || !!app;
  }
  const _exports = [
    {
      id: "bookshelfHook_onload",
      event: "load",
      filter,
      handler: mainHook
    },
    {
      id: "bookshelfHook_onurlchange",
      event: "onUrlChange",
      filter,
      handler: mainHook
    }
  ];
  const hooks = [
    ..._exports$3,
    ..._exports$2,
    ..._exports$1,
    ..._exports
  ];
  async function onEvent(event, previous) {
    console.log(`onEvent, event: ${event}, previous: ${previous}`);
    const path = window.location.pathname;
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const tasks = [];
    for (const hook of hooks) {
      if (hook.event === event && hook.filter(path, params, hash)) {
        tasks.push(async () => {
          try {
            await hook.handler(previous);
          } catch (err) {
            console.error(`[hook:${hook.id}] handler failed:`, err);
          }
        });
      }
    }
    console.log(`tasks: `, tasks);
    if (tasks.length > 0) {
      await Promise.allSettled(tasks.map((task) => task()));
    }
  }
  async function onUrlChange(previous) {
    return await onEvent("onUrlChange", previous);
  }
  async function onHashChange(previous) {
    return await onEvent("onHashChange", previous);
  }
  async function onLoad() {
    return await onEvent("load");
  }
  const name = "fanqie-assistant";
  const version = "0.0.3";
  const win = unsafeWindow;
  let previousUrl = win.location.href;
  let previousHash = win.location.hash;
  function installNavigationHooks() {
    for (const method of ["pushState", "replaceState"]) {
      const original = win.history[method];
      win.history[method] = function(...args) {
        const result = original.apply(this, args);
        console.debug(`history.${method} called with args:`, args);
        void onUrlChange(previousUrl);
        previousUrl = win.location.href;
        return result;
      };
    }
    win.addEventListener("popstate", () => {
      void onUrlChange(previousUrl);
      previousUrl = win.location.href;
    });
    win.addEventListener("hashchange", () => {
      void onHashChange(previousHash);
      previousHash = win.location.hash;
    });
  }
  async function mainInit() {
    console.log(`================================================`);
    console.log(`==          ${name} - ${version}         ==`);
    console.log(`================================================`);
    installNavigationHooks();
    initFontDecrypt();
    await inject();
    await init();
    void onLoad();
  }
  mainInit();

})(moment, Vue);