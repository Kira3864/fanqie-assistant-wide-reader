import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import vue from '@vitejs/plugin-vue';
import { version } from './package.json';
import { readFileSync } from 'node:fs';

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
      },
    }),
  ],
});
