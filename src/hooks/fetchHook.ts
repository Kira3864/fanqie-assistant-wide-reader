import type { HookConfig } from "../config"

// disable report
const blackList = [
    'mcs.zijieapi.com',
    'vcs.zijieapi.com/vc/setting',
    'mon.zijieapi.com',
    'mssdk.bytedance.com/web/common',
    'hm.baidu.com'
]

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
        return new Promise(() => {
            return new Response('{}', { status: 403 })
        })
    }

    return originalFetch(input, init)
}

const originalXMLHttpRequest = unsafeWindow.XMLHttpRequest

unsafeWindow.XMLHttpRequest = class XMLHttpRequest extends originalXMLHttpRequest {
    open(method: string, url: string, async: boolean = true, user?: string | null, password?: string | null): void {
        if (checkBlack(url)) {
            console.log('blocked request: ' + url)
            this.abort()
        } else {
            super.open(method, url, async, user, password)
        }
    }
}

// 执行期hook，所以不用显式声明事件类hook
const _exports: HookConfig[] = []

export default _exports
