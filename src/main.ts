import _config from './config'
import injectCSS from './cssInject'
import initFontDecrypt from './fontDecrypt'
import { onLoad, onUrlChange, onHashChange } from './hooks'
import { version, name } from '../package.json'
import initUser from './api/user'

const win = unsafeWindow

let previousUrl = win.location.href
let previousHash = win.location.hash

function installNavigationHooks() {
    for (const method of ['pushState', 'replaceState'] as const) {
        const original = win.history[method]
        win.history[method] = function (
            this: History,
            ...args: Parameters<History[typeof method]>
        ) {
            const result = original.apply(this, args)
            console.debug(`history.${method} called with args:`, args)
            void onUrlChange(previousUrl)
            previousUrl = win.location.href
            return result
        }
    }
    win.addEventListener('popstate', () => {
        void onUrlChange(previousUrl)
        previousUrl = win.location.href
    })
    win.addEventListener('hashchange', () => {
        void onHashChange(previousHash)
        previousHash = win.location.hash
    })
}

async function mainInit() {
    // config 必须最先初始化以确保一些全局函数没有被劫持
    if (_config.currentConfig) {} // force load
    console.log(`================================================`)
    console.log(`==          ${name} - ${version}         ==`)
    console.log(`================================================`)

    installNavigationHooks()

    initFontDecrypt()

    await injectCSS()

    await initUser()

    void onLoad()
}

mainInit()
