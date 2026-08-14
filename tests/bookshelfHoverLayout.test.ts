import { describe, expect, it } from 'vitest'
import {
    BOOKSHELF_HOVER_HEIGHT,
    computeBookshelfHoverLayout,
} from '../src/bookshelfHoverLayout'

describe('书架悬停信息框布局', () => {
    it('封面缩小时保持固定信息框高度', () => {
        const smallCover = computeBookshelfHoverLayout(
            { left: 500, right: 590, top: 120 },
            { width: 1440, height: 900 },
        )
        const largeCover = computeBookshelfHoverLayout(
            { left: 500, right: 740, top: 120 },
            { width: 1440, height: 900 },
        )

        expect(smallCover.height).toBe(BOOKSHELF_HOVER_HEIGHT)
        expect(largeCover.height).toBe(BOOKSHELF_HOVER_HEIGHT)
    })

    it('靠近视口底部时整体上移而不是缩成封面高度', () => {
        const layout = computeBookshelfHoverLayout(
            { left: 500, right: 590, top: 820 },
            { width: 1440, height: 900 },
        )

        expect(layout.height).toBe(BOOKSHELF_HOVER_HEIGHT)
        expect(layout.y).toBe(532)
    })

    it('只有视口本身不足时才压缩信息框', () => {
        const layout = computeBookshelfHoverLayout(
            { left: 80, right: 170, top: 20 },
            { width: 800, height: 300 },
        )

        expect(layout.height).toBe(284)
        expect(layout.y).toBe(8)
    })
})
