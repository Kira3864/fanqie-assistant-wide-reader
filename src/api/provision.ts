// 设备的持久化与初始化。
// 首次使用时注册新设备并激活会员，之后从本地缓存复用。

import config, { defaultConfig, type DeviceConfig } from '../config'
import { b64decode, b64encode } from '../crypto'
import { read, write } from '../localStorage'
import { registerDevice, activatePremium, registerKey } from './device'
import { settings } from '../settings'

const STORE_KEY = 'device'

interface StoredDevice {
    device_id: string;
    install_id: string;
    device_type?: string;
    device_brand?: string;
    vip_expire_time?: string;
    key?: string; // base64
    keyver?: number;
}

function load(): DeviceConfig | null {
    const s = read(STORE_KEY) as StoredDevice | null
    if (!s?.device_id || !s?.install_id) return null
    return {
        device_id: s.device_id,
        install_id: s.install_id,
        device_type: s.device_type,
        device_brand: s.device_brand,
        key_info: s.key ? { key: b64decode(s.key), keyver: s.keyver } : undefined,
    }
}

function save(c: DeviceConfig, vipExpireTime?: string): void {
    const s: StoredDevice = {
        device_id: c.device_id,
        install_id: c.install_id,
        device_type: c.device_type,
        device_brand: c.device_brand,
        vip_expire_time: vipExpireTime,
    }
    if (c.key_info?.key) {
        s.key = b64encode(c.key_info.key)
        s.keyver = c.key_info.keyver
    }
    write(STORE_KEY, s)
}

/**
 * 注册一台新设备（含会员激活与密钥注册），并设为当前设备。
 * 对应 Go 的 registerSingleDevice。
 */
export async function provisionDevice(): Promise<DeviceConfig> {
    const dev = await registerDevice()
    const vipExpireTime = await activatePremium(dev)
    const keyInfo = await registerKey(dev)

    const c: DeviceConfig = {
        device_id: dev.device_id,
        install_id: dev.install_id,
        device_type: dev.device_type,
        key_info: keyInfo,
    }
    config.currentConfig = c
    save(c, vipExpireTime)
    return c
}

/**
 * 确保当前有可用设备。优先级：
 *   设置里手填的设备 > 本地缓存的已注册设备 > 新注册
 * 注册失败时退回内置匿名设备，保证功能可降级使用。
 */
export async function ensureDevice(): Promise<DeviceConfig> {
    // 手填的设备信息优先，三项都填了才算有效
    const { deviceId, installId, deviceType } = settings
    if (deviceId.trim() && installId.trim()) {
        const manual: DeviceConfig = {
            device_id: deviceId.trim(),
            install_id: installId.trim(),
            device_type: deviceType.trim() || undefined,
            // 手填设备没有密钥，正文接口会按需自行注册
            key_info: undefined,
        }
        config.currentConfig = manual
        console.log('使用设置里手填的设备:', manual.device_id)
        return manual
    }

    const cached = load()
    if (cached) {
        config.currentConfig = cached
        console.log('复用已缓存设备:', cached.device_id)
        return cached
    }
    try {
        return await provisionDevice()
    } catch (e) {
        console.warn('设备注册失败，回退到内置匿名设备:', e)
        config.currentConfig = defaultConfig
        return defaultConfig
    }
}
