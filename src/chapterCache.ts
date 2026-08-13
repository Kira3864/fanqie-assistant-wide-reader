/**
 * 章节内存缓存。
 * 仅保留当前章、下一章和当前章之前的三章，避免长时间阅读持续占用内存。
 */
export class ChapterCache<T> {
    private readonly values = new Map<string, T>()
    private readonly pending = new Map<string, Promise<T>>()

    /** 获取缓存；未命中时合并并发请求，并仅缓存成功结果。 */
    async get(itemId: string, loader: () => Promise<T>): Promise<T> {
        const cached = this.values.get(itemId)
        if (cached !== undefined) return cached
        const existing = this.pending.get(itemId)
        if (existing) return existing

        let request: Promise<T>
        request = loader()
            .then((value) => {
                // 只有仍登记中的请求可以回填，防止已淘汰的慢请求重新污染缓存窗口。
                if (this.pending.get(itemId) === request) this.values.set(itemId, value)
                return value
            })
            .finally(() => {
                if (this.pending.get(itemId) === request) this.pending.delete(itemId)
            })
        this.pending.set(itemId, request)
        return request
    }

    /** 按目录顺序裁剪缓存，保留前三章、当前章和下一章。 */
    retainWindow(currentItemId: string, orderedItemIds: string[]): void {
        const currentIndex = orderedItemIds.indexOf(currentItemId)
        if (currentIndex < 0) return
        const retained = new Set(orderedItemIds.slice(Math.max(0, currentIndex - 3), currentIndex + 2))
        for (const itemId of this.values.keys()) {
            if (!retained.has(itemId)) this.values.delete(itemId)
        }
        for (const itemId of this.pending.keys()) {
            if (!retained.has(itemId)) this.pending.delete(itemId)
        }
    }

    /** 返回当前已缓存章节编号，供诊断与自动化测试使用。 */
    keys(): string[] {
        return [...this.values.keys()]
    }
}
