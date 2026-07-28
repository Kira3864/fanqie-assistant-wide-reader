import apiFetch from '../utils/request'
import { getCookie } from '../localStorage'
import config from '../config'

export const baseUrl = 'https://api5-sinfonlinec.jxbhmy.com/redcandle/search';
export const baseQuery = {
    aid: '1967',
    app_name: 'novelapp'
}

export async function get(path: string, cookie?: boolean, query?: any, headers?: any, optionsOverride?: any): Promise<any> {
    let url = baseUrl + path;
    const sessid = getCookie('sessionid')
    let ck = sessid ? `sessionid=${sessid}` : ''
    const h = {
        Cookie: cookie ? ck : '',
        ...headers
    }
    const deviceQuery = {
        device_id: config.currentConfig.device_id,
        iid: config.currentConfig.install_id,
    }
    const finalQuery = {
        ...baseQuery,
        ...deviceQuery,
        ...query
    }
    url += '?' + new URLSearchParams(finalQuery).toString();
    const options = {
        method: 'GET',
        headers: h,
        ...optionsOverride
    }
    console.log('---start--- GET ', url, options)
    const res = await apiFetch(url, options)
    console.log('---complete--- GET ', url, res)
    return res
}

export async function post(path: string, cookie?: boolean, query?: any, body?: any, headers?: any, optionsOverride?: any): Promise<any> {
    let url = baseUrl + path;
    const sessid = getCookie('sessionid')
    let ck = sessid ? `sessionid=${sessid}` : ''
    const h = {
        Cookie: cookie ? ck : '',
        ...headers
    }
    const deviceQuery = {
        device_id: config.currentConfig.device_id,
        iid: config.currentConfig.install_id,
    }
    const finalQuery = {
        ...baseQuery,
        ...deviceQuery,
        ...query
    }
    url += '?' + new URLSearchParams(finalQuery).toString();
    const options = {
        method: 'POST',
        headers: h,
        body: body,
        ...optionsOverride
    }
    console.log('---start--- POST ', url, options)
    const res = await apiFetch(url, options)
    console.log('---complete--- POST ', url, res)
    return res
}
