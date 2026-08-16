import { describe, expect, it, vi } from 'vitest'
import {
    WheelPageTurnController,
    shouldHandlePageTurnKey,
    shouldTurnPageForWheel,
} from '../src/wideReaderInteraction'

/** 验证目录和设置面板可以独占鼠标滚轮。 */
describe('分页滚轮路由', () => {
    /** 面板内滚轮应交给面板自身滚动，不触发分页。 */
    it('忽略遮罩内的滚轮事件', () => {
        const target = { closest: vi.fn(() => ({ className: 'fqa-wide-scrim' })) }
        expect(shouldTurnPageForWheel(target as unknown as EventTarget)).toBe(false)
        expect(target.closest).toHaveBeenCalledWith('.fqa-wide-scrim')
    })

    /** 正文区域滚轮仍应触发分页。 */
    it('保留正文滚轮翻页', () => {
        const target = { closest: vi.fn(() => null) }
        expect(shouldTurnPageForWheel(target as unknown as EventTarget)).toBe(true)
    })

    /** 同一次惯性滚动跨过章节切换后，不能在新阅读器中再翻一屏。 */
    it('跨阅读器实例持续拦截同一滚轮手势', () => {
        const controller = new WheelPageTurnController()

        expect(controller.consume(-100, 0)).toBe('previous')
        expect(controller.consume(-100, 100)).toBeNull()
        expect(controller.consume(-100, 400)).toBeNull()
        expect(controller.consume(-100, 520)).toBeNull()
        expect(controller.consume(-100, 900)).toBe('previous')
    })

    /** 长按方向键产生的 repeat 事件不能在切章后再触发一次翻页。 */
    it('忽略分页按键的自动重复事件', () => {
        expect(shouldHandlePageTurnKey('ArrowLeft', false)).toBe(true)
        expect(shouldHandlePageTurnKey('ArrowLeft', true)).toBe(false)
        expect(shouldHandlePageTurnKey('PageUp', true)).toBe(false)
        expect(shouldHandlePageTurnKey('A', false)).toBe(false)
    })
})
