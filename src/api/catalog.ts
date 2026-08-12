import type { Book, CatalogResult, ChapterItem, VolumeItem } from '../types'
import { appGet } from './app'
import { fetch } from '../config'
import moment from 'moment'
import { parseWebCatalogPayload } from './catalogParser'

/**
 * 获取目录原始数据，对应 APP 的 /bookapi/directory/all_items/v。
 *
 * 章节明细在 data.item_data_list（含 volume_name / title / first_pass_time /
 * chapter_word_number）；data.catalog_data 只有 item_id 和标题，信息不全。
 */
export async function getCatalogRaw(bookId: string): Promise<any> {
    try {
        const response = await appGet('/bookapi/directory/all_items/v', { book_id: bookId })
        const j: any = response.json()
        const items = j?.data?.item_data_list
        if (j?.code === 0 && Array.isArray(items) && items.length > 0) {
            return [items, items.map((it: any) => String(it.item_id))]
        }
        console.warn('[fqa:目录] APP 目录为空，尝试官方网页目录接口')
    } catch (error) {
        console.warn('[fqa:目录] APP 目录请求失败，尝试官方网页目录接口', error)
    }

    return await getWebCatalogRaw(bookId)
}

/**
 * 从番茄官方网页目录接口获取章节。
 *
 * 该后备路径使用同源请求，不会把登录凭据或书籍信息发送给第三方。
 */
async function getWebCatalogRaw(bookId: string): Promise<[any[], string[]]> {
    const response = await fetch.call(
        unsafeWindow,
        `/api/reader/directory/detail?bookId=${encodeURIComponent(bookId)}`,
        { credentials: 'include', headers: { Accept: 'application/json' } },
    )
    if (!response.ok) throw new Error(`网页目录请求失败（${response.status}）`)
    const payload: unknown = await response.json()
    const items = parseWebCatalogPayload(payload)
    if (items.length === 0) throw new Error('网页目录为空')
    return [items, items.map((item) => String(item.item_id))]
}


export async function getCatalog(bookId: string): Promise<CatalogResult> {
    const r = await getCatalogRaw(bookId) as Array<unknown>
    const catalogRaw = r[0] as any[] // item_data_list
    const allItemIds = r[1] as string[] // all item ids
    const vmap: Record<string, VolumeItem> = {} // title -> VolumeItem
    const chapters: Array<ChapterItem> = []

    catalogRaw.forEach((item: any): void => {
        const volumeName = item.volume_name ?? ''
        const chapterItem = {
            item_id: String(item.item_id),
            title: item.title,
            // YYYY-MM-DD HH:mm:ss
            update_time: moment(item.first_pass_time * 1000).format('YYYY-MM-DD HH:mm:ss') as string,
            char_count: item.chapter_word_number || 0,
            volume_title: volumeName,
        } as ChapterItem
        chapters.push(chapterItem)
        if (!vmap[volumeName]) {
            vmap[volumeName] = {
                title: volumeName,
                book_id: bookId,
                chapter_list: [],
            } as VolumeItem
        }
        (vmap[volumeName] as VolumeItem).chapter_list.push(chapterItem)
    })

    return {
        book_id: bookId,
        volume_list: Object.values(vmap),
        chapter_list: chapters,
        all_item_ids: allItemIds,
    } as CatalogResult
}

export async function enrichBookCatalog(book: Book): Promise<void> {
    const catalog = await getCatalog(book.book_id)
    book.volume_list = catalog.volume_list
    book.chapter_list = catalog.chapter_list
}
