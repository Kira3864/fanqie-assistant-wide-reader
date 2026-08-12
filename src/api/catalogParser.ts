/** 官方网页目录接口的最小章节结构。 */
interface WebCatalogChapter {
    itemId?: unknown
    item_id?: unknown
    title?: unknown
    chapterTitle?: unknown
    chapter_title?: unknown
    firstPassTime?: unknown
    first_pass_time?: unknown
    chapterWordNumber?: unknown
    chapter_word_number?: unknown
    volume_name?: unknown
    volumeName?: unknown
}

/**
 * 解析番茄网页目录响应，并兼容卷数组、卷对象及 snake_case 字段。
 *
 * @param payload 官方目录接口返回的未知 JSON 数据。
 * @returns 与 APP 目录适配层一致的章节数组。
 */
export function parseWebCatalogPayload(payload: unknown): any[] {
    if (!isRecord(payload) || String(payload.code) !== '0' || !isRecord(payload.data)) return []
    const roots = [
        payload.data.chapterListWithVolume,
        payload.data.chapter_list_with_volume,
        payload.data.volumes,
        payload.data.chapterList,
        payload.data.chapter_list,
    ]
    const chapters: any[] = []
    const seen = new Set<string>()

    /** 深度受限地遍历目录容器，只接收同时具有章节 ID 和标题的对象。 */
    const visit = (value: unknown, depth: number): void => {
        if (depth > 5 || value === null || value === undefined) return
        if (Array.isArray(value)) {
            value.forEach((entry) => visit(entry, depth + 1))
            return
        }
        if (!isRecord(value)) return

        const chapter = value as WebCatalogChapter
        const itemId = stringValue(chapter.itemId ?? chapter.item_id)
        const title = stringValue(chapter.title ?? chapter.chapterTitle ?? chapter.chapter_title)
        if (itemId && title) {
            if (seen.has(itemId)) return
            seen.add(itemId)
            chapters.push({
                item_id: itemId,
                title,
                first_pass_time: numberValue(chapter.firstPassTime ?? chapter.first_pass_time),
                chapter_word_number: numberValue(chapter.chapterWordNumber ?? chapter.chapter_word_number),
                volume_name: stringValue(chapter.volume_name ?? chapter.volumeName),
            })
            return
        }

        const nestedKeys = ['chapterList', 'chapter_list', 'itemList', 'item_list', 'chapters', 'volumes']
        nestedKeys.forEach((key) => visit(value[key], depth + 1))
    }

    roots.forEach((root) => visit(root, 0))
    return chapters
}

/** 判断未知值是否为普通对象记录。 */
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

/** 将目录字段安全转换为字符串。 */
function stringValue(value: unknown): string {
    return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

/** 将目录时间和字数字段安全转换为数值。 */
function numberValue(value: unknown): number {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}
