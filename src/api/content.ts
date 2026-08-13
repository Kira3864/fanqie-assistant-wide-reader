import config, { type KeyInfo } from '../config'
import { appGet, appPost } from './app'
import { b64decode, b64encode } from '../crypto'
import { read, write } from '../localStorage'
import { decryptChapter } from '../crypto/content'
import { encryptKeyinfoBody, decryptKeyinfoResponse } from '../crypto/registerkey'
import { ChapterCache } from '../chapterCache'

/** 当前标签页中的章节正文缓存。 */
const chapterCache = new ChapterCache<any>()

async function refreshKeyinfo(): Promise<void> {
    const b = await encryptKeyinfoBody(config.currentConfig)
    const res = await appPost('/crypt/registerkey', b)
    const j = res.json()
    const ek = j?.data?.key
    if (!ek) {
        throw new Error(`Failed to get key info: ${res.responseText}`)
    }
    const key = await decryptKeyinfoResponse(ek)
    const keyinfo: KeyInfo = {
        key,
        keyver: j?.data?.keyver as number,
    }
    console.log('Refreshed key info:', keyinfo)
    config.currentConfig.key_info = keyinfo
    write('keyinfo', {
        key: b64encode(key),
        keyver: j?.data?.keyver as number,
    }) // cache key info
}

async function ensureKeyinfo(expectedKeyVersion?: number): Promise<void> {
    const keyinfo = config.currentConfig.key_info
    const cachedKeyInfo = read('keyinfo')
    console.log('cached key info: ', cachedKeyInfo)
    if (cachedKeyInfo) {
        const cki = {
            key: b64decode(cachedKeyInfo.key),
            keyver: cachedKeyInfo.keyver,
        } as KeyInfo
        if (typeof expectedKeyVersion === 'undefined' || cki.keyver === expectedKeyVersion) {
            config.currentConfig.key_info = cki
            return
        }
    }
    if (!keyinfo) {
        // get from zero
        return await refreshKeyinfo()
    }
    if (keyinfo?.keyver !== expectedKeyVersion) {
        // refresh from server
        return await refreshKeyinfo()
    }
}


/** 从远端获取并解密单章正文，密钥失效时在限定次数内自动刷新重试。 */
async function fetchChapter(itemId: string, _retry?: number): Promise<any> {
    if (typeof _retry === 'undefined') _retry = 0
    if (_retry > 5) {
        throw new Error(`Failed to get chapter: ${itemId}`)
    }
    if (!config.currentConfig.key_info) {
        await ensureKeyinfo()
    }
    const res = await appGet('/reader/full/v', { item_id: itemId, req_type: '1' })
    const j = res.json()?.data
    if (!j) {
        console.warn('Failed to get chapter: ', itemId, ', response: ', res.responseText)
        return await fetchChapter(itemId, _retry + 1)
    }
    if (j?.content === 'Invalid' || j?.key_version !== config.currentConfig.key_info?.keyver) { // keyreg expired
        console.warn('Key reg expired, regster again and retrying...')
        await ensureKeyinfo(parseInt(j?.key_version))
        return await fetchChapter(itemId, _retry + 1)
    }
    j.content = await decryptChapter(j?.content, j, config.currentConfig)
    return j
}

/** 获取已解密章节；缓存命中时不再发起网络请求。 */
export async function getChapter(itemId: string): Promise<any> {
    return chapterCache.get(itemId, () => fetchChapter(itemId))
}

/** 按当前目录位置保留前三章、当前章及下一章的正文缓存。 */
export function retainChapterCache(currentItemId: string, orderedItemIds: string[]): void {
    chapterCache.retainWindow(currentItemId, orderedItemIds)
}


export interface BatchChapter {
    item_id: string;
    content?: unknown;
    key_version?: number;
    novel_data?: any; /* 章节对应的书籍数据，结构比较复杂，所以直接用any */
    /** 解密失败或章节不可用时的原因 */
    error?: string;
    [key: string]: unknown;
}


export async function getChapters(
    itemIds: string[],
    bookId = '0',
): Promise<Record<string, BatchChapter>> {
    if (itemIds.length === 0) return {}
    if (!config.currentConfig.key_info) {
        await ensureKeyinfo()
    }

    const res = await appGet('/reader/batch_full/v', {
        item_ids: itemIds.join(','),
        book_id: bookId,
        novel_text_type: '1',
        req_type: '1',
    })
    
    const raw = res.json()?.data
    const entries: Array<[string, any]> = raw && typeof raw === 'object'
        ? (Array.isArray(raw)
            ? raw.map((it: any) => [String(it?.item_id ?? it?.novel_data?.item_id ?? ''), it])
            : Object.entries(raw))
        : []

    if (entries.length === 0) {
        throw new Error(`Failed to batch get chapters: ${res.responseText}`)
    }

    const results: Record<string, BatchChapter> = {}
    for (const [id, item] of entries) {
        if (!id) continue
        if (item?.code !== undefined && item.code !== 0) {
            results[id] = { ...item, item_id: id, error: `code ${item.code}` }
            continue
        }
        if (!item?.content || item.content === 'Invalid') {
            results[id] = { ...item, item_id: id, error: 'Invalid content' }
            continue
        }
        try {
            results[id] = {
                ...item,
                item_id: id,
                novel_data: item.novel_data,
                content: await decryptChapter(item.content, item, config.currentConfig),
            }
        } catch (e) {
            results[id] = { ...item, item_id: id, error: String(e) }
        }
    }
    return results
}

export async function getChapterInfo(itemId: string): Promise<unknown> {
    // use page fetch (includes bytedance security sdk. we reuse it)
    // same origin
    const res = await fetch('https://fanqienovel.com/api/reader/full?itemId=' + itemId)
    return await res.json()
}
