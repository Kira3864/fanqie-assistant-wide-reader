import { describe, expect, it } from 'vitest'
import {
    isWideReaderFont,
    isWideReaderTheme,
    WIDE_READER_FONTS,
    WIDE_READER_THEMES,
} from '../src/wideReaderPreferences'

/** 验证新增主题和字体选项可被持久化设置安全识别。 */
describe('分页显示偏好', () => {
    /** 应包含六种内置主题，并拒绝未知主题。 */
    it('校验内置主题', () => {
        expect(WIDE_READER_THEMES).toEqual(['system', 'light', 'paper', 'green', 'gray', 'dark'])
        expect(WIDE_READER_THEMES.every(isWideReaderTheme)).toBe(true)
        expect(isWideReaderTheme('unknown')).toBe(false)
    })

    /** 应包含六种字体方案，并拒绝未知字体。 */
    it('校验内置字体', () => {
        expect(WIDE_READER_FONTS).toEqual(['system', 'sans', 'serif', 'song', 'kai', 'fangsong'])
        expect(WIDE_READER_FONTS.every(isWideReaderFont)).toBe(true)
        expect(isWideReaderFont('comic-sans')).toBe(false)
    })
})
