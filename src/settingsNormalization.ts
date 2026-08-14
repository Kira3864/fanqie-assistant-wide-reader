/** 书架每行显示数量的默认值。 */
export const DEFAULT_BOOKSHELF_COLUMNS = 5

/** 书架每行允许显示的最少书籍数。 */
export const MIN_BOOKSHELF_COLUMNS = 4

/** 书架每行允许显示的最多书籍数。 */
export const MAX_BOOKSHELF_COLUMNS = 10

/**
 * 将书架列数归一化为 4 到 10 的整数。
 *
 * @param value 持久化存储或界面传入的未知值。
 * @returns 可安全写入 CSS 网格的列数。
 */
export function normalizeBookshelfColumns(value: unknown): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return DEFAULT_BOOKSHELF_COLUMNS
    return Math.min(MAX_BOOKSHELF_COLUMNS, Math.max(MIN_BOOKSHELF_COLUMNS, Math.round(parsed)))
}

/**
 * 将旧版双分页开关迁移为单一的分页活动状态。
 *
 * 旧版总开关关闭时必须保持关闭；总开关开启时继续采用用户最后一次进入或退出分页的状态。
 *
 * @param raw 原始持久化设置对象。
 * @returns 新版唯一的分页阅读开关状态。
 */
export function resolveWideReaderActive(raw: Record<string, unknown>): boolean {
    if (raw.wideReaderEnabled === false) return false
    if (typeof raw.wideReaderActive === 'boolean') return raw.wideReaderActive
    if (typeof raw.wideReaderEnabled === 'boolean') return raw.wideReaderEnabled
    return true
}
