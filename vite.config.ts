import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import vue from '@vitejs/plugin-vue';
import { version } from './package.json';
import { readFileSync } from 'node:fs';

const tocdn = (
  exportVarName: string,
  pathname: string,
): [string, (version: string, name: string) => string] => [
  exportVarName,
  (version, name) => `https://registry.npmmirror.com/${name}/${version}/files/${pathname}`,
];

const icon = readFileSync('./src/assets/fanqie.svg', 'utf-8');
const iconUrl = `data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}`;

export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '番茄小说助手・宽屏阅读版',
      namespace: 'https://github.com/Kira3864/fanqie-assistant-wide-reader',
		license: "GPLv3",
        version,
      description: '参考 GreasyFork 与开源项目实现的番茄小说 Userscript，提供正文增强和沉浸式宽屏分页阅读。',
      homepage: 'https://github.com/Kira3864/fanqie-assistant-wide-reader',
      supportURL: 'https://github.com/Kira3864/fanqie-assistant-wide-reader/issues',
      updateURL: 'https://raw.githubusercontent.com/Kira3864/fanqie-assistant-wide-reader/main/dist/fanqie-assistant-wide-reader.user.js',
      downloadURL: 'https://raw.githubusercontent.com/Kira3864/fanqie-assistant-wide-reader/main/dist/fanqie-assistant-wide-reader.user.js',
        icon: iconUrl,
      author: 'naiyQAQ, Kira3864',
        'run-at': 'document-start',
        match: ['*://*.fanqienovel.com/*'],
        grant: ['GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_deleteValue', 'GM_xmlhttpRequest', 'unsafeWindow'],
        connect: [
            'fanqienovel.com', // 主站
            'jxbhmy.com', // 红烛小说 API
            'snssdk.com', // 字节通用 API(含番茄小说)
            'byteimg.com', // 图床
            'fqnovelpic.com', // 图床
            'bytecdn.cn', // 图床
        ],
      },
      build: {
        fileName: 'fanqie-assistant-wide-reader.user.js',
        // vue / moment 走 CDN @require，不打进脚本体积
        externalGlobals: {
          vue: tocdn('Vue', 'dist/vue.global.prod.js'),
          moment: tocdn('moment', 'min/moment.min.js'),
        },
      },
    }),
  ],
});
