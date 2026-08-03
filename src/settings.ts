import { reactive, watch } from 'vue'
import { read, write } from './localStorage'

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
    return s
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
