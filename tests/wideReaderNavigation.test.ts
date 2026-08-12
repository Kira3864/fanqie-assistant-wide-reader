import { describe, expect, it, vi } from 'vitest'
import { createReaderChapterUrl, replaceReaderChapter } from '../src/wideReaderNavigation'

/** 验证宽屏阅读切章不会破坏进入阅读器前的浏览器历史。 */
describe('宽屏阅读章节导航', () => {
    /** 应生成站内阅读地址并安全编码章节 id。 */
    it('生成阅读页地址', () => {
        expect(createReaderChapterUrl('123 456')).toBe('/reader/123%20456?enter_from=reader')
    })

    /** 应替换当前历史项，而不是新增会拦截“返回书架”的历史项。 */
    it('使用 replaceState 原地切章', () => {
        const replaceState = vi.fn()
        const history = { state: { source: 'bookshelf' }, replaceState }

        replaceReaderChapter(history, '7339549408935019070')

        expect(replaceState).toHaveBeenCalledOnce()
        expect(replaceState).toHaveBeenCalledWith(
            history.state,
            '',
            '/reader/7339549408935019070?enter_from=reader',
        )
    })
})
