/**
 * 沉浸式阅读器的章节导航策略。
 * 集中维护 URL 与历史记录行为，保证站点左上角返回仍指向进入阅读器前的书架页面。
 */

/** 创建番茄阅读页的站内章节地址。 */
export function createReaderChapterUrl(itemId: string): string {
    return `/reader/${encodeURIComponent(itemId)}?enter_from=reader`
}

/**
 * 在当前历史项内切换章节。
 * replaceState 不会增加历史深度，因此原站返回按钮仍可返回进入阅读器前的页面。
 */
export function replaceReaderChapter(history: Pick<History, 'replaceState' | 'state'>, itemId: string): void {
    history.replaceState(history.state, '', createReaderChapterUrl(itemId))
}
