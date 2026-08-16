/** 最小化的元素祖先查询能力，便于在无浏览器环境中测试滚轮路由。 */
export interface ClosestTarget {
    closest(selector: string): unknown
}

/** 分页阅读支持的键盘按键。 */
const PAGE_TURN_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'])

/** 滚轮累计触发一次翻页所需的最小位移。 */
const WHEEL_TURN_THRESHOLD = 80

/** 成功翻页后阻止同一滚轮手势再次触发的基础时间。 */
const WHEEL_TURN_COOLDOWN = 420

/** 冷却期内持续收到惯性事件时追加的静默时间。 */
const WHEEL_IDLE_EXTENSION = 180

/** 滚轮翻页方向。 */
export type WheelPageTurnDirection = 'previous' | 'next'

/**
 * 跨阅读器实例保存滚轮手势状态的控制器。
 *
 * 章节切换会销毁并重建阅读器 DOM，但同一次触控板或滚轮惯性仍会继续派发事件；
 * 控制器必须由模块级实例复用，才能避免新实例把剩余惯性识别成第二次翻页。
 */
export class WheelPageTurnController {
    private accumulatedDelta = 0
    private lockedUntil = 0

    /**
     * 接收一次滚轮位移并判断是否应翻页。
     *
     * @param delta 当前事件的主方向位移。
     * @param now 单调递增的当前时间，单位为毫秒。
     * @returns 达到阈值时返回翻页方向，否则返回 null。
     */
    consume(delta: number, now: number): WheelPageTurnDirection | null {
        if (!Number.isFinite(delta) || !Number.isFinite(now)) return null
        if (now < this.lockedUntil) {
            this.accumulatedDelta = 0
            // 惯性仍在继续时延长静默期，直到本次物理手势真正停止。
            this.lockedUntil = Math.max(this.lockedUntil, now + WHEEL_IDLE_EXTENSION)
            return null
        }

        this.accumulatedDelta += delta
        if (Math.abs(this.accumulatedDelta) < WHEEL_TURN_THRESHOLD) return null
        const direction = this.accumulatedDelta > 0 ? 'next' : 'previous'
        this.accumulatedDelta = 0
        this.lockedUntil = now + WHEEL_TURN_COOLDOWN
        return direction
    }
}

/**
 * 判断键盘事件是否应触发一次分页翻页。
 *
 * @param key 键盘按键名称。
 * @param repeat 是否为长按产生的自动重复事件。
 */
export function shouldHandlePageTurnKey(key: string, repeat: boolean): boolean {
    return PAGE_TURN_KEYS.has(key) && !repeat
}

/**
 * 判断滚轮事件是否应交给分页翻页。
 * 目录和设置遮罩内的滚轮必须保留浏览器默认滚动行为。
 */
export function shouldTurnPageForWheel(target: EventTarget | null): boolean {
    const candidate = target as (EventTarget & Partial<ClosestTarget>) | null
    return !candidate?.closest?.('.fqa-wide-scrim')
}
