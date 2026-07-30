import type { HookConfig } from "../config"

// disable report
const blackList = [
    'mcs.zijieapi.com',
    'vcs.zijieapi.com/vc/setting',
    'mon.zijieapi.com',
    'mssdk.bytedance.com/web/common',
    'hm.baidu.com'
]

const BLOCKED_BODY = JSON.stringify({
    e: 0,
    sc: 10,
    tc: 10
})

function checkBlack(url: string): boolean {
    return blackList.some(black => url.includes(black))
}

const originalFetch = unsafeWindow.fetch.bind(unsafeWindow)

unsafeWindow.fetch = function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let url: string

    if (input instanceof Request) {
        url = input.url
    } else if (input instanceof URL) {
        url = input.href
    } else {
        url = input
    }

    if (checkBlack(url)) {
        console.log('blocked request: ' + url)
        return Promise.resolve(new Response(BLOCKED_BODY, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }))
    }

    return originalFetch(input, init)
}

const originalXMLHttpRequest = unsafeWindow.XMLHttpRequest

unsafeWindow.XMLHttpRequest = class XMLHttpRequest extends originalXMLHttpRequest {
    private _blockedUrl?: string

    open(method: string, url: string, async: boolean = true, user?: string | null, password?: string | null): void {
        if (checkBlack(url)) {
            console.log('blocked request: ' + url)
            this._blockedUrl = url
            return
        }
        this._blockedUrl = undefined
        super.open(method, url, async, user, password)
    }

    setRequestHeader(name: string, value: string): void {
        if (this._blockedUrl !== undefined) return
        super.setRequestHeader(name, value)
    }

    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        if (this._blockedUrl === undefined) {
            super.send(body)
            return
        }
        const url = this._blockedUrl
        const shadow = (prop: string, value: unknown) =>
            Object.defineProperty(this, prop, { configurable: true, get: () => value })

        setTimeout(() => {
            shadow('readyState', 4)
            shadow('status', 200)
            shadow('statusText', 'OK')
            shadow('responseURL', url)
            shadow('responseText', this.responseType === '' || this.responseType === 'text' ? BLOCKED_BODY : '')
            shadow('response', this.responseType === 'json' ? {
                "e": 0,
                "sc": 10,
                "tc": 10
            } : BLOCKED_BODY)
            this.dispatchEvent(new Event('readystatechange'))
            this.dispatchEvent(new ProgressEvent('load'))
            this.dispatchEvent(new ProgressEvent('loadend'))
        }, 0)
    }

    abort(): void {
        if (this._blockedUrl !== undefined) return
        super.abort()
    }

    getAllResponseHeaders(): string {
        if (this._blockedUrl !== undefined) return 'content-type: application/json\r\n'
        return super.getAllResponseHeaders()
    }

    getResponseHeader(name: string): string | null {
        if (this._blockedUrl !== undefined) {
            return name.toLowerCase() === 'content-type' ? 'application/json' : null
        }
        return super.getResponseHeader(name)
    }
}

// 执行期hook，所以不用显式声明事件类hook
const _exports: HookConfig[] = []

export default _exports
