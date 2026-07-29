import config, { type KeyInfo } from '../config'
import { get, post } from '.'
import { encryptKeyinfoBody, decryptKeyinfoResponse, decryptChapter, b64decode, b64encode } from '../utils/crypto'
import { read, write } from '../localStorage'

async function refreshKeyinfo(): Promise<void> {
    const b = await encryptKeyinfoBody(config.currentConfig)
    const res = await post('/reader/crypt/registerkey/v1', false, {}, b)
    console.log(res)
    const j = res.json()
    console.log('response: ', j)
    const ek = j?.data?.key
    if (!ek) {
        throw new Error('Failed to get key info')
    }
    const key = await decryptKeyinfoResponse(ek)
    const keyinfo: KeyInfo = {
        key,
        keyver: j?.data?.keyver as number,
    }
    console.log('Refreshed key info:', keyinfo)
    config.currentConfig.key_info = keyinfo
    write('keyinfo', {
        key: b64encode(key),
        keyver: j?.data?.keyver as number,
    }) // cache key info
}

async function ensureKeyinfo(expectedKeyVersion?: number): Promise<void> {
    const keyinfo = config.currentConfig.key_info
    const cachedKeyInfo = read('keyinfo')
    console.log('cached key info: ', cachedKeyInfo)
    if (cachedKeyInfo) {
        const cki = {
            key: b64decode(cachedKeyInfo.key),
            keyver: cachedKeyInfo.keyver,
        } as KeyInfo
        /*
        console.log({
            expectedKeyVersion,
            cki,
            assert: cki.keyver === expectedKeyVersion, // assert key version
        })
        */
        if (typeof expectedKeyVersion === 'undefined' || cki.keyver === expectedKeyVersion) {
            config.currentConfig.key_info = cki
            return
        }
    }
    if (!keyinfo) {
        // get from zero
        return await refreshKeyinfo()
    }
    if (keyinfo?.keyver !== expectedKeyVersion) {
        // refresh from server
        return await refreshKeyinfo()
    }
}

export async function getChapter(itemId: string, _retry?: number): Promise<any> {
    if (typeof _retry === 'undefined') _retry = 0
    if (_retry > 5) {
        throw new Error(`Failed to get chapter: ${itemId}`)
    }
    if (!config.currentConfig.key_info) {
        await ensureKeyinfo()
    }
    const res = await get(`/reader/full/v1`, false, { item_id: itemId })
    const j = res.json()?.data
    if (!j) {
        console.warn('Failed to get chapter: ', itemId, ', response: ', j)
        return await getChapter(itemId, _retry + 1)
        // throw new Error('Failed to get chapter')
    }
    if (j?.content === 'Invalid' || j?.key_version !== config.currentConfig.key_info?.keyver) { // keyreg expired
        console.warn('Key reg expired, regster again and retrying...')
        await ensureKeyinfo(parseInt(j?.key_version))
        return await getChapter(itemId, _retry + 1)
    }
    j.content = await decryptChapter(j?.content, config.currentConfig)
    return j
}

export async function getChapterInfo(itemId: string): Promise<unknown> {
    // use page fetch (includes bytedance security sdk. we reuse it)
    // same origin
    const res = await fetch('https://fanqienovel.com/api/reader/full?itemId=' + itemId)
    return await res.json()
}