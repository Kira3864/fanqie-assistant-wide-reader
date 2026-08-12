import { describe, expect, it } from 'vitest'
import { parseWebCatalogPayload } from '../src/api/catalogParser'

/** 官方网页目录适配器的回归测试。 */
describe('网页目录解析', () => {
    /** 验证当前官方 chapterListWithVolume 响应。 */
    it('解析按卷分组的官方目录', () => {
        const chapters = parseWebCatalogPayload({
            code: 0,
            data: {
                chapterListWithVolume: [[
                    { itemId: '100', title: '第一章', firstPassTime: '1', chapterWordNumber: '1200' },
                    { itemId: '101', title: '第二章', firstPassTime: '2', chapterWordNumber: '1300' },
                ]],
            },
        })

        expect(chapters).toEqual([
            expect.objectContaining({ item_id: '100', title: '第一章', chapter_word_number: 1200 }),
            expect.objectContaining({ item_id: '101', title: '第二章', chapter_word_number: 1300 }),
        ])
    })

    /** 验证接口字段变化后的兼容分支。 */
    it('兼容卷对象与 snake_case 章节字段', () => {
        const chapters = parseWebCatalogPayload({
            code: '0',
            data: {
                volumes: [{
                    chapters: [{ item_id: '200', chapter_title: '新章节', volume_name: '第一卷' }],
                }],
            },
        })

        expect(chapters).toEqual([
            expect.objectContaining({ item_id: '200', title: '新章节', volume_name: '第一卷' }),
        ])
    })

    /** 验证错误响应不会伪造目录。 */
    it('拒绝错误响应和无标题条目', () => {
        expect(parseWebCatalogPayload({ code: -1, data: {} })).toEqual([])
        expect(parseWebCatalogPayload({ code: 0, data: { chapterList: [{ itemId: '300' }] } })).toEqual([])
    })
})
