import apiFetch from '../utils/request'
import { signRequest } from '../crypto/sign'
import config, { fetch as pageFetch } from '../config'
import { settings } from '../settings'


export const appBaseUrl = 'https://reading.snssdk.com/reading'
export const redcandleBaseUrl = 'https://api5-sinfonlinec.jxbhmy.com/reading'
/**
 * 番茄网页站同源挂载的 APP 接口。走页面 fetch 时浏览器会自动带上 Cookie，
 * 其中包括脚本读不到的 HttpOnly sessionid —— 个人化推荐就靠这个。
 */
export const webBaseUrl = 'https://fanqienovel.com/reading'
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
        update_version_code: '70132',
        manifest_version_code: '70132',
        ...extra,
    })
}


/**
 * 同源请求。签名依然必须，但同源可以自由设置自定义请求头，
 * 且 Cookie 由浏览器附带，脚本不接触任何凭据。
 *
 * @param credentials 'include' 带登录态（个人化），'omit' 匿名
 */
export async function webGet(
    path: string,
    query?: Record<string, string>,
    credentials: RequestCredentials = 'omit',
): Promise<any> {
    const url = `${webBaseUrl}${path}?${buildAppQuery(query).toString()}`
    const signed = await signRequest(url)
    // User-Agent 是浏览器保留头，这里设不了，也没必要设
    const res = await pageFetch(url, { headers: signed, credentials })
    if (!res.ok) {
        throw new Error(`请求失败(${res.status})`)
    }
    return res.json()
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
