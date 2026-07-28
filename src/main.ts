import injectCSS from './cssInject'
import initFontDecrypt from './fontDecrypt'
import { onLoad, onUrlChange, onHashChange } from './hooks'
import { version, name } from '../package.json'
import initUser from './api/user'

let previousUrl = window.location.href
let previousHash = window.location.hash

async function mainInit() {
    console.log(`================================================`)
    console.log(`==          ${name} - ${version}         ==`)
    console.log(`================================================`)
    initFontDecrypt()
    await injectCSS()
    for (const method of ['pushState', 'replaceState'] as const) {
        const original = history[method];
        history[method] = function (
            this: History,
            ...args: Parameters<History[typeof method]>
        ) {
            const result = original.apply(this, args);
            console.debug(`history.${method} called with args:`, args);
            onUrlChange(previousUrl);
            previousUrl = window.location.href;
            return result;
        };
    }
    window.addEventListener('load', async () => {
        await onLoad()
    })
    window.addEventListener('hashchange', async () => {
        await onHashChange(previousHash)
        previousHash = window.location.hash
    })
    window.addEventListener('popstate', async () => {
        await onUrlChange(previousUrl)
        previousUrl = window.location.href
    })
    await initUser()
}

mainInit()