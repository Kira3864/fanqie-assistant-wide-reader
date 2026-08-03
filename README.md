# 番茄小说助手 (fanqie-assistant)

一个用于 [番茄小说网页版](https://fanqienovel.com) 的用户脚本（Userscript）：去广告、去推广、解锁章节、优化阅读体验。

> **使用该项目会有账号被官方封禁的风险。** 如您继续使用，则证明您已知晓未来可能发生的风险并对其负责。  
> **项目处于快速开发期。** 核心功能已基本稳定，但仍可能随时调整接口和目录结构。欢迎试用和反馈。  
> **这是我的第一个 TypeScript 项目。** 属于边学边写，代码质量可能不高，有问题欢迎指正。

## 脚本发布地址:  
[GitHub](https://github.com/naiyQAQ/fanqie-assistant) | 如果觉得好用，去点点 star 吧！  
[GreasyFork](https://greasyfork.org/zh-CN/scripts/589115-%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E5%8A%A9%E6%89%8B)

## 功能特性

### 阅读体验

- **正文增强**：拉取完整正文并重新渲染，替换网页原有内容容器，允许复制文本
- **解锁章节**：网页端被屏蔽的章节可以正常阅读
- **漫画阅读**：图片章节支持懒加载，加密图片滚动到视口时自动解密
- **章内注释**：自动处理 EPUB footnote，悬浮查看或点击定位，末尾保留注释列表
- **字体反混淆**：还原网页自绘字体渲染的混淆文本，动态插入的内容同样生效
- **书籍样式**：支持随正文下发的 CSS，同时限制作用域避免污染全站
- **章节信息补全**：补上卷名、精确到秒的更新时间，并修正页面标题

### 书架优化

- **完整书架**：展示所有书籍（包括因版权等原因网页端不可见的），支持跳转阅读
- **详细信息**：显示更新时间、未读章节数、最后阅读时间等
- **分组展示**：保留原站书架分组，支持切换查看

### 用户相关

- **用户信息展示**：已登录时在头像菜单里显示已读本数和累计阅读时长
- **设置面板**：提供可视化设置界面，支持自定义阅读器字体、CSS、API 偏好等

### 隐私与安全

- **屏蔽埋点上报**：拦截发往字节、百度统计域名的埋点请求
- **设备管理**：首次使用自动注册匿名设备并激活会员，支持手动填写设备信息

## 开发计划

计划不分先后，也可能会开发以下列表以外的功能：

1. 短剧网页端播放
2. 更完善的用户详情界面（自己的和他人的）
3. 段评、章评、书评功能
4. 阅读数据上报（与安卓端同步阅读进度与时长）
5. APP 端带推荐的排行榜
6. 分类筛选与搜索优化
7. 更详细的书籍信息（评分、在读人数等）
8. 推书页面
9. 听书功能

如果您有更多好的想法，欢迎提 PR 或 Issue。

## 使用

需要一个用户脚本管理器，推荐 [Tampermonkey](https://www.tampermonkey.net/)。

安装构建产物 `fanqie-assistant.user.js` 即可。

## 开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 类型检查 + 打包
npm run preview  # 预览构建产物
```

### 调试

`npm run dev` 后，vite-plugin-monkey 会输出一个安装地址，在脚本管理器里安装这个开发版即可。它指向本地开发服务器，改完代码刷新页面就能看到效果，不需要每次重新打包安装。

脚本运行时机是 `document-start`，日志都打在浏览器控制台，按 `fqa` 或钩子 id（如 `readerHook_load`）过滤比较方便。

调试时注意关掉正式版脚本，两个版本同时启用会重复注入。

### 编译

```bash
npm run build
```

产物是单文件 `dist/fanqie-assistant.user.js`。`build` 会先跑 `tsc` 做类型检查，类型报错会中断打包。

## 项目结构

```
src/
├── main.ts              入口，安装导航钩子并按顺序初始化各模块
├── config.ts            设备配置与全局常量
├── types.ts             书籍、卷、章节等数据模型
├── settings.ts          设置项定义与持久化
├── settingsPanel.ts     设置面板的挂载/卸载
├── userStyle.ts         用户自定义样式（字体、CSS）
├── cssInject.ts         基础样式注入
├── fontDecrypt.ts       自绘字体文本还原
├── localStorage.ts      存储读写封装
├── api/                 接口相关内容
├── crypto/              加密算法相关内容
├── hooks/               页面钩子
│   ├── index.ts         钩子调度器
│   ├── readerHook.ts    阅读页正文替换
│   ├── bookshelfHook.ts 书架页面接管
│   ├── userHook.ts      用户菜单增强
│   └── fetchHook.ts     请求拦截（屏蔽埋点）
├── utils/               通用工具
│   ├── index.ts         DOM 等待、数组分块等
│   ├── request.ts       GM_xmlhttpRequest 封装
│   ├── time.ts          时间格式化
│   ├── compress.ts      Gzip 压缩/解压
│   └── footnote.ts      章内注释处理
├── views/               Vue 组件
│   ├── SettingsView.vue 设置面板
│   ├── BookshelfView.vue 书架主视图
│   ├── BookCard.vue     书籍卡片
│   ├── BookGroupCard.vue 分组卡片
│   ├── BookHoverCard.vue 悬浮卡片
│   ├── ContextMenu.vue  右键菜单
│   └── useBookshelf.ts  书架数据逻辑
└── assets/              样式与图标
    ├── script.css       阅读器样式
    ├── bookshelf.css    书架样式
    ├── settings.css     设置面板样式
    └── *.svg            图标资源
```

### 扩展开发

新增页面功能时，在 `hooks/` 下建一个模块，导出 `HookConfig[]` 并在 `hooks/index.ts` 里注册。每个钩子声明自己关心的事件（`load`、`onUrlChange`、`onHashChange` 等）和一个 `filter` 函数，命中才执行，互不影响。

新增设置项时，在 `settings.ts` 的 `Settings` 接口和 `DEFAULT_SETTINGS` 里添加字段，Vue 组件通过 `import { settings } from './settings'` 引入后直接修改，会自动持久化。

## 关于账号安全

正文与书籍详情走 `*.jxbhmy.com`，这是番茄小说旗下**红烛小说**的接口，与番茄数据基本通用，风控更低且不需要请求签名。这是第一方接口，不是第三方服务。  

脚本**没有申请 `GM_cookie` 权限**。`sessionid` 是 HttpOnly 的，脚本读不到、也没打算读。所有需要登录凭据的请求都用页面原生 `fetch` 发送的同源请求完成，由浏览器自动带上 Cookie，凭据不经过脚本，也不会被发往任何其他地方。  
如果后续同源接口无法满足脚本需求，会考虑使用 `GM_cookie` 权限。但我们确保您的凭据不会被发送到番茄小说及其相关平台以外的任何第三方。后期加入第三方接口时，接口由您自己输入。此时，我们可能会将凭据发往 **您自己填写的 API** 。使用即应确认风险，我们不对任何第三方接口的行为负责。  

代码全部开源，欢迎审查。  

## 许可

[GPL-3.0](LICENSE)

## 免责声明

本项目仅供学习和技术研究使用。请遵守番茄小说的用户协议与相关法律法规，不要用于商业用途或内容再分发。  
本项目永久开源免费，未经授权不得用于售卖。如果您通过购买获得此项目，那么证明你被骗了，请举报退款。  
本项目不保证任何功能的稳定性、准确性和安全性，使用时请自行承担风险。  
