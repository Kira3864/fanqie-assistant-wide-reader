import { describe, expect, it } from 'vitest'
import { calculateSpreadOffset } from '../src/wideReaderPaging'

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
