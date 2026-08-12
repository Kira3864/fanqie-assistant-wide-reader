import { type HookConfig } from '../config'
import { getChapter } from '../api/content'
import { getBookInfoAndCatalog } from '../api/book'
import { getCatalog } from '../api/catalog'
import { applyBookCss } from '../api/bookcss'
import { processFootnotes, bindFootnoteInteraction } from '../utils/footnote'
import { settings } from '../settings'
// import defaultcss from '../assets/default.css?raw';
import { cloneElement } from '../utils';
import { fetchArrayBuffer } from '../utils/request';
import { type Book } from '../types'
import { decryptComicImage } from '../crypto/content';
import {
    beginWideReaderTransition,
    failWideReaderTransition,
    leaveWideReaderPage,
    syncWideReader,
} from '../wideReader'
// import moment from 'moment'

let currentBook: Book | null = null

let latestItemId: string | null = null

/** 脚本接管的正文容器 id。文字章与漫画章共用同一个，切章时复用 */
const SCRIPT_CONTAINER_ID = 'fqa-reader-content'

/** 漫画懒加载观察器，切章时要换掉旧的 */
let comicObserver: IntersectionObserver | null = null

/**
 * 取到脚本容器：没有就克隆一个插到原容器前面，有就复用并清空。
 *
 * 必须按 id 复用。之前漫画分支查的是 'fqa-comic-content'、写的却是
 * 'fqa-reader-content'，永远查不到，于是每切一章就多插一个容器，
 * 上一章的图片留在页面里，新图被挤到视口外，懒加载再也不触发。
 */
function ensureScriptContainer(readerContainer: Element, comic: boolean): HTMLDivElement {
    let scriptContainer = document.getElementById(SCRIPT_CONTAINER_ID) as HTMLDivElement | null
    if (!scriptContainer) {
        scriptContainer = cloneElement(readerContainer) as HTMLDivElement
        scriptContainer.id = SCRIPT_CONTAINER_ID
        scriptContainer.classList.add('fqa')
        readerContainer.insertAdjacentElement('beforebegin', scriptContainer)
    }
    // 文字章与漫画章互相切换时同步类名
    scriptContainer.classList.toggle('fqa-comic-reader', comic)
    if (settings.allowCopy) scriptContainer.classList.remove('noselect')

    // 容器一清空，旧图片就从文档里消失了，观察器留着没意义
    comicObserver?.disconnect()
    comicObserver = null

    scriptContainer.innerHTML = ''
    readerContainer.classList.add('fqa-hide')
    return scriptContainer
}

async function insertContent() {
    const itemId = window.location.pathname.split('/').pop()?.substring(0, 19) || ''
    if (!itemId) {
        console.warn('No item_id found in URL')
        return
    }
    latestItemId = itemId
    // 保留上一章分页层作为加载遮罩，避免异步请求期间露出原网页样式。
    beginWideReaderTransition()
    let chapter
    try {
        chapter = await getChapter(itemId)
    } catch (error) {
        failWideReaderTransition()
        throw error
    }
    if (!chapter) {
        console.warn('No chapter found for item_id:', itemId)
        failWideReaderTransition()
        return
    }

    if (latestItemId !== itemId) {
        console.debug('Stale chapter response discarded:', itemId)
        return
    }
    console.log('Chapter:', chapter)

    const pageState: any = (unsafeWindow as typeof unsafeWindow & {
        __INITIAL_STATE__?: { reader?: { chapterData?: { title?: string } } }
    }).__INITIAL_STATE__
    const chapterTitle = chapter.novel_data?.title || pageState?.reader?.chapterData?.title
    if (typeof chapter.content === 'string') {
        // 书籍自带的排版样式（css_map），作用域限定在正文容器内后注入
        void applyBookCss(chapter.novel_data?.css_map, '#fqa-reader-content')
        const dp = new DOMParser()
        const doc = dp.parseFromString(chapter.content, 'text/html')
        const body = doc.body
        // XHTML 里的 <link href="Styles/xxx.css"> 是 EPUB 相对路径，页面里解析不到，
        // 留着只会产生 404 请求，样式已由 applyBookCss 处理
        body.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove())
        let article = body.querySelector('article')
        let toProcess = article || body
        // 章内注释：把裂图标记换成可点的上标序号，并重排文末注释列表
        processFootnotes(toProcess)

        for (let i = 0; i < toProcess.childNodes.length; i++) {
            // console.log('Child node:', toProcess.childNodes[i] as HTMLElement)
            if (i < 2 && (toProcess.childNodes[i] as HTMLElement)?.innerHTML?.includes(chapterTitle)) {
                // remove duplicate title
                toProcess.removeChild(toProcess.childNodes[i] as HTMLElement)
                break
            }
        }

        if (!article) {
            article = document.createElement('article')
            article.innerHTML = toProcess.innerHTML
            toProcess = article
        }

        const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)")
        if (readerContainer) {
            const scriptContainer = ensureScriptContainer(readerContainer, false)
            scriptContainer.appendChild(toProcess)
            bindFootnoteInteraction(scriptContainer)
        }
    } else if (chapter.content.picInfos) { // comic
        if (chapter.content.encrypt) {
            // 加密漫画图片：懒加载解密
            const imgs: HTMLImageElement[] = []
            for (let i = 0; i < chapter.content.picInfos.length; i++) {
                const picInfo = chapter.content.picInfos[i]
                const img = document.createElement('img')
                img.className = 'fqa-comic-img fqa-comic-encrypted'
                img.alt = `第${i + 1}页`
                img.dataset.encryptedUrl = picInfo.picUrl
                img.dataset.encryptKey = chapter.content.encrypt_key
                img.dataset.pageIndex = i.toString()
                // 占位符：加载中
                img.style.minHeight = '500px'
                img.style.backgroundColor = '#f0f0f0'
                imgs.push(img)
            }

            const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)")
            if (readerContainer) {
                const scriptContainer = ensureScriptContainer(readerContainer, true)
                imgs.forEach(img => scriptContainer.appendChild(img))

                const observer = new IntersectionObserver(
                    async (entries) => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                const img = entry.target as HTMLImageElement
                                if (img.dataset.encryptedUrl && img.dataset.encryptKey && !img.src) {
                                    observer.unobserve(img) // 只解密一次
                                    try {
                                        // 图片 CDN 多数不支持跨域，页面 fetch 读不到响应体，
                                        // fetchArrayBuffer 会自动退到 GM_xmlhttpRequest
                                        const encryptedBuffer = await fetchArrayBuffer(
                                            img.dataset.encryptedUrl
                                        )
                                        const decryptedBuffer = await decryptComicImage(
                                            encryptedBuffer,
                                            img.dataset.encryptKey
                                        )
                                        const blob = new Blob([decryptedBuffer], { type: 'image/jpeg' })
                                        const blobUrl = URL.createObjectURL(blob)
                                        img.src = blobUrl
                                        img.style.minHeight = ''
                                        img.style.backgroundColor = ''
                                        img.onload = () => {
                                            URL.revokeObjectURL(blobUrl)
                                        }
                                    } catch (error) {
                                        console.error(`解密图片失败 (页 ${img.dataset.pageIndex}):`, error)
                                        img.alt = `第${Number(img.dataset.pageIndex) + 1}页 - 解密失败`
                                        img.style.backgroundColor = '#ffebee'
                                    }
                                }
                            }
                        }
                    },
                    {
                        rootMargin: '200px'
                    }
                )

                // 记下来，下次切章时断开
                comicObserver = observer
                imgs.forEach(img => observer.observe(img))
            }
        } else {
            const imgs: HTMLImageElement[] = []
            for (let i = 0; i < chapter.content.picInfos.length; i++) {
                const picInfo = chapter.content.picInfos[i]
                const img = document.createElement('img')
                img.className = 'fqa-comic-img'
                img.alt = `第${i + 1}页`
                img.src = picInfo.picUrl
                imgs.push(img)
            }
            const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)")
            if (readerContainer) {
                const scriptContainer = ensureScriptContainer(readerContainer, true)
                imgs.forEach(img => scriptContainer.appendChild(img))
            }
        }
    }
    const muyeReaderTitle = document.querySelector("h1.muye-reader-title")
    let muyeReaderSubtitle = document.querySelector("div.muye-reader-subtitle")
    document.querySelector('#fqa-subtitle')?.remove() // prevent duplicate subtitle
    if (muyeReaderSubtitle) {
        // 脱离原页面防止被二次修改
        let _cloned = cloneElement(muyeReaderSubtitle)
        muyeReaderSubtitle.classList.add('fqa-hide')
        _cloned.id = 'fqa-subtitle'
        muyeReaderSubtitle.insertAdjacentElement('afterend', _cloned)
        muyeReaderSubtitle = _cloned
        _cloned.classList.remove('fqa-hide')
        console.log('clone subtitle: ', _cloned)
    }
    if (muyeReaderTitle) {
        muyeReaderTitle.textContent = chapterTitle
    }
    // <div class="muye-reader-subtitle">
    // <span class="desc-item">
    // <span class="title">本章字数：</span>
    // 1916字
    // </span>
    // <span class="desc-item">
    // <span class="title">更新时间：</span>
    // 2025-05-24
    // </span>
    // </div>
    /*
    if (muyeReaderSubtitle) {
        muyeReaderSubtitle.innerHTML = ''
        const wordCntSpan = document.createElement('span')
        wordCntSpan.className = 'desc-item'
        wordCntSpan.innerHTML = `<span class="title">本章字数：</span> ${chapter.char_count}字`
        muyeReaderSubtitle.appendChild(wordCntSpan)
        const updateTimeSpan = document.createElement('span')
        updateTimeSpan.className = 'desc-item'
        updateTimeSpan.innerHTML = `<span class="title">更新时间：</span> ${chapter.update_time}`
        muyeReaderSubtitle.appendChild(updateTimeSpan)
    }
        */

    /*
    if (muyeReaderSubtitle) {
        // 写入更精确的更新时间
        let updateTimeSpan = muyeReaderSubtitle.querySelectorAll('span.desc-item')[1]
        if (updateTimeSpan) {
            let uttspan = updateTimeSpan.firstChild as HTMLSpanElement
            // seconds
            updateTimeSpan.innerHTML =
                uttspan.innerHTML +
                moment(pageState?.reader?.chapterData?.firstPassTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
    }
        */
    /*
    for (let i = 0; i < 10; i++) {
        if (readerContainer) {
            readerContainer.innerHTML = ''
            readerContainer.appendChild(toProcess)
        }
        // TODO: 改优雅点
        // 防止和页面已有脚本相互作用导致正文没覆盖上
        await sleep(100)
    }
    */
    console.log('Current book:', currentBook)
    const chapterBookId = chapter.novel_data?.book_id || pageState?.reader?.chapterData?.bookId
    if (chapterBookId && (!currentBook || currentBook.book_id !== chapterBookId)) {
        try {
            currentBook = await getBookInfoAndCatalog(chapterBookId)
        } catch (error) {
            // 书籍详情接口偶发失败时，仍使用官方网页目录保证目录和切章可用。
            console.warn('[fqa:目录] 书籍详情加载失败，改用当前页面信息和目录后备', error)
            try {
                const catalog = await getCatalog(chapterBookId)
                currentBook = {
                    book_id: chapterBookId,
                    title: pageState?.reader?.chapterData?.bookName || '当前书籍',
                    author: pageState?.reader?.chapterData?.author || '',
                    cover_url: '',
                    summary: '',
                    update_time: '',
                    status: '未知',
                    volume_list: catalog.volume_list,
                    chapter_list: catalog.chapter_list,
                    all_item_ids: catalog.all_item_ids,
                }
            } catch (catalogError) {
                console.warn('[fqa:目录] 所有目录来源均不可用，正文仍保持可读', catalogError)
                currentBook = null
            }
        }
        console.log('Current book:', currentBook)
    }
    if (currentBook && currentBook.chapter_list) {
        const currentChapterItem = currentBook.chapter_list.find(c => c.item_id === itemId)
        if (currentChapterItem) {
            console.log('Current chapter:', currentChapterItem)
            document.title = currentChapterItem.title + ' - ' + currentBook.title + 
                ' - 番茄小说'
            // 防止插入多次
            if (document.getElementById('fqa-current-chapter-volume')) {
                const c = document.getElementById('fqa-current-chapter-volume')
                if (c) {
                    c.textContent = currentChapterItem.volume_title
                }
            } else {
                const volSpan = document.createElement('span')
                volSpan.className = 'desc-item'
                volSpan.id = 'fqa-current-chapter-volume'
                volSpan.textContent = currentChapterItem.volume_title
                // muyeReaderSubtitle?.firstChild: HTMLSpanElement.insertAdjacentElement('beforebegin', volSpan)
                const c = muyeReaderSubtitle?.firstChild as HTMLSpanElement
                if (c) {
                    c.insertAdjacentElement('beforebegin', volSpan)
                }
            }
            // 写入更精确的更新时间
            let updateTimeSpans = muyeReaderSubtitle?.querySelectorAll('span.desc-item') || []
            if (updateTimeSpans.length >= 2 /* 应该是始终为3 */) {
                /* 最后一个一般是更新时间 */
                let updateTimeSpan = updateTimeSpans[updateTimeSpans.length - 1] as HTMLSpanElement
                let uttspan = updateTimeSpan.firstChild as HTMLSpanElement
                // console.log(uttspan)
                uttspan?.remove()
                // seconds
                updateTimeSpan.innerHTML =
                    '更新时间：' +
                    currentChapterItem.update_time
            } else {
                // 网页端屏蔽章节。只有一个本章字数 + 前面插入的卷名
                let updateTimeSpan = document.createElement('span')
                // let updateTimeSubSpan = document.createElement('span')
                updateTimeSpan.className = 'desc-item'
                updateTimeSpan.textContent = `更新时间：${currentChapterItem.update_time}`
            }
        }
    }

    const enhancedContent = document.getElementById(SCRIPT_CONTAINER_ID)
    if (enhancedContent) {
        syncWideReader({
            itemId,
            title: chapterTitle || '当前章节',
            book: currentBook,
            source: enhancedContent,
            comic: typeof chapter.content !== 'string',
        })
    }
}

// let currentBook: Book | null = null
async function onUrlChange(_previous?: string): Promise<void> {
    // TODO: 记录并上报阅读历史和记录
    await insertContent()
}

/** 在导航离开阅读页时卸载固定分页界面，确保书架页面可正常显示。 */
async function onReaderRouteChange(_previous?: string): Promise<void> {
    if (!readerFilter(window.location.pathname, new URLSearchParams(window.location.search), window.location.hash)) {
        leaveWideReaderPage()
    }
}
async function onHashChange(_previous?: string): Promise<void> {
    // TODO: 支持从hash里解析并跳转到指定行
}
async function onLoad(): Promise<void> {
    /*
    if (!document.getElementById('fqa-inject-css-reader')) {
        const style = document.createElement('style')
        style.id = 'fqa-inject-css-reader'
        style.innerHTML = defaultcss
        document.head.appendChild(style)
    }
        */
    const btns = document.querySelector("div.muye-reader-btns") // single div
    if (btns) {
        // TODO: 直接覆写按钮行为，切章节由脚本完成
        // btns.innerHTML = btns.innerHTML // clear default onclick
        // 上一章
        // byte-btn byte-btn-dashed byte-btn-size-large byte-btn-shape-square muye-button chapter-btn last
        // 下一章
        // fatherdiv: chapter-btn next btn-next-relative-container
        // byte-btn byte-btn-primary byte-btn-size-large byte-btn-shape-square muye-button

        /*const prevBtn = btns.querySelector('.chapter-btn.last')
        const nextBtn = btns.querySelector('.chapter-btn.next')?.firstChild
        if (prevBtn) {

        }*/
    }
    await insertContent()
}

function readerFilter(path: string, _query: URLSearchParams, _hash: string) {
    return path.startsWith('/reader') || path.startsWith('reader')
}

const _exports: HookConfig[] = [
    {
        id: 'readerHook_leave',
        event: 'onUrlChange',
        handler: onReaderRouteChange,
        filter: () => true
    },
    {
        id: 'readerHook_load',
        event: 'load',
        handler: onLoad,
        filter: readerFilter
    },
    {
        id: 'readerHook_urlChange',
        event: 'onUrlChange',
        handler: onUrlChange,
        filter: readerFilter
    },
    {
        id: 'readerHook_hashChange',
        event: 'onHashChange',
        handler: onHashChange,
        filter: readerFilter
    }
]

export default _exports
