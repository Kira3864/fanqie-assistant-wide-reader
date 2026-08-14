import { describe, expect, it } from 'vitest'
import {
    normalizeBookshelfColumns,
    resolveWideReaderActive,
} from '../src/settingsNormalization'

describe('界面设置归一化', () => {
    it('书架默认每行显示 5 本', () => {
        expect(normalizeBookshelfColumns(undefined)).toBe(5)
    })

    it('书架列数只允许 4 到 10 的整数', () => {
        expect(normalizeBookshelfColumns(3)).toBe(4)
        expect(normalizeBookshelfColumns(7.8)).toBe(8)
        expect(normalizeBookshelfColumns(12)).toBe(10)
        expect(normalizeBookshelfColumns('无效')).toBe(5)
    })

    it('旧版总开关关闭时迁移为不进入分页模式', () => {
        expect(resolveWideReaderActive({ wideReaderEnabled: false, wideReaderActive: true })).toBe(false)
    })

    it('旧版总开关开启时保留用户上次退出分页的状态', () => {
        expect(resolveWideReaderActive({ wideReaderEnabled: true, wideReaderActive: false })).toBe(false)
        expect(resolveWideReaderActive({ wideReaderEnabled: true, wideReaderActive: true })).toBe(true)
    })
})
