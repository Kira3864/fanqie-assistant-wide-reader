import { watch } from 'vue'
import type { Book, ChapterItem } from './types'
import { flushSettings, settings } from './settings'
import wideReaderCss from './assets/wideReader.css?raw'
import { bindFootnoteInteraction } from './utils/footnote'
import { createReaderChapterUrl, replaceReaderChapter } from './wideReaderNavigation'
import { getDetailedUserInfo, userState } from './api/user'
import { openSettings } from './settingsPanel'
import type { WideReaderFont, WideReaderTheme } from './wideReaderPreferences'
import { shouldTurnPageForWheel } from './wideReaderInteraction'
import {
    buildColumnPageMap,
    calculateCurrentSpreads,
    calculateSpreadOffset,
    type ColumnPageMeta,
} from './wideReaderPaging'

/** 分页阅读器同步时需要的章节快照。 */
export interface WideReaderSnapshot {
    itemId: string
    title: string
    book: Book | null
    source: HTMLElement
    comic: boolean
}

/** 已提前加载、可与当前章末页并排展示的下一章快照。 */
export interface WideReaderContinuation {
    itemId: string
    title: string
    source: HTMLElement
}

/** 阅读器一次布局测量得到的分页几何信息。 */
interface WideReaderLayout {
    columnsPerSpread: 1 | 2
    totalSpreads: number
    spreadStep: number
    columnStep: number
    pageMap: ColumnPageMeta[]
    terminalColumn: number | null
}

/** 当前分页阅读器运行时持有的 DOM 和事件清理函数。 */
interface WideReaderRuntime {
    root: HTMLElement
    frame: HTMLElement
    article: HTMLElement
    pageLabels: [HTMLOutputElement, HTMLOutputElement]
    snapshot: WideReaderSnapshot
    spread: number
    layout: WideReaderLayout
    cleanup: Array<() => void>
}

/** 分页阅读器固定控制按钮的集合。 */
interface WideReaderControls {
    directoryButton: HTMLButtonElement
    settingsButton: HTMLButtonElement
    accountButton: HTMLButtonElement
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
const ENTRY_ID = 'fqa-wide-reader-entry'
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
    if (!settings.wideReaderEnabled || !settings.wideReaderActive || snapshot.comic) {
        removeWideReaderEntry()
        unmountWideReader()
        if (settings.wideReaderEnabled && !snapshot.comic) showWideReaderEntry()
        return
    }
    mountWideReader(snapshot)
}

/**
 * 将下一章或终章尾页附加到仍处于活动状态的当前章节。
 * 异步预取返回较晚时会核对章节编号，避免污染已经切换后的阅读器。
 */
export function syncWideReaderContinuation(
    currentItemId: string,
    continuation: WideReaderContinuation | null,
): void {
    if (!runtime || runtime.snapshot.itemId !== currentItemId) return
    runtime.article.querySelectorAll('.fqa-wide-continuation').forEach((element) => element.remove())
    if (continuation) {
        appendChapter(runtime.article, continuation.itemId, continuation.title, continuation.source, true)
    } else {
        appendTerminalPage(runtime.article)
    }
    bindFootnoteInteraction(runtime.article)
    measureAndRestore(runtime, capturePosition(runtime))
}

/** 在异步获取新章节期间保留当前分页层，避免短暂露出原网页排版。 */
export function beginWideReaderTransition(): void {
    if (!runtime) return
    runtime.root.dataset.loading = 'true'
    runtime.root.setAttribute('aria-busy', 'true')
    runtime.pageLabels[0].textContent = '正在加载章节…'
    runtime.pageLabels[1].textContent = ''
}

/** 在章节获取失败时解除加载状态，并在当前分页层提示错误。 */
export function failWideReaderTransition(): void {
    if (!runtime) return
    runtime.root.removeAttribute('data-loading')
    runtime.root.removeAttribute('aria-busy')
    runtime.pageLabels[0].textContent = '章节加载失败，请重试'
}

/** 离开阅读页时清理分页层、恢复入口和章节快照。 */
export function leaveWideReaderPage(): void {
    lastSnapshot = null
    removeWideReaderEntry()
    unmountWideReader()
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
    removeWideReaderEntry()
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
    const accountButton = createAccountButton()
    const accountContainer = createElement('div', 'fqa-wide-account')
    accountContainer.append(accountButton)
    const title = createElement('span', 'fqa-wide-title')
    title.textContent = snapshot.title
    const exitButton = createButton('退出分页', '退出沉浸式分页阅读')
    exitButton.classList.add('fqa-wide-exit')
    topControls.append(directoryButton, settingsButton, title, accountContainer, exitButton)

    const leftButton = createButton('‹', '上一页')
    leftButton.className = 'fqa-wide-edge fqa-wide-edge-left'
    const rightButton = createButton('›', '下一页')
    rightButton.className = 'fqa-wide-edge fqa-wide-edge-right'

    const frame = createElement('div', 'fqa-wide-frame')
    const article = createElement('article', 'fqa-wide-article')
    article.setAttribute('aria-label', snapshot.title)
    appendChapter(article, snapshot.itemId, snapshot.title, snapshot.source, false)
    // DOM 克隆不会复制事件监听器，因此在分页文章上重新绑定脚注交互。
    bindFootnoteInteraction(article)
    frame.append(article)

    const pageLabelContainer = createElement('div', 'fqa-wide-page-labels')
    const leftPageLabel = document.createElement('output')
    const rightPageLabel = document.createElement('output')
    pageLabelContainer.append(leftPageLabel, rightPageLabel)

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
        pageLabelContainer,
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
        pageLabels: [leftPageLabel, rightPageLabel],
        snapshot,
        spread: 0,
        layout: {
            columnsPerSpread: 2,
            totalSpreads: 1,
            spreadStep: 1,
            columnStep: 1,
            pageMap: [],
            terminalColumn: null,
        },
        cleanup: [],
    }
    runtime = nextRuntime

    bindReaderEvents(nextRuntime, {
        directoryButton,
        settingsButton,
        accountButton,
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

/** 将章节标题和正文复制到多栏文章，并标记章节边界供逐栏页码测量。 */
function appendChapter(
    article: HTMLElement,
    itemId: string,
    title: string,
    source: HTMLElement,
    continuation: boolean,
): void {
    const heading = document.createElement('h1')
    heading.textContent = title
    heading.dataset.blockIndex = '0'
    heading.dataset.chapterId = itemId
    heading.dataset.chapterTitle = title
    heading.className = continuation
        ? 'fqa-wide-chapter-heading fqa-wide-continuation'
        : 'fqa-wide-chapter-heading'
    article.append(heading)
    const startIndex = article.children.length
    appendChapterContent(article, source)
    if (continuation) {
        for (let index = startIndex; index < article.children.length; index += 1) {
            const child = article.children.item(index)
            child?.classList.add('fqa-wide-continuation')
        }
    }
}

/** 在全书末尾追加一个独立、可翻到的完成页。 */
function appendTerminalPage(article: HTMLElement): void {
    const terminal = createElement('section', 'fqa-wide-terminal fqa-wide-continuation')
    terminal.dataset.terminalPage = 'true'
    const ornament = createElement('span', 'fqa-wide-terminal-ornament')
    ornament.textContent = '◇'
    const title = document.createElement('strong')
    title.textContent = '当前已是最后一章'
    const description = document.createElement('span')
    description.textContent = '感谢阅读，愿故事的余韵常在。'
    terminal.append(ornament, title, description)
    article.append(terminal)
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
    controls.accountButton.addEventListener('click', () => void openAccountMenu(current, controls.accountButton))
    controls.exitButton.addEventListener('click', () => {
        settings.wideReaderActive = false
        flushSettings()
        unmountWideReader()
        showWideReaderEntry()
    })

    let wheelTotal = 0
    let wheelLockedUntil = 0
    const onWheel = (event: WheelEvent) => {
        if (!shouldTurnPageForWheel(event.target)) return
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
    const chapterStarts = [...article.querySelectorAll<HTMLElement>('[data-chapter-id]')].map((heading) => ({
        itemId: heading.dataset.chapterId ?? '',
        title: heading.dataset.chapterTitle ?? '当前章节',
        startColumn: Math.round(Math.max(0, heading.offsetLeft) / columnStep),
    }))
    const terminal = article.querySelector<HTMLElement>('[data-terminal-page]')
    const terminalColumn = terminal
        ? Math.round(Math.max(0, terminal.offsetLeft) / columnStep)
        : null
    const continuationStart = chapterStarts[1]?.startColumn ?? terminalColumn
    const currentPages = continuationStart ?? totalColumns
    const navigableColumns = terminalColumn === null ? currentPages : currentPages + 1
    return {
        columnsPerSpread,
        totalSpreads: calculateCurrentSpreads(navigableColumns, columnsPerSpread),
        spreadStep: columnsPerSpread * columnStep,
        columnStep,
        pageMap: buildColumnPageMap(terminalColumn ?? totalColumns, chapterStarts),
        terminalColumn,
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

/** 将当前页应用到正文横向位移并刷新数字页码。 */
function paintSpread(current: WideReaderRuntime): void {
    // scrollLeft 在奇数栏末页会被最大滚动距离钳制半栏，正文位移可准确显示“末栏 + 空白栏”。
    current.article.style.transform = `translate3d(${calculateSpreadOffset(current.spread, current.layout.spreadStep)}px, 0, 0)`
    const firstColumn = current.spread * current.layout.columnsPerSpread
    current.pageLabels.forEach((label, index) => {
        if (index >= current.layout.columnsPerSpread) {
            label.textContent = ''
            label.hidden = true
            return
        }
        label.hidden = false
        const column = firstColumn + index
        const page = current.layout.pageMap[column]
        if (page) {
            label.textContent = `${page.title}  ${page.page}/${page.total}`
        } else if (column === current.layout.terminalColumn) {
            label.textContent = '全书完'
        } else {
            label.textContent = ''
        }
    })
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
    navigateToChapter(current, target.item_id)
}

/** 使用 replaceState 原地切章，保留书架历史项并让现有导航钩子加载正文。 */
function navigateToChapter(current: WideReaderRuntime, itemId: string): void {
    if (runtime !== current || itemId === current.snapshot.itemId) return
    beginWideReaderTransition()
    replaceReaderChapter(unsafeWindow.history, itemId)
}

/** 打开带搜索与当前章定位的全高目录抽屉。 */
function openDirectory(current: WideReaderRuntime): void {
    const chapters = current.snapshot.book?.chapter_list ?? []
    const scrim = createScrim()
    const drawer = createElement('aside', 'fqa-wide-drawer')
    const heading = createElement('div', 'fqa-wide-panel-heading')
    const headingText = document.createElement('strong')
    headingText.textContent = `目录 · ${chapters.length} 章`
    const closeButton = createCloseButton('关闭目录')
    heading.append(headingText, closeButton)
    const search = document.createElement('input')
    search.className = 'fqa-wide-search'
    search.placeholder = '搜索章节'
    search.setAttribute('aria-label', '搜索章节')
    const nav = createElement('nav', 'fqa-wide-directory-list')
    drawer.append(heading, search, nav)
    scrim.append(drawer)
    current.root.append(scrim)

    const render = () => renderDirectory(current, nav, chapters, current.snapshot.itemId, search.value)
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
    current: WideReaderRuntime,
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
        link.href = createReaderChapterUrl(chapter.item_id)
        link.textContent = chapter.title
        if (chapter.item_id === currentItemId) link.setAttribute('aria-current', 'page')
        link.addEventListener('click', (event) => {
            event.preventDefault()
            navigateToChapter(current, chapter.item_id)
        })
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
    const closeButton = createCloseButton('关闭显示设置')
    heading.append(headingText, closeButton)
    panel.append(heading)

    const themes = createElement('div', 'fqa-wide-themes')
    const themeOptions: Array<{ value: WideReaderTheme; label: string }> = [
        { value: 'system', label: '跟随系统' },
        { value: 'light', label: '明亮' },
        { value: 'paper', label: '羊皮纸' },
        { value: 'green', label: '护眼绿' },
        { value: 'gray', label: '雾灰' },
        { value: 'dark', label: '深夜' },
    ]
    themeOptions.forEach(({ value: theme, label }) => {
        const button = createButton(label, `切换为${label}`)
        button.dataset.theme = theme
        button.setAttribute('aria-pressed', String(settings.wideReaderTheme === theme))
        button.addEventListener('click', () => {
            settings.wideReaderTheme = theme
            flushSettings()
            current.root.dataset.theme = theme
            themes.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)))
        })
        themes.append(button)
    })
    const fonts = createElement('div', 'fqa-wide-fonts')
    const fontLabel = createElement('span', 'fqa-wide-section-label')
    fontLabel.textContent = '正文字体'
    const fontSelect = document.createElement('select')
    fontSelect.className = 'fqa-wide-select'
    const fontOptions: Array<{ value: WideReaderFont; label: string }> = [
        { value: 'system', label: '跟随助手设置' },
        { value: 'yahei', label: '微软雅黑' },
        { value: 'sans', label: '现代黑体' },
        { value: 'serif', label: '系统衬线' },
        { value: 'song', label: '宋体' },
        { value: 'kai', label: '楷体' },
        { value: 'fangsong', label: '仿宋' },
    ]
    fontOptions.forEach(({ value, label }) => {
        const option = document.createElement('option')
        option.value = value
        option.textContent = label
        option.selected = settings.wideReaderFont === value
        fontSelect.append(option)
    })
    fontSelect.addEventListener('change', () => {
        settings.wideReaderFont = fontSelect.value as WideReaderFont
        flushSettings()
        reflowAfterSettings(current)
    })
    fonts.append(fontLabel, fontSelect)
    panel.append(themes, fonts)
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
    root.style.setProperty('--fqa-wide-font-family', resolveReaderFont())
}

/** 将内置字体方案转换成跨平台 CSS 字体栈。 */
function resolveReaderFont(): string {
    const fonts: Record<WideReaderFont, string> = {
        system: settings.readerFont || "'Microsoft YaHei', system-ui, sans-serif",
        yahei: "'Microsoft YaHei', '微软雅黑', sans-serif",
        sans: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif",
        serif: "'Noto Serif SC', 'Source Han Serif SC', serif",
        song: "SimSun, 'Songti SC', 'Noto Serif SC', serif",
        kai: "KaiTi, STKaiti, 'Kaiti SC', serif",
        fangsong: "FangSong, STFangsong, 'Fangsong SC', serif",
    }
    return fonts[settings.wideReaderFont]
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

/** 创建与面板风格一致的圆形关闭按钮。 */
function createCloseButton(label: string): HTMLButtonElement {
    const button = createButton('×', label)
    button.className = 'fqa-wide-close'
    return button
}

/** 创建分页顶栏账户入口，登录时显示头像，游客显示通用图标。 */
function createAccountButton(): HTMLButtonElement {
    const button = createButton('', '打开账户与助手菜单')
    button.className = 'fqa-wide-account-button'
    const avatar = userState.userInfo?.avatar
    if (avatar) {
        const image = document.createElement('img')
        image.src = avatar
        image.alt = ''
        button.append(image)
    }
    const name = document.createElement('span')
    name.textContent = userState.userInfo?.username || '账户'
    button.append(name)
    return button
}

/** 打开分页模式专用账户菜单，保留书架、会员、退出和助手设置入口。 */
async function openAccountMenu(current: WideReaderRuntime, anchor: HTMLElement): Promise<void> {
    current.root.querySelector('.fqa-wide-account-menu')?.remove()
    const menu = createElement('div', 'fqa-wide-account-menu')
    menu.setAttribute('role', 'menu')
    let summary: HTMLElement | null = null
    if (userState.isLogin && userState.userInfo) {
        summary = createElement('div', 'fqa-wide-account-summary')
        summary.textContent = formatAccountSummary(userState.userInfo)
        menu.append(summary)
        appendAccountLink(menu, '我的书架', '/bookshelf')
        appendAccountAction(menu, '兑换会员', () => triggerNativeUserAction('兑换会员'))
        appendAccountAction(menu, '退出登录', () => triggerNativeUserAction('退出登录'))
    } else {
        appendAccountLink(menu, '登录 / 注册', '/login')
    }
    const settingsButton = createButton('助手设置', '打开助手设置')
    settingsButton.setAttribute('role', 'menuitem')
    settingsButton.addEventListener('click', () => {
        menu.remove()
        openSettings()
    })
    menu.append(settingsButton)
    anchor.parentElement?.append(menu)

    // 菜单先立即显示；统计在后台补全，慢接口不会阻塞入口展示。
    if (summary) {
        try {
            const detail = await withTimeout(getDetailedUserInfo(), 2500)
            if (detail && summary.isConnected) summary.textContent = formatAccountSummary(detail)
        } catch (error) {
            console.warn('[fqa:分页菜单] 阅读统计加载失败', error)
        }
    }
}

/** 生成账户菜单摘要；统计尚未缓存时只显示用户名，不展示永久加载文案。 */
function formatAccountSummary(user: typeof userState.userInfo): string {
    if (!user) return '账户'
    if (user.read_book_num === undefined || user.read_book_time === undefined) return user.username
    return `${user.username} · 阅读 ${user.read_book_num} 本 · ${formatReadingTime(user.read_book_time)}`
}

/** 为用户统计请求增加超时兜底，防止菜单长期停留在等待状态。 */
async function withTimeout<T>(task: Promise<T>, timeoutMilliseconds: number): Promise<T | null> {
    let timer: number | undefined
    const timeout = new Promise<null>((resolve) => {
        timer = window.setTimeout(() => resolve(null), timeoutMilliseconds)
    })
    try {
        return await Promise.race([task, timeout])
    } finally {
        if (timer !== undefined) window.clearTimeout(timer)
    }
}

/** 将毫秒阅读时长格式化为紧凑的小时分钟文本。 */
function formatReadingTime(milliseconds: bigint | number): string {
    const safeMilliseconds = typeof milliseconds === 'bigint'
        ? milliseconds
        : BigInt(Math.max(0, Math.trunc(milliseconds)))
    const totalMinutes = safeMilliseconds / 60_000n
    return `${totalMinutes / 60n} 时 ${totalMinutes % 60n} 分`
}

/** 向账户菜单加入一个站内导航项。 */
function appendAccountLink(menu: HTMLElement, label: string, href: string): void {
    const link = document.createElement('a')
    link.href = href
    link.textContent = label
    link.setAttribute('role', 'menuitem')
    menu.append(link)
}

/** 向账户菜单加入一个转发至原站行为的按钮。 */
function appendAccountAction(menu: HTMLElement, label: string, action: () => Promise<void>): void {
    const button = createButton(label, label)
    button.setAttribute('role', 'menuitem')
    button.addEventListener('click', () => void action())
    menu.append(button)
}

/**
 * 唤起原站头像菜单并点击指定项目。
 * 兑换会员和退出登录由番茄自身事件处理，避免脚本猜测接口或登录地址。
 */
async function triggerNativeUserAction(label: string): Promise<void> {
    const findAction = (): HTMLElement | null => [...document.querySelectorAll<HTMLElement>('a, button, [role="menuitem"]')]
        .find((element) => !element.closest(`#${ROOT_ID}`) && element.textContent?.trim() === label) ?? null
    let action = findAction()
    if (!action) {
        const avatar = document.querySelector<HTMLElement>('.slogin-user-avatar, [class*="user-avatar"]')
        avatar?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        avatar?.click()
        await new Promise<void>((resolve) => window.setTimeout(resolve, 120))
        action = findAction()
    }
    if (action) action.click()
    else console.warn(`[fqa:分页菜单] 未找到原站“${label}”入口`)
}

/** 在原网页右侧创建重新进入分页阅读的固定入口。 */
function showWideReaderEntry(): void {
    if (document.getElementById(ENTRY_ID) || !settings.wideReaderEnabled || !lastSnapshot || lastSnapshot.comic) return
    ensureWideReaderStyle()
    const button = createButton('分页阅读', '重新进入沉浸式分页阅读')
    button.id = ENTRY_ID
    button.addEventListener('click', () => {
        settings.wideReaderActive = true
        flushSettings()
        if (lastSnapshot && !lastSnapshot.comic) mountWideReader(lastSnapshot)
    })
    document.body.append(button)
}

/** 移除原网页上的分页阅读恢复入口。 */
function removeWideReaderEntry(): void {
    document.getElementById(ENTRY_ID)?.remove()
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
        if (!enabled) {
            removeWideReaderEntry()
            unmountWideReader()
        }
        else if (settings.wideReaderActive && lastSnapshot && !lastSnapshot.comic) mountWideReader(lastSnapshot)
        else showWideReaderEntry()
    },
)

// 用户在助手设置中恢复“当前进入分页”时应立即挂载，无需刷新页面。
watch(
    () => settings.wideReaderActive,
    (active) => {
        if (!active) {
            unmountWideReader()
            showWideReaderEntry()
        } else if (settings.wideReaderEnabled && lastSnapshot && !lastSnapshot.comic) {
            mountWideReader(lastSnapshot)
        }
    },
)

// 助手设置页修改配色或排版时，已打开的分页层应即时刷新并保持当前位置。
watch(
    () => [
        settings.wideReaderTheme,
        settings.wideReaderFont,
        settings.readerFont,
        settings.wideReaderFontSize,
        settings.wideReaderLineHeight,
        settings.wideReaderColumnGap,
        settings.wideReaderPageMargin,
    ],
    () => {
        if (!runtime) return
        runtime.root.dataset.theme = settings.wideReaderTheme
        reflowAfterSettings(runtime)
    },
)
