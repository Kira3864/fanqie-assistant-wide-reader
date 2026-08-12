import { watch } from 'vue'
import type { Book, ChapterItem } from './types'
import { settings } from './settings'
import wideReaderCss from './assets/wideReader.css?raw'
import { bindFootnoteInteraction } from './utils/footnote'

/** 分页阅读器同步时需要的章节快照。 */
export interface WideReaderSnapshot {
    itemId: string
    title: string
    book: Book | null
    source: HTMLElement
    comic: boolean
}

/** 阅读器一次布局测量得到的分页几何信息。 */
interface WideReaderLayout {
    columnsPerSpread: 1 | 2
    totalSpreads: number
    spreadStep: number
}

/** 当前分页阅读器运行时持有的 DOM 和事件清理函数。 */
interface WideReaderRuntime {
    root: HTMLElement
    frame: HTMLElement
    article: HTMLElement
    indicator: HTMLOutputElement
    snapshot: WideReaderSnapshot
    spread: number
    layout: WideReaderLayout
    cleanup: Array<() => void>
}

/** 分页阅读器固定控制按钮的集合。 */
interface WideReaderControls {
    directoryButton: HTMLButtonElement
    settingsButton: HTMLButtonElement
    exitButton: HTMLButtonElement
    leftButton: HTMLButtonElement
    rightButton: HTMLButtonElement
    previousChapterButton: HTMLButtonElement
    nextChapterButton: HTMLButtonElement
}

/** 保存在油猴存储中的章节内位置。 */
interface SavedPosition {
    blockIndex: number
}

const ROOT_ID = 'fqa-wide-reader-root'
const POSITION_PREFIX = 'wide-reader-position:'
let runtime: WideReaderRuntime | null = null
let lastSnapshot: WideReaderSnapshot | null = null
let styleInjected = false
let previousDocumentOverflow: string | null = null

/**
 * 将助手已经解锁并净化的正文同步到沉浸式分页层。
 * 漫画章节继续使用原助手的纵向阅读方式，避免破坏图片解密与懒加载。
 */
export function syncWideReader(snapshot: WideReaderSnapshot): void {
    lastSnapshot = snapshot
    if (!settings.wideReaderEnabled || snapshot.comic) {
        unmountWideReader()
        return
    }
    mountWideReader(snapshot)
}

/** 退出当前分页层并恢复网页滚动。 */
export function unmountWideReader(): void {
    if (!runtime) return
    runtime.cleanup.forEach((dispose) => dispose())
    runtime.root.remove()
    runtime = null
    if (previousDocumentOverflow === null) document.documentElement.style.removeProperty('overflow')
    else document.documentElement.style.overflow = previousDocumentOverflow
    previousDocumentOverflow = null
}

/** 注入一次经过作用域隔离的分页样式。 */
function ensureWideReaderStyle(): void {
    if (styleInjected) return
    GM_addStyle(wideReaderCss)
    styleInjected = true
}

/** 创建并挂载一个新的分页阅读器实例。 */
function mountWideReader(snapshot: WideReaderSnapshot): void {
    unmountWideReader()
    ensureWideReaderStyle()

    const root = document.createElement('main')
    root.id = ROOT_ID
    root.dataset.theme = settings.wideReaderTheme
    root.setAttribute('aria-label', '沉浸式分页阅读器')
    applyReaderVariables(root)

    const topSensor = createElement('div', 'fqa-wide-top-sensor')
    const topControls = createElement('header', 'fqa-wide-controls fqa-wide-top-controls')
    const directoryButton = createButton('目录', '打开目录')
    const settingsButton = createButton('显示', '打开显示设置')
    const title = createElement('span', 'fqa-wide-title')
    title.textContent = snapshot.title
    const exitButton = createButton('退出分页', '退出沉浸式分页阅读')
    exitButton.classList.add('fqa-wide-exit')
    topControls.append(directoryButton, settingsButton, title, exitButton)

    const leftButton = createButton('‹', '上一页')
    leftButton.className = 'fqa-wide-edge fqa-wide-edge-left'
    const rightButton = createButton('›', '下一页')
    rightButton.className = 'fqa-wide-edge fqa-wide-edge-right'

    const frame = createElement('div', 'fqa-wide-frame')
    const article = createElement('article', 'fqa-wide-article')
    article.setAttribute('aria-label', snapshot.title)
    const heading = document.createElement('h1')
    heading.textContent = snapshot.title
    heading.dataset.blockIndex = '0'
    article.append(heading)
    appendChapterContent(article, snapshot.source)
    // DOM 克隆不会复制事件监听器，因此在分页文章上重新绑定脚注交互。
    bindFootnoteInteraction(article)
    frame.append(article)

    const indicator = document.createElement('output')
    indicator.className = 'fqa-wide-indicator'
    indicator.textContent = '1/1'

    const bottomSensor = createElement('div', 'fqa-wide-bottom-sensor')
    const bottomControls = createElement('footer', 'fqa-wide-controls fqa-wide-bottom-controls')
    const previousChapterButton = createButton('‹ 上一章', '上一章')
    const chapterStatus = createElement('span', 'fqa-wide-title')
    chapterStatus.textContent = snapshot.title
    const nextChapterButton = createButton('下一章 ›', '下一章')
    bottomControls.append(previousChapterButton, chapterStatus, nextChapterButton)

    root.append(
        topSensor,
        topControls,
        leftButton,
        frame,
        rightButton,
        indicator,
        bottomSensor,
        bottomControls,
    )
    document.body.append(root)
    previousDocumentOverflow = document.documentElement.style.overflow || null
    document.documentElement.style.overflow = 'hidden'

    const nextRuntime: WideReaderRuntime = {
        root,
        frame,
        article,
        indicator,
        snapshot,
        spread: 0,
        layout: { columnsPerSpread: 2, totalSpreads: 1, spreadStep: 1 },
        cleanup: [],
    }
    runtime = nextRuntime

    bindReaderEvents(nextRuntime, {
        directoryButton,
        settingsButton,
        exitButton,
        leftButton,
        rightButton,
        previousChapterButton,
        nextChapterButton,
    })
    requestAnimationFrame(() => {
        if (runtime !== nextRuntime) return
        measureAndRestore(nextRuntime)
    })
}

/** 将来源正文复制到分页文章，并为语义位置保存标记稳定的块序号。 */
function appendChapterContent(article: HTMLElement, source: HTMLElement): void {
    const fragment = document.createDocumentFragment()
    const sourceArticle = source.querySelector<HTMLElement>(':scope > article')
    const children = [...(sourceArticle ?? source).children]
    children.forEach((child, index) => {
        const clone = child.cloneNode(true) as HTMLElement
        clone.dataset.blockIndex = String(index + 1)
        fragment.append(clone)
    })
    article.append(fragment)
}

/** 绑定分页、目录、设置和窗口变化事件。 */
function bindReaderEvents(
    current: WideReaderRuntime,
    controls: WideReaderControls,
): void {
    const turnPrevious = () => turnPage(current, 'previous')
    const turnNext = () => turnPage(current, 'next')
    controls.leftButton.addEventListener('click', turnPrevious)
    controls.rightButton.addEventListener('click', turnNext)
    controls.previousChapterButton.addEventListener('click', () => navigateChapter(current, 'previous'))
    controls.nextChapterButton.addEventListener('click', () => navigateChapter(current, 'next'))
    controls.directoryButton.addEventListener('click', () => openDirectory(current))
    controls.settingsButton.addEventListener('click', () => openReaderSettings(current))
    controls.exitButton.addEventListener('click', () => {
        settings.wideReaderEnabled = false
        unmountWideReader()
    })

    let wheelTotal = 0
    let wheelLockedUntil = 0
    const onWheel = (event: WheelEvent) => {
        event.preventDefault()
        const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
        wheelTotal += dominantDelta
        const now = performance.now()
        if (now < wheelLockedUntil || Math.abs(wheelTotal) < 80) return
        wheelLockedUntil = now + 420
        const direction = wheelTotal > 0 ? 'next' : 'previous'
        wheelTotal = 0
        turnPage(current, direction)
    }
    current.root.addEventListener('wheel', onWheel, { passive: false })

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented || isEditableTarget(event.target)) return
        if (event.key === 'ArrowRight' || event.key === 'PageDown') {
            event.preventDefault()
            event.stopImmediatePropagation()
            turnPage(current, 'next')
        } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            event.preventDefault()
            event.stopImmediatePropagation()
            turnPage(current, 'previous')
        }
    }
    window.addEventListener('keydown', onKeyDown, true)

    const observer = new ResizeObserver(() => measureAndRestore(current, capturePosition(current)))
    observer.observe(current.frame)
    observer.observe(current.article)

    current.cleanup.push(
        () => controls.leftButton.removeEventListener('click', turnPrevious),
        () => controls.rightButton.removeEventListener('click', turnNext),
        () => current.root.removeEventListener('wheel', onWheel),
        () => window.removeEventListener('keydown', onKeyDown, true),
        () => observer.disconnect(),
    )
}

/** 测量 CSS 多栏的实际宽度并恢复指定语义块所在页。 */
function measureAndRestore(current: WideReaderRuntime, position?: SavedPosition | null): void {
    if (runtime !== current) return
    const layout = measureLayout(current.frame, current.article)
    current.layout = layout
    const openAtEnd = sessionStorage.getItem('fqa-wide-reader-open-at-end') === current.snapshot.itemId
    if (openAtEnd) {
        current.spread = layout.totalSpreads - 1
        sessionStorage.removeItem('fqa-wide-reader-open-at-end')
        paintSpread(current)
        return
    }
    const saved = position ?? loadPosition(current.snapshot.itemId)
    const target = saved
        ? current.article.querySelector<HTMLElement>(`[data-block-index="${saved.blockIndex}"]`)
        : null
    const targetSpread = target
        ? Math.floor(Math.max(0, target.offsetLeft) / Math.max(1, layout.spreadStep))
        : current.spread
    current.spread = clamp(targetSpread, 0, layout.totalSpreads - 1)
    paintSpread(current)
}

/** 从多栏容器的实际横向延展计算总页数。 */
function measureLayout(frame: HTMLElement, article: HTMLElement): WideReaderLayout {
    const columnsPerSpread: 1 | 2 = frame.clientWidth >= 920 ? 2 : 1
    const computed = getComputedStyle(article)
    const gap = Number.parseFloat(computed.columnGap) || 0
    const fallbackWidth = (frame.clientWidth - gap * (columnsPerSpread - 1)) / columnsPerSpread
    const columnWidth = Number.parseFloat(computed.columnWidth) || fallbackWidth
    const columnStep = Math.max(1, columnWidth + gap)
    const blocks = article.querySelectorAll<HTMLElement>('[data-block-index]')
    const last = blocks[blocks.length - 1]
    let extent = Math.max(frame.scrollWidth, article.scrollWidth, frame.clientWidth)
    if (last) extent = Math.max(extent, last.offsetLeft + Math.max(1, last.offsetWidth))
    const totalColumns = Math.max(1, Math.round((extent + gap * 0.25) / columnStep))
    return {
        columnsPerSpread,
        totalSpreads: Math.max(1, Math.ceil(totalColumns / columnsPerSpread)),
        spreadStep: columnsPerSpread * columnStep,
    }
}

/** 翻到上一页或下一页；到达章节边界时自动切章。 */
function turnPage(current: WideReaderRuntime, direction: 'previous' | 'next'): void {
    if (runtime !== current || current.root.querySelector('.fqa-wide-scrim')) return
    const delta = direction === 'next' ? 1 : -1
    const candidate = current.spread + delta
    if (candidate < 0 || candidate >= current.layout.totalSpreads) {
        navigateChapter(current, direction)
        return
    }
    current.spread = candidate
    animatePage(current, direction)
    paintSpread(current)
    savePosition(current)
}

/** 将当前页应用到滚动容器并刷新数字页码。 */
function paintSpread(current: WideReaderRuntime): void {
    current.frame.scrollTo({ left: current.spread * current.layout.spreadStep, behavior: 'instant' })
    current.indicator.textContent = `${current.spread + 1}/${current.layout.totalSpreads}`
}

/** 重启克制的方向性翻页动画。 */
function animatePage(current: WideReaderRuntime, direction: 'previous' | 'next'): void {
    current.frame.classList.remove('fqa-wide-motion-next', 'fqa-wide-motion-previous')
    void current.frame.offsetWidth
    current.frame.classList.add(`fqa-wide-motion-${direction}`)
}

/** 使用原助手取得的完整目录定位并打开相邻章节。 */
function navigateChapter(current: WideReaderRuntime, direction: 'previous' | 'next'): void {
    const chapters = current.snapshot.book?.chapter_list ?? []
    const index = chapters.findIndex((chapter) => chapter.item_id === current.snapshot.itemId)
    const target = index >= 0 ? chapters[index + (direction === 'next' ? 1 : -1)] : undefined
    if (!target) return
    if (direction === 'previous') sessionStorage.setItem('fqa-wide-reader-open-at-end', target.item_id)
    window.location.assign(`/reader/${target.item_id}?enter_from=reader`)
}

/** 打开带搜索与当前章定位的全高目录抽屉。 */
function openDirectory(current: WideReaderRuntime): void {
    const chapters = current.snapshot.book?.chapter_list ?? []
    const scrim = createScrim()
    const drawer = createElement('aside', 'fqa-wide-drawer')
    const heading = createElement('div', 'fqa-wide-panel-heading')
    const headingText = document.createElement('strong')
    headingText.textContent = `目录 · ${chapters.length} 章`
    const closeButton = createButton('关闭', '关闭目录')
    heading.append(headingText, closeButton)
    const search = document.createElement('input')
    search.className = 'fqa-wide-search'
    search.placeholder = '搜索章节'
    search.setAttribute('aria-label', '搜索章节')
    const nav = createElement('nav', 'fqa-wide-directory-list')
    drawer.append(heading, search, nav)
    scrim.append(drawer)
    current.root.append(scrim)

    const render = () => renderDirectory(nav, chapters, current.snapshot.itemId, search.value)
    closeButton.addEventListener('click', () => scrim.remove())
    scrim.addEventListener('mousedown', (event) => {
        if (event.target === scrim) scrim.remove()
    })
    search.addEventListener('input', render)
    render()
    requestAnimationFrame(() => {
        search.focus()
        nav.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'center' })
    })
}

/** 根据查询词渲染目录链接。 */
function renderDirectory(
    nav: HTMLElement,
    chapters: ChapterItem[],
    currentItemId: string,
    query: string,
): void {
    nav.replaceChildren()
    const keyword = query.trim().toLocaleLowerCase()
    const visible = keyword
        ? chapters.filter((chapter) => chapter.title.toLocaleLowerCase().includes(keyword))
        : chapters
    if (visible.length === 0) {
        const empty = document.createElement('p')
        empty.textContent = chapters.length === 0 ? '目录尚未加载' : '没有匹配章节'
        nav.append(empty)
        return
    }
    const fragment = document.createDocumentFragment()
    visible.forEach((chapter) => {
        const link = document.createElement('a')
        link.href = `/reader/${chapter.item_id}?enter_from=reader`
        link.textContent = chapter.title
        if (chapter.item_id === currentItemId) link.setAttribute('aria-current', 'page')
        fragment.append(link)
    })
    nav.append(fragment)
}

/** 打开分页阅读专用的主题与排版设置面板。 */
function openReaderSettings(current: WideReaderRuntime): void {
    const scrim = createScrim()
    const panel = createElement('section', 'fqa-wide-settings')
    const heading = createElement('div', 'fqa-wide-panel-heading')
    const headingText = document.createElement('strong')
    headingText.textContent = '显示设置'
    const closeButton = createButton('关闭', '关闭显示设置')
    heading.append(headingText, closeButton)
    panel.append(heading)

    const themes = createElement('div', 'fqa-wide-themes')
    ;(['light', 'dark', 'system'] as const).forEach((theme) => {
        const label = theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '跟随系统'
        const button = createButton(label, `切换为${label}`)
        button.setAttribute('aria-pressed', String(settings.wideReaderTheme === theme))
        button.addEventListener('click', () => {
            settings.wideReaderTheme = theme
            current.root.dataset.theme = theme
            themes.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)))
        })
        themes.append(button)
    })
    panel.append(themes)
    panel.append(
        createRangeField('字号', 16, 24, 1, () => settings.wideReaderFontSize, (value) => {
            settings.wideReaderFontSize = value
            reflowAfterSettings(current)
        }),
        createRangeField('行高', 1.4, 2.6, 0.05, () => settings.wideReaderLineHeight, (value) => {
            settings.wideReaderLineHeight = value
            reflowAfterSettings(current)
        }),
        createRangeField('栏间距', 32, 112, 4, () => settings.wideReaderColumnGap, (value) => {
            settings.wideReaderColumnGap = value
            reflowAfterSettings(current)
        }),
        createRangeField('页边距', 32, 120, 4, () => settings.wideReaderPageMargin, (value) => {
            settings.wideReaderPageMargin = value
            reflowAfterSettings(current)
        }),
    )
    scrim.append(panel)
    current.root.append(scrim)
    closeButton.addEventListener('click', () => scrim.remove())
    scrim.addEventListener('mousedown', (event) => {
        if (event.target === scrim) scrim.remove()
    })
}

/** 创建一个带数值显示的范围设置项。 */
function createRangeField(
    label: string,
    min: number,
    max: number,
    step: number,
    readValue: () => number,
    writeValue: (value: number) => void,
): HTMLElement {
    const field = createElement('label', 'fqa-wide-field')
    const text = document.createElement('span')
    text.textContent = label
    const input = document.createElement('input')
    input.type = 'range'
    input.min = String(min)
    input.max = String(max)
    input.step = String(step)
    input.value = String(readValue())
    const output = document.createElement('output')
    output.textContent = input.value
    input.addEventListener('input', () => {
        const value = Number(input.value)
        output.textContent = Number.isInteger(value) ? String(value) : value.toFixed(2)
        writeValue(value)
    })
    field.append(text, input, output)
    return field
}

/** 在排版参数变化后保持当前语义块并重新测量。 */
function reflowAfterSettings(current: WideReaderRuntime): void {
    const position = capturePosition(current)
    applyReaderVariables(current.root)
    requestAnimationFrame(() => measureAndRestore(current, position))
}

/** 把当前设置映射成分页层使用的 CSS 变量。 */
function applyReaderVariables(root: HTMLElement): void {
    root.style.setProperty('--fqa-wide-font-size', `${settings.wideReaderFontSize}px`)
    root.style.setProperty('--fqa-wide-line-height', String(settings.wideReaderLineHeight))
    root.style.setProperty('--fqa-wide-gap', `${settings.wideReaderColumnGap}px`)
    root.style.setProperty('--fqa-wide-margin', `${settings.wideReaderPageMargin}px`)
    root.style.setProperty('--fqa-wide-font-family', settings.readerFont || "'Microsoft YaHei', sans-serif")
}

/** 保存当前视口内最靠左的语义内容块。 */
function savePosition(current: WideReaderRuntime): void {
    const position = capturePosition(current)
    if (!position) return
    GM_setValue(`${POSITION_PREFIX}${current.snapshot.itemId}`, JSON.stringify(position))
}

/** 查找当前 spread 内最靠左的内容块。 */
function capturePosition(current: WideReaderRuntime): SavedPosition | null {
    const logicalLeft = current.spread * current.layout.spreadStep
    const blocks = [...current.article.querySelectorAll<HTMLElement>('[data-block-index]')]
    const visible = blocks.find((block) => block.offsetLeft + block.offsetWidth >= logicalLeft - 1)
        ?? blocks[blocks.length - 1]
    const blockIndex = Number(visible?.dataset.blockIndex)
    return Number.isInteger(blockIndex) ? { blockIndex } : null
}

/** 读取指定章节上次保存的语义块位置。 */
function loadPosition(itemId: string): SavedPosition | null {
    try {
        const raw = GM_getValue(`${POSITION_PREFIX}${itemId}`)
        if (typeof raw !== 'string') return null
        const value = JSON.parse(raw) as Partial<SavedPosition>
        return Number.isInteger(value.blockIndex) ? { blockIndex: value.blockIndex! } : null
    } catch {
        return null
    }
}

/** 创建用于目录和设置面板的遮罩层。 */
function createScrim(): HTMLElement {
    return createElement('div', 'fqa-wide-scrim')
}

/** 创建带类名的普通 HTML 元素。 */
function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag)
    element.className = className
    return element
}

/** 创建包含中文可访问标签的按钮。 */
function createButton(text: string, label: string): HTMLButtonElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = text
    button.setAttribute('aria-label', label)
    button.title = label
    return button
}

/** 判断键盘事件是否来自可编辑控件。 */
function isEditableTarget(target: EventTarget | null): boolean {
    return target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
        || (target instanceof HTMLElement && target.isContentEditable)
}

/** 将数值限制在闭区间内。 */
function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

// 助手设置面板可能在阅读中关闭或重新开启分页模式，需要即时同步运行时。
watch(
    () => settings.wideReaderEnabled,
    (enabled) => {
        if (!enabled) unmountWideReader()
        else if (lastSnapshot && !lastSnapshot.comic) mountWideReader(lastSnapshot)
    },
)
