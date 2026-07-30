import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import vue from '@vitejs/plugin-vue';
import { version } from './package.json';
import { readFileSync } from 'node:fs';

/**
 * Zstatic 是 npm 全量镜像，路径与 jsdelivr 的 /npm/ 完全一致，
 * 文件内容逐字节相同，但在大陆的连通性远好于 cdn.jsdelivr.net。
 * 用法同 cdn.jsdelivr：zstatic(导出的全局变量名, 包内文件路径)
 */
const zstatic = (
  exportVarName: string,
  pathname: string,
): [string, (version: string, name: string) => string] => [
  exportVarName,
  (version, name) => `https://s4.zstatic.net/npm/${name}@${version}/${pathname}`,
];

const icon = readFileSync('./src/assets/fanqie.svg', 'utf-8');
const iconUrl = `data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}`;

export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '番茄小说助手',
        namespace: 'https://github.com/naiyQAQ/fanqie-assistant',
		license: "GPLv3",
        version,
        description: '番茄小说助手，去广告、去推广、解锁章节、优化体验。',
        icon: iconUrl,
        author: 'naiyQAQ',
        'run-at': 'document-start',
        match: ['*://*.fanqienovel.com/*'],
        grant: ['GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_deleteValue', 'GM_xmlhttpRequest', 'unsafeWindow'],
        connect: ['fanqienovel.com', 'api5-sinfonlinec.jxbhmy.com', 'api3-sinfonlinec.jxbhmy.com', 'reading.snssdk.com'],
      },
      build: {
        fileName: 'fanqie-assistant.user.js',
        // vue / moment 走 CDN @require，不打进脚本体积
        externalGlobals: {
          vue: zstatic('Vue', 'dist/vue.global.prod.js'),
          moment: zstatic('moment', 'min/moment.min.js'),
        },
      },
    }),
  ],
});
