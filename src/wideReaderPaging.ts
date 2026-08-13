/**
 * 计算指定分页的正文水平位移。
 * 直接位移正文可绕过 scrollLeft 最大值钳制，确保奇数栏末页不重复前一栏。
 */
export function calculateSpreadOffset(spread: number, spreadStep: number): number {
    if (spread <= 0) return 0
    return -Math.max(0, spread) * Math.max(1, spreadStep)
}

/** 章节在多栏正文中的起始位置。 */
export interface ChapterColumnStart {
    itemId: string
    title: string
    startColumn: number
}

/** 单个物理页面对应的章节与章内页码。 */
export interface ColumnPageMeta {
    itemId: string
    title: string
    page: number
    total: number
}

/**
 * 根据章节起始栏生成逐栏页码。
 * 左右栏各自是一页；同一屏只负责展示相邻的两个页面，不再共享页码。
 */
export function buildColumnPageMap(
    totalColumns: number,
    starts: ChapterColumnStart[],
): ColumnPageMeta[] {
    const safeTotal = Math.max(1, totalColumns)
    const normalized = starts
        .map((start) => ({ ...start, startColumn: Math.max(0, Math.min(safeTotal - 1, start.startColumn)) }))
        .sort((left, right) => left.startColumn - right.startColumn)
    if (normalized.length === 0) return []

    const pages: ColumnPageMeta[] = []
    normalized.forEach((start, index) => {
        const nextStart = normalized[index + 1]?.startColumn ?? safeTotal
        const chapterTotal = Math.max(1, nextStart - start.startColumn)
        for (let column = start.startColumn; column < nextStart; column += 1) {
            pages[column] = {
                itemId: start.itemId,
                title: start.title,
                page: column - start.startColumn + 1,
                total: chapterTotal,
            }
        }
    })
    return pages
}

/** 计算当前章节需要占用的屏数，预载的下一章不额外增加当前章翻页次数。 */
export function calculateCurrentSpreads(currentPages: number, columnsPerSpread: 1 | 2): number {
    return Math.max(1, Math.ceil(Math.max(1, currentPages) / columnsPerSpread))
}

/** 分页重排时可采用的阅读位置恢复策略。 */
export type SpreadRestoreMode = 'semantic' | 'spread'

/**
 * 决定重新测量后的屏位置。
 * 异步追加预载章节时保留屏序号，避免语义块重新定位导致一次跳过整整两栏。
 */
export function resolveMeasuredSpread(
    currentSpread: number,
    totalSpreads: number,
    mode: SpreadRestoreMode,
    semanticSpread?: number,
): number {
    const maximum = Math.max(0, totalSpreads - 1)
    const target = mode === 'semantic' && semanticSpread !== undefined
        ? semanticSpread
        : currentSpread
    return Math.max(0, Math.min(maximum, target))
}

/**
 * 计算章节标题到下一物理页顶部所需的补白高度。
 * 用于兜底处理部分浏览器忽略多栏强制换栏规则的情况。
 */
export function calculateChapterBreakFill(offsetTop: number, columnHeight: number): number {
    if (columnHeight <= 0 || offsetTop <= 1) return 0
    const normalizedOffset = offsetTop % columnHeight
    if (normalizedOffset <= 1 || columnHeight - normalizedOffset <= 1) return 0
    return columnHeight - normalizedOffset
}

/** 统计当前屏中已经展示的目标章节页面数。 */
export function countVisibleChapterPages(
    firstColumn: number,
    columnsPerSpread: 1 | 2,
    pages: ColumnPageMeta[],
    targetItemId: string,
): number {
    let count = 0
    for (let index = 0; index < columnsPerSpread; index += 1) {
        if (pages[firstColumn + index]?.itemId === targetItemId) count += 1
    }
    return count
}

/** 根据已预览页数计算新章节首次打开时可跳过的物理栏数。 */
export function calculateInitialColumnOffset(previewedPages: number, totalPages: number): number {
    return Math.max(0, Math.min(Math.max(0, totalPages - 1), Math.floor(previewedPages)))
}
