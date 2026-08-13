import { describe, expect, it } from 'vitest'
import {
    buildColumnPageMap,
    calculateChapterBreakFill,
    calculateCurrentSpreads,
    calculateSpreadOffset,
    resolveMeasuredSpread,
} from '../src/wideReaderPaging'

/** 验证双栏分页不会在奇数栏末页回退半栏。 */
describe('双栏分页位移', () => {
    /** 五栏内容的第三页必须从第五栏开始，不能重复第四栏。 */
    it('准确移动到奇数栏末页', () => {
        const singleColumnStep = 500
        const spreadStep = singleColumnStep * 2

        expect(calculateSpreadOffset(0, spreadStep)).toBe(0)
        expect(calculateSpreadOffset(1, spreadStep)).toBe(-1000)
        expect(calculateSpreadOffset(2, spreadStep)).toBe(-2000)
    })
})

/** 验证左右物理栏使用各自独立的章内页码。 */
describe('逐栏页码', () => {
    /** 五页当前章之后预载三页下一章时，页码应在章节边界重新从一开始。 */
    it('为相邻章节生成独立页码', () => {
        const pages = buildColumnPageMap(8, [
            { itemId: '100', title: '第100章 当前章', startColumn: 0 },
            { itemId: '101', title: '第101章 下一章', startColumn: 5 },
        ])

        expect(pages[0]).toMatchObject({ itemId: '100', page: 1, total: 5 })
        expect(pages[4]).toMatchObject({ itemId: '100', page: 5, total: 5 })
        expect(pages[5]).toMatchObject({ itemId: '101', page: 1, total: 3 })
        expect(calculateCurrentSpreads(5, 2)).toBe(3)
    })

    /** 返回上一章末屏后，下一章预取造成的重排不能让阅读位置倒退一屏。 */
    it('预取重排时保留当前末屏', () => {
        const openedAtEnd = 3
        const staleSemanticResult = 2

        expect(resolveMeasuredSpread(openedAtEnd, 4, 'spread', staleSemanticResult)).toBe(3)
        expect(resolveMeasuredSpread(openedAtEnd, 4, 'semantic', staleSemanticResult)).toBe(2)
    })

    /** 浏览器忽略强制换栏时，应补齐当前栏剩余高度让新章从页首开始。 */
    it('计算新章节另起一页所需补白', () => {
        expect(calculateChapterBreakFill(760, 900)).toBe(140)
        expect(calculateChapterBreakFill(0, 900)).toBe(0)
        expect(calculateChapterBreakFill(900, 900)).toBe(0)
    })
})
