/**
 * 沉浸式阅读器的章节导航策略。
 * 集中维护 URL 与历史记录行为，保证站点左上角返回仍指向进入阅读器前的书架页面。
 */

/** 创建番茄阅读页的站内章节地址。 */
export function createReaderChapterUrl(itemId: string): string {
    return `/reader/${encodeURIComponent(itemId)}?enter_from=reader`
}

/**
 * 跨阅读器重复挂载保存“打开目标章节末屏”的导航意图。
 *
 * 匹配操作不会消费状态；只有用户真正主动翻页或离开阅读器时才清除，
 * 避免同一章节被页面脚本重复挂载后退回旧的保存位置。
 */
export class ChapterEndNavigationIntent {
    private targetItemId: string | null = null

    /** 记录需要从末屏打开的目标章节。 */
    begin(itemId: string): void {
        this.targetItemId = itemId || null
    }

    /** 判断当前挂载章节是否仍应固定在末屏，本方法不会消费意图。 */
    matches(itemId: string): boolean {
        return this.targetItemId !== null && this.targetItemId === itemId
    }

    /** 清除指定章节的意图；不传章节时清除全部状态。 */
    clear(itemId?: string): void {
        if (itemId === undefined || this.targetItemId === itemId) this.targetItemId = null
    }
}

/**
 * 在当前历史项内切换章节。
 * replaceState 不会增加历史深度，因此原站返回按钮仍可返回进入阅读器前的页面。
 */
export function replaceReaderChapter(history: Pick<History, 'replaceState' | 'state'>, itemId: string): void {
    history.replaceState(history.state, '', createReaderChapterUrl(itemId))
}
