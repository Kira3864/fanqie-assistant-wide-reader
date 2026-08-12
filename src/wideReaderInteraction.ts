/** 最小化的元素祖先查询能力，便于在无浏览器环境中测试滚轮路由。 */
export interface ClosestTarget {
    closest(selector: string): unknown
}

/**
 * 判断滚轮事件是否应交给分页翻页。
 * 目录和设置遮罩内的滚轮必须保留浏览器默认滚动行为。
 */
export function shouldTurnPageForWheel(target: EventTarget | null): boolean {
    const candidate = target as (EventTarget & Partial<ClosestTarget>) | null
    return !candidate?.closest?.('.fqa-wide-scrim')
}
