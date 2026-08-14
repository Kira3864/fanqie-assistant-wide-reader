/** 书架悬停信息框的固定宽度，单位为像素。 */
export const BOOKSHELF_HOVER_WIDTH = 280

/** 书架悬停信息框的目标高度，单位为像素。 */
export const BOOKSHELF_HOVER_HEIGHT = 360

/** 信息框与封面之间的水平间距，单位为像素。 */
const BOOKSHELF_HOVER_GAP = 12

/** 信息框与浏览器视口边缘的安全距离，单位为像素。 */
const VIEWPORT_MARGIN = 8

/** 计算布局时所需的封面视口坐标。 */
export interface BookshelfHoverAnchor {
    left: number
    right: number
    top: number
}

/** 计算布局时所需的浏览器视口尺寸。 */
export interface BookshelfHoverViewport {
    width: number
    height: number
}

/** 书架悬停信息框的最终视口布局。 */
export interface BookshelfHoverLayout {
    x: number
    y: number
    height: number
}

/**
 * 计算固定尺寸书架信息框的位置。
 *
 * 信息框高度不再依赖封面高度；仅当浏览器视口小于目标高度时才压缩，
 * 从而保证高密度书架中的小封面不会连带缩小详情内容。
 *
 * @param anchor 当前封面的视口坐标。
 * @param viewport 当前浏览器视口尺寸。
 * @returns 信息框的左上角坐标和可用高度。
 */
export function computeBookshelfHoverLayout(
    anchor: BookshelfHoverAnchor,
    viewport: BookshelfHoverViewport,
): BookshelfHoverLayout {
    let x = anchor.right + BOOKSHELF_HOVER_GAP
    if (x + BOOKSHELF_HOVER_WIDTH > viewport.width - VIEWPORT_MARGIN) {
        x = anchor.left - BOOKSHELF_HOVER_WIDTH - BOOKSHELF_HOVER_GAP
    }
    x = Math.max(
        VIEWPORT_MARGIN,
        Math.min(x, viewport.width - BOOKSHELF_HOVER_WIDTH - VIEWPORT_MARGIN),
    )

    const availableHeight = Math.max(0, viewport.height - VIEWPORT_MARGIN * 2)
    const height = Math.min(BOOKSHELF_HOVER_HEIGHT, availableHeight)
    const y = Math.max(
        VIEWPORT_MARGIN,
        Math.min(anchor.top, viewport.height - VIEWPORT_MARGIN - height),
    )

    return { x, y, height }
}
