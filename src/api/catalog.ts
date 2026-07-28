import apiFetch from '../utils/request'
import type { Book, CatalogResult, ChapterItem, VolumeItem } from '../types'
import moment from 'moment'

export async function getCatalogRaw(bookId: string): Promise<any> {
    const response = await apiFetch(`https://fanqienovel.com/api/reader/directory/detail?bookId=${bookId}`)
    const j: any = response.json()
    if (j.code !== 0 || j.data.chapterListWithVolume.length === 0) {
        throw new Error('Empty catalog')
    }
    return [j.data.chapterListWithVolume, j.data.allItemIds]
}

export async function getCatalog(bookId: string): Promise<CatalogResult> {
    const r = await getCatalogRaw(bookId) as Array<unknown>
    const catalogRaw: any = r[0] // chapter list with volume
    const allItemIds = r[1] as string[] // all item ids
    const vmap: Record<string, VolumeItem> = {} // title -> VolumeItem
    const chapters: Array<ChapterItem> = []
    // const str = ''
    catalogRaw[0].map((item: any): void => {
        // console.debug(item)
        const chapterItem = {
            item_id: item.itemId,
            title: item.title,
            // YYYY-MM-DD HH:mm:ss
            update_time: moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss') as string,
            char_count: item.charCount,
            volume_title: item.volume_name,
        } as ChapterItem
        chapters.push(chapterItem)
        if (!vmap[item.volume_name]) {
            vmap[item.volume_name] = {
                title: item.volume_name,
                book_id: bookId,
                chapter_list: [],
            } as VolumeItem
        }
        (vmap[item.volume_name] as VolumeItem).chapter_list.push(chapterItem)
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