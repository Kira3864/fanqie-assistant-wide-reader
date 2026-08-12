import { describe, expect, it, vi } from 'vitest'
import { shouldTurnPageForWheel } from '../src/wideReaderInteraction'

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
})
