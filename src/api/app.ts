import apiFetch from '../utils/request'
import { signRequest } from '../crypto/sign'
import config from '../config'
import { settings } from '../settings'


export const appBaseUrl = 'https://reading.snssdk.com/reading'
export const redcandleBaseUrl = 'https://api5-sinfonlinec.jxbhmy.com/reading'
export const appUserAgent = 'com.dragon.read'


export function buildAppQuery(extra?: Record<string, string>): URLSearchParams {
    const c = config.currentConfig
    return new URLSearchParams({
        iid: c.install_id,
        device_id: c.device_id,
        ac: 'wifi',
        channel: '43536163a',
        aid: '1967',
        app_name: 'novelapp',
        version_code: '70132',
        version_name: '7.0.1.32',
        device_platform: 'android',
        os: 'android',
        ssmix: 'a',
        os_version: '10',
        device_type: c.device_type || 'P30',
        device_brand: c.device_brand || 'realme',
        ...extra,
    })
}


function isUsable(res: any): boolean {
    if (!res || res.status !== 200) return false
    try {
        const j = res.json()
        return !j || j.code === undefined || j.code === 0
    } catch {
        return false
    }
}


async function requestApp(path: string, query?: Record<string, string>, headers?: Record<string, string>) {
    const url = `${appBaseUrl}${path}?${buildAppQuery(query).toString()}`
    const signed = await signRequest(url)
    return apiFetch(url, {
        method: 'GET',
        headers: { ...signed, 'User-Agent': appUserAgent, ...headers },
    })
}


async function requestRedcandle(path: string, query?: Record<string, string>, headers?: Record<string, string>) {
    const url = `${redcandleBaseUrl}${path}?${buildAppQuery(query).toString()}`
    return apiFetch(url, {
        method: 'GET',
        headers: { 'User-Agent': appUserAgent, ...headers },
    })
}


export async function appGet(
    path: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
): Promise<any> {
    if (settings.apiPreference === 'redcandle') {
        try {
            const res = await requestRedcandle(path, query, headers)
            if (isUsable(res)) return res
            console.warn(`[fqa:api] 红烛接口数据不全，回落到番茄 APP: ${path}`)
        } catch (e) {
            console.warn(`[fqa:api] 红烛接口请求失败，回落到番茄 APP: ${path}`, e)
        }
    }
    return requestApp(path, query, headers)
}


export async function appPost(
    path: string,
    body: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
): Promise<any> {
    const url = `${appBaseUrl}${path}?${buildAppQuery(query).toString()}`
    const signed = await signRequest(url, body)
    console.log('---start--- APP POST ', url)
    const res = await apiFetch(url, {
        method: 'POST',
        headers: {
            ...signed,
            'User-Agent': appUserAgent,
            'Content-Type': 'application/json; charset=utf-8',
            ...headers,
        },
        body,
    })
    console.log('---complete--- APP POST ', url, res)
    return res
}
