/** 番茄网页阅读进度接口要求的请求字段。 */
export interface ReadingProgressPayload {
    book_id: string
    item_id: string
    read_progress: number
    index: number
    read_timestamp: string
    genre_type: string | number
}

/** 构造阅读进度所需的当前章节上下文。 */
export interface ReadingProgressContext {
    bookId: string
    itemId: string
    chapterIndex?: number
    chapterOrder?: string | number
    genre?: string | number
}

/** 可注入的请求函数，便于隔离网络层并进行回归测试。 */
export type ReadingProgressRequester = (
    input: RequestInfo | URL,
    init?: RequestInit,
) => Promise<Response>

/** 当前标签页内最后一次成功同步的章节，避免重复渲染造成重复请求。 */
let lastSyncedChapterKey = ''

/** 当前正在同步的章节请求，合并同一章节的并发渲染。 */
let inFlightChapterKey = ''
let inFlightRequest: Promise<boolean> | null = null

/**
 * 按番茄网页当前协议构造阅读进度请求。
 *
 * @param context 当前实际进入的书籍与章节信息。
 * @param now 当前毫秒时间戳，测试时可传入固定值。
 * @returns 可直接提交至官网接口的 JSON 对象。
 */
export function buildReadingProgressPayload(
    context: ReadingProgressContext,
    now: number = Date.now(),
): ReadingProgressPayload {
    const officialOrder = Number(context.chapterOrder)
    const catalogOrder = Number.isInteger(context.chapterIndex) && Number(context.chapterIndex) >= 0
        ? Number(context.chapterIndex) + 1
        : 0
    const order = Number.isFinite(officialOrder) && officialOrder > 0 ? officialOrder : catalogOrder

    return {
        book_id: context.bookId,
        item_id: context.itemId,
        read_progress: order,
        index: order,
        read_timestamp: String(Math.floor(now / 1000)),
        genre_type: context.genre ?? 0,
    }
}

/**
 * 获取页面环境中的请求函数。
 *
 * 阅读进度接口不在统计拦截名单中，因此请求仍会正常携带番茄登录 Cookie。
 */
function getDefaultRequester(): ReadingProgressRequester {
    if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.fetch === 'function') {
        return unsafeWindow.fetch.bind(unsafeWindow)
    }
    return globalThis.fetch.bind(globalThis)
}

/**
 * 将真实进入的章节同步到番茄账号。
 *
 * 预加载逻辑不会调用本方法；只有正文挂载成功后才会同步，避免把下一章误记为已读。
 * 网络或登录失败仅记录中文警告，不中断阅读。
 *
 * @param context 当前实际展示的章节上下文。
 * @param requester 可选请求函数，默认使用页面 fetch。
 * @returns 服务端是否确认同步成功。
 */
export async function syncReadingProgress(
    context: ReadingProgressContext,
    requester: ReadingProgressRequester = getDefaultRequester(),
): Promise<boolean> {
    if (!context.bookId || !context.itemId) return false
    const chapterKey = `${context.bookId}:${context.itemId}`
    if (lastSyncedChapterKey === chapterKey) return true
    if (inFlightChapterKey === chapterKey && inFlightRequest) return inFlightRequest

    const request = (async (): Promise<boolean> => {
        try {
            const response = await requester('/api/reader/book/update_progress', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(buildReadingProgressPayload(context)),
            })
            if (!response.ok) {
                console.warn(`[fqa:进度] 同步失败，网页接口状态码：${response.status}`)
                return false
            }

            const result = await response.json() as { code?: number | string; message?: string; msg?: string }
            if (Number(result.code) !== 0) {
                console.warn('[fqa:进度] 同步未成功，请确认电脑端已登录番茄账号', result.message ?? result.msg ?? result.code)
                return false
            }
            lastSyncedChapterKey = chapterKey
            console.debug('[fqa:进度] 已同步当前章节', context.itemId)
            return true
        } catch (error) {
            console.warn('[fqa:进度] 同步请求失败，不影响当前阅读', error)
            return false
        } finally {
            if (inFlightChapterKey === chapterKey) {
                inFlightChapterKey = ''
                inFlightRequest = null
            }
        }
    })()

    inFlightChapterKey = chapterKey
    inFlightRequest = request
    return request
}

/** 仅供测试重置标签页级去重状态。 */
export function resetReadingProgressSession(): void {
    lastSyncedChapterKey = ''
    inFlightChapterKey = ''
    inFlightRequest = null
}
