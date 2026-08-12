/** 分页阅读器内置配色。 */
export type WideReaderTheme = 'system' | 'light' | 'paper' | 'green' | 'gray' | 'dark'

/** 分页阅读器内置字体方案。 */
export type WideReaderFont = 'system' | 'yahei' | 'sans' | 'serif' | 'song' | 'kai' | 'fangsong'

/** 分页阅读器支持的全部主题，供设置归一化和测试复用。 */
export const WIDE_READER_THEMES: readonly WideReaderTheme[] = [
    'system', 'light', 'paper', 'green', 'gray', 'dark',
]

/** 分页阅读器支持的全部字体方案，供设置归一化和测试复用。 */
export const WIDE_READER_FONTS: readonly WideReaderFont[] = [
    'system', 'yahei', 'sans', 'serif', 'song', 'kai', 'fangsong',
]

/** 判断未知值是否为受支持的分页主题。 */
export function isWideReaderTheme(value: unknown): value is WideReaderTheme {
    return typeof value === 'string' && WIDE_READER_THEMES.includes(value as WideReaderTheme)
}

/** 判断未知值是否为受支持的分页字体。 */
export function isWideReaderFont(value: unknown): value is WideReaderFont {
    return typeof value === 'string' && WIDE_READER_FONTS.includes(value as WideReaderFont)
}
