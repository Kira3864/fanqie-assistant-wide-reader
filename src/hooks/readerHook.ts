import { type HookConfig } from '../config'
import { getChapter } from '../api/content'
import { getBookInfoAndCatalog } from '../api/book'
import { decryptComicImage } from '../utils/crypto'
import { fetch } from '../config'
// import defaultcss from '../assets/default.css?raw';
import { cloneElement } from '../utils';
import { type Book } from '../types'
// import moment from 'moment'

let currentBook: Book | null = null

let latestItemId: string | null = null

async function insertContent() {
    const itemId = window.location.pathname.split('/').pop()?.substring(0, 19) || ''
    if (!itemId) {
        console.warn('No item_id found in URL')
        return
    }
    latestItemId = itemId
    const chapter = await getChapter(itemId)
    if (!chapter) {
        console.warn('No chapter found for item_id:', itemId)
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
        // TODO: 支持部分书籍的CSS内容
        const dp = new DOMParser()
        const doc = dp.parseFromString(chapter.content, 'text/html')
        const body = doc.body
        const article = body.querySelector('article')
        const toProcess = article || body

        for (let i = 0; i < toProcess.childNodes.length; i++) {
            if (i < 1 && (toProcess.childNodes[i] as HTMLElement)?.innerHTML.includes(chapterTitle)) {
                // remove duplicate title
                toProcess.removeChild(toProcess.childNodes[i] as HTMLElement)
            }
        }

        const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)")
        if (readerContainer) {
            // 防止插入多次
            let scriptContainer = document.getElementById('fqa-reader-content') as HTMLDivElement | null
            if (!scriptContainer) {
                scriptContainer = cloneElement(readerContainer) as HTMLDivElement
                scriptContainer.id = 'fqa-reader-content'
                scriptContainer.classList.add('fqa')
                scriptContainer.classList.remove('noselect') // allow text selection
                readerContainer.insertAdjacentElement('beforebegin', scriptContainer)
            }
            scriptContainer.innerHTML = ''
            // 隐藏原来的内容div
            readerContainer.classList.add('fqa-hide')
            scriptContainer.appendChild(toProcess)
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
                let scriptContainer = document.getElementById('fqa-comic-content') as HTMLDivElement | null
                if (!scriptContainer) {
                    scriptContainer = cloneElement(readerContainer) as HTMLDivElement
                    scriptContainer.id = 'fqa-reader-content'
                    scriptContainer.classList.add('fqa')
                    scriptContainer.classList.add('fqa-comic-reader')
                    scriptContainer.classList.remove('noselect')
                    readerContainer.insertAdjacentElement('beforebegin', scriptContainer)
                }
                scriptContainer.innerHTML = ''
                readerContainer.classList.add('fqa-hide')
                imgs.forEach(img => scriptContainer.appendChild(img))

                const observer = new IntersectionObserver(
                    async (entries) => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                const img = entry.target as HTMLImageElement
                                if (img.dataset.encryptedUrl && img.dataset.encryptKey && !img.src) {
                                    observer.unobserve(img) // 只解密一次
                                    try {
                                        const response = await fetch(img.dataset.encryptedUrl)
                                        const encryptedBuffer = await response.arrayBuffer()
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
                // 防止插入多次
                let scriptContainer = document.getElementById('fqa-comic-content') as HTMLDivElement | null
                if (!scriptContainer) {
                    scriptContainer = cloneElement(readerContainer) as HTMLDivElement
                    scriptContainer.id = 'fqa-reader-content'
                    scriptContainer.classList.add('fqa')
                    scriptContainer.classList.add('fqa-comic-reader')
                    scriptContainer.classList.remove('noselect')
                    readerContainer.insertAdjacentElement('beforebegin', scriptContainer)
                }
                scriptContainer.innerHTML = ''
                // 隐藏原来的内容div
                readerContainer.classList.add('fqa-hide')
                imgs.forEach(img => scriptContainer.appendChild(img))
            }
        }
    }
    const muyeReaderTitle = document.querySelector("h1.muye-reader-title")
    let muyeReaderSubtitle = document.querySelector("div.muye-reader-subtitle")
    document.querySelector('#fqa-subtitle')?.remove() // prevent duplicate subtitle
    if (muyeReaderSubtitle) {
        // 脱离原页面 Vue tree ，防止被二次修改
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
    if (!currentBook || currentBook == null || currentBook.book_id !== chapter.novel_data?.book_id) {
        currentBook = await getBookInfoAndCatalog(chapter.novel_data?.book_id)
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
}

// let currentBook: Book | null = null
async function onUrlChange(_previous?: string): Promise<void> {
    // TODO: 记录并上报阅读历史和记录
    await insertContent()
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