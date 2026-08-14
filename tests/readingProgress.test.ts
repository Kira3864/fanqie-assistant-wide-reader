import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    buildReadingProgressPayload,
    resetReadingProgressSession,
    syncReadingProgress,
} from '../src/api/readingProgress'

describe('阅读进度同步', () => {
    beforeEach(() => {
        resetReadingProgressSession()
    })

    it('按照官网字段生成章节进度，目录下标转换为从 1 开始的章节序号', () => {
        expect(buildReadingProgressPayload({
            bookId: 'book-1',
            itemId: 'chapter-2',
            chapterIndex: 1,
            genre: '0',
        }, 1_720_000_000_999)).toEqual({
            book_id: 'book-1',
            item_id: 'chapter-2',
            read_progress: 2,
            index: 2,
            read_timestamp: '1720000000',
            genre_type: '0',
        })
    })

    it('优先使用章节数据自带的官方序号', () => {
        const payload = buildReadingProgressPayload({
            bookId: 'book-1',
            itemId: 'chapter-8',
            chapterIndex: 2,
            chapterOrder: '8',
            genre: 1,
        }, 1_720_000_000_000)

        expect(payload.index).toBe(8)
        expect(payload.read_progress).toBe(8)
        expect(payload.genre_type).toBe(1)
    })

    it('使用同源 JSON 请求上报，并避免同一标签页重复上报同一章节', async () => {
        const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({ code: 0 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }))
        const context = {
            bookId: 'book-1',
            itemId: 'chapter-3',
            chapterIndex: 2,
            genre: '0',
        }

        await expect(syncReadingProgress(context, request)).resolves.toBe(true)
        await expect(syncReadingProgress(context, request)).resolves.toBe(true)

        expect(request).toHaveBeenCalledTimes(1)
        expect(request).toHaveBeenCalledWith('/api/reader/book/update_progress', expect.objectContaining({
            method: 'POST',
            credentials: 'include',
            body: expect.stringContaining('"item_id":"chapter-3"'),
        }))
    })

    it('服务端拒绝时允许下一次重试当前章节', async () => {
        const request = vi.fn()
            .mockResolvedValueOnce(new Response(JSON.stringify({ code: 1001, message: '请登录' }), { status: 200 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ code: 0 }), { status: 200 }))
        const context = { bookId: 'book-1', itemId: 'chapter-1', chapterIndex: 0 }

        await expect(syncReadingProgress(context, request)).resolves.toBe(false)
        await expect(syncReadingProgress(context, request)).resolves.toBe(true)
        expect(request).toHaveBeenCalledTimes(2)
    })
})
