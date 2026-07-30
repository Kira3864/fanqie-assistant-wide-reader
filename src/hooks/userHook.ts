import { getDetailedUserInfo, userState } from '../api/user'
import type { HookConfig } from '../config'
import bookshelf from '../assets/bookshelf.svg?raw'

function formatReadingTime(readBookTime: bigint): string {
    let minutes = readBookTime / 60_000n
    const hours = minutes / 60n
    minutes = minutes % 60n
    return `${hours} 时 ${minutes} 分`
}

function createMenuItem(text: string, icon?: string, onclick?: () => void): HTMLDivElement {
    // <div tabindex="0"
    //     role="menuitem"
    //     class="arco-menu-item serial-menu-item slogin-user-avatar__menu-item-wrapper"
    // >
    //     <div class="slogin-user-avatar__menu-item">
    //         <div class="slogin-user-avatar__menu-item__content">兑换会员</div>
    //     </div>
    // </div>
    const item = document.createElement('div')
    item.role = 'menuitem'
    item.classList.add('fqa-menu-item', 'arco-menu-item', 'serial-menu-item', 'slogin-user-avatar__menu-item-wrapper')
    const inner1 = document.createElement('div')
    inner1.classList.add('slogin-user-avatar__menu-item')
    if (icon) {
        const iconDiv = document.createElement('div')
        iconDiv.classList.add('slogin-user-avatar__menu-item__icon')
        iconDiv.innerHTML = icon
        inner1.appendChild(iconDiv)
    }
    const inner2 = document.createElement('div')
    inner2.classList.add('slogin-user-avatar__menu-item__content')
    inner2.textContent = text
    inner1.appendChild(inner2)
    item.appendChild(inner1)
    if (onclick) {
        item.addEventListener('click', onclick)
    }
    return item
}

async function mainHook(_previous?: string): Promise<void> {
    const userInfo = await getDetailedUserInfo()
    if (!userInfo) {
        return
    }

    const injected = new WeakSet<HTMLElement>()

    const inject = (menuInner: HTMLElement) => {
        if (injected.has(menuInner)) {
            return
        }
        injected.add(menuInner)
        console.log('user action dialog created', menuInner)
        const firstDiv = createMenuItem(`阅读 ${userInfo.read_book_num} 本书`)
        menuInner.insertAdjacentElement('afterbegin', firstDiv)
        const secondDiv = createMenuItem(formatReadingTime(userInfo.read_book_time ?? 0n))
        firstDiv.insertAdjacentElement('afterend', secondDiv)
        const thirdDiv = createMenuItem('我的书架', bookshelf, () => {
            window.open('https://fanqienovel.com/bookshelf', '_blank')
        })
        secondDiv.insertAdjacentElement('afterend', thirdDiv)
    }

    const scan = (root: HTMLElement) => {
        if (root.classList.contains('arco-menu-inner')) {
            inject(root)
        }
        root.querySelectorAll<HTMLElement>('.arco-menu-inner').forEach(inject)
    }

    // watch create of div.arco-menu-inner
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        scan(node)
                    }
                })
            }
        })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // 请求 userInfo 期间菜单可能已经创建
    scan(document.body)
}

function filter(path: string, _query: URLSearchParams, _hash: string): boolean {
    return userState.isLogin && !path.startsWith('/writer') && !path.startsWith('/welfare')
}

const _exports: HookConfig[] = [
    {
        id: 'userHook',
        event: 'load',
        filter,
        handler: mainHook
    }
]

export default _exports