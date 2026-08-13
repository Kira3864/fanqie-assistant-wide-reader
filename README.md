# 番茄小说助手・宽屏阅读版

面向番茄小说网页版的单文件用户脚本。脚本保留常用的正文增强能力，并提供适合桌面显示器的沉浸式分页阅读界面。

本项目在实现和兼容性设计上同时参考了：

- [原版 GreasyFork：番茄小说助手](https://greasyfork.org/zh-CN/scripts/589115-%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E5%8A%A9%E6%89%8B)
- [naiyQAQ/fanqie-assistant](https://github.com/naiyQAQ/fanqie-assistant)

它是独立维护的 Userscript 版本，不是浏览器扩展。项目遵循 GPLv3 许可证，并保留参考项目的开源归属。

## 主要功能

- 宽屏双栏、窄屏单栏的固定视口分页阅读
- 左右栏独立显示章节标题和章内页码
- 自动预取下一章并衔接奇数页末栏，终章提供独立完成页
- 保留最近三章历史正文，向前翻章无需重复请求
- 方向键、PageUp/PageDown、鼠标滚轮、触控板和页面边缘翻页
- 完整目录、章节搜索、当前章节定位和连续切章
- 明亮、羊皮纸、护眼绿、雾灰、深夜及跟随系统主题
- 微软雅黑、黑体、衬线、宋体、楷体、仿宋等字体方案
- 字号、行高、栏间距和页边距调整
- 阅读位置、分页开关和显示参数持久化
- 分页模式内的账户菜单、书架和助手设置入口
- 正文增强、复制、脚注、漫画、字体还原、书架和搜索功能

## 安装

先安装 Tampermonkey、Violentmonkey 等用户脚本管理器，然后打开：

[安装最新版 Userscript](https://raw.githubusercontent.com/Kira3864/fanqie-assistant-wide-reader/main/dist/fanqie-assistant-wide-reader.user.js)

GitHub Releases 同时提供带版本号的 `.user.js` 和源码 ZIP。

## 使用

进入番茄小说阅读页后，文字章节会根据上次保存的状态决定是否进入分页模式。

- 鼠标移动到页面顶部或底部可显示控制栏。
- “目录”用于搜索和切换章节；目录内可直接使用鼠标滚轮。
- “显示”用于切换主题、字体和排版参数。
- “账户”提供书架、会员、退出登录和助手设置入口。
- 退出分页后，页面右侧会保留“分页阅读”按钮；刷新页面仍保持退出状态。

## 开发与验证

```bash
npm install
npm test
npm run build
```

生产脚本位于 `dist/fanqie-assistant-wide-reader.user.js`。构建会先执行 TypeScript 类型检查。

推送 `v*` 标签后，GitHub Actions 会自动运行测试、构建脚本并创建对应 Release。

## 说明

番茄网页结构和接口可能随时调整，遇到正文、目录或登录入口异常时，请在 GitHub Issues 提供页面地址、脚本版本和浏览器控制台错误。使用第三方脚本存在账号风控风险，请自行评估。

## 许可证

[GNU General Public License v3.0](LICENSE)
