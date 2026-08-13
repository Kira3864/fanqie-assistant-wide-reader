import { describe, expect, it, vi } from 'vitest'
import { ChapterCache } from '../src/chapterCache'

/** 验证章节预取缓存的请求合并与窗口淘汰规则。 */
describe('章节内存缓存', () => {
    /** 同一章节的并发读取只能触发一次网络加载。 */
    it('合并同一章节的并发请求', async () => {
        const cache = new ChapterCache<string>()
        const loader = vi.fn(async () => '正文')

        await Promise.all([cache.get('4', loader), cache.get('4', loader)])

        expect(loader).toHaveBeenCalledTimes(1)
    })

    /** 阅读到第五章时只保留前 3 章、当前章和下一章。 */
    it('裁剪为三章历史窗口', async () => {
        const cache = new ChapterCache<string>()
        for (const id of ['1', '2', '3', '4', '5', '6', '7']) {
            await cache.get(id, async () => id)
        }

        cache.retainWindow('5', ['1', '2', '3', '4', '5', '6', '7'])

        expect(cache.keys()).toEqual(['2', '3', '4', '5', '6'])
    })

    /** 已被新窗口淘汰的慢请求完成后不得重新写回缓存。 */
    it('阻止过期预取请求回填', async () => {
        const cache = new ChapterCache<string>()
        let finish!: (value: string) => void
        const staleRequest = cache.get('1', () => new Promise((resolve) => { finish = resolve }))

        cache.retainWindow('5', ['1', '2', '3', '4', '5', '6'])
        finish('过期正文')
        await staleRequest

        expect(cache.keys()).not.toContain('1')
    })
})
