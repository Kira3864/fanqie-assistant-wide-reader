import { reactive, watch } from 'vue'
import { read, write } from './localStorage'
import {
    isWideReaderFont,
    isWideReaderTheme,
    type WideReaderFont,
    type WideReaderTheme,
} from './wideReaderPreferences'

const STORE_KEY = 'settings'

/** API 偏好 */
export type ApiPreference = 'app' | 'redcandle'

export interface Settings {
    /* --- 常规 --- */
    /** 解密网页端混淆字体 */
    decryptFont: boolean
    /** 拦截网页事件上报 */
    blockReport: boolean
    /** 允许阅读器复制文本 */
    allowCopy: boolean

    /* --- 界面 --- */
    /** 阅读器字体，空字符串表示跟随页面默认 */
    readerFont: string
    /** 是否应用自定义 CSS */
    customCssEnabled: boolean
    /** 自定义 CSS 内容。关闭开关时仍然保留，只是不应用 */
    customCss: string
    /** 是否在文字章节中自动启用沉浸式分页阅读 */
    wideReaderEnabled: boolean
    /** 上次是否停留在分页模式；退出后刷新页面仍保持退出状态 */
    wideReaderActive: boolean
    /** 沉浸式阅读主题 */
    wideReaderTheme: WideReaderTheme
    /** 沉浸式阅读字体方案 */
    wideReaderFont: WideReaderFont
    /** 沉浸式阅读字号，单位为像素 */
    wideReaderFontSize: number
    /** 沉浸式阅读行高 */
    wideReaderLineHeight: number
    /** 沉浸式阅读栏间距，单位为像素 */
    wideReaderColumnGap: number
    /** 沉浸式阅读页边距，单位为像素 */
    wideReaderPageMargin: number

    /* --- 搜索 --- */
    /** 接管网页搜索界面 */
    enhanceSearch: boolean
    /** 搜索时携带登录态以获取个人化推荐 */
    searchPersonalized: boolean

    /* --- 协议 --- */
    apiPreference: ApiPreference
    /** 用户手动指定的设备信息，留空表示用脚本自动注册的设备 */
    deviceId: string
    installId: string
    deviceType: string
}

export const DEFAULT_SETTINGS: Settings = {
    decryptFont: true,
    blockReport: true,
    allowCopy: true,

    readerFont: '',
    customCssEnabled: false,
    customCss: '',
    wideReaderEnabled: true,
    wideReaderActive: true,
    wideReaderTheme: 'system',
    wideReaderFont: 'system',
    wideReaderFontSize: 18,
    wideReaderLineHeight: 1.9,
    wideReaderColumnGap: 64,
    wideReaderPageMargin: 72,

    enhanceSearch: true,
    // 默认关：携带登录态属于额外的隐私暴露，交给用户显式开启
    searchPersonalized: false,

    apiPreference: 'app',
    deviceId: '',
    installId: '',
    deviceType: '',
}

/** 只取已知字段，避免旧版本残留的键污染 */
function normalize(raw: unknown): Settings {
    const s = { ...DEFAULT_SETTINGS }
    if (!raw || typeof raw !== 'object') return s
    const o = raw as Record<string, unknown>
    for (const key of Object.keys(DEFAULT_SETTINGS) as Array<keyof Settings>) {
        const v = o[key]
        if (v === undefined || v === null) continue
        if (typeof DEFAULT_SETTINGS[key] === typeof v) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (s as any)[key] = v
        }
    }
    if (s.apiPreference !== 'app' && s.apiPreference !== 'redcandle') {
        s.apiPreference = DEFAULT_SETTINGS.apiPreference
    }
    if (!isWideReaderTheme(s.wideReaderTheme)) {
        s.wideReaderTheme = DEFAULT_SETTINGS.wideReaderTheme
    }
    if (!isWideReaderFont(s.wideReaderFont)) {
        s.wideReaderFont = DEFAULT_SETTINGS.wideReaderFont
    }
    s.wideReaderFontSize = clamp(s.wideReaderFontSize, 16, 24, DEFAULT_SETTINGS.wideReaderFontSize)
    s.wideReaderLineHeight = clamp(s.wideReaderLineHeight, 1.4, 2.6, DEFAULT_SETTINGS.wideReaderLineHeight)
    s.wideReaderColumnGap = clamp(s.wideReaderColumnGap, 32, 112, DEFAULT_SETTINGS.wideReaderColumnGap)
    s.wideReaderPageMargin = clamp(s.wideReaderPageMargin, 32, 120, DEFAULT_SETTINGS.wideReaderPageMargin)
    return s
}

/** 将持久化的排版数值限制在安全区间内。 */
function clamp(value: number, min: number, max: number, fallback: number): number {
    return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback
}

/** 全局设置对象。直接改字段即可，会自动持久化 */
export const settings = reactive<Settings>(normalize(read(STORE_KEY)))

let saveTimer: ReturnType<typeof setTimeout> | undefined

watch(
    settings,
    () => {
        // 输入框逐字符触发，节流后再写盘
        if (saveTimer) clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
            saveTimer = undefined
            write(STORE_KEY, { ...settings })
        }, 200)
    },
    { deep: true }
)

/** 立即落盘（用于关闭面板等需要确保写入的场合） */
export function flushSettings(): void {
    if (saveTimer) {
        clearTimeout(saveTimer)
        saveTimer = undefined
    }
    write(STORE_KEY, { ...settings })
}

/** 恢复默认值 */
export function resetSettings(): void {
    Object.assign(settings, DEFAULT_SETTINGS)
    flushSettings()
}
