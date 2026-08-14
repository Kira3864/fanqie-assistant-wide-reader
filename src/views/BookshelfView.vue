<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BookCard from './BookCard.vue'
import BookGroupCard from './BookGroupCard.vue'
import BookHoverCard from './BookHoverCard.vue'
import ContextMenu from './ContextMenu.vue'
import { TABS, useBookshelf } from './useBookshelf'
import { moveToGroup, removeFromBookshelf } from '../api/bookshelf'
import type { BookShelfEntry, BookShelfGroup, BookShelfTabKey, MenuItem } from '../types'
import { flushSettings, settings } from '../settings'
import { MAX_BOOKSHELF_COLUMNS, MIN_BOOKSHELF_COLUMNS } from '../settingsNormalization'
import { computeBookshelfHoverLayout } from '../bookshelfHoverLayout'

/** 持续悬停多久后展示详情 */
const HOVER_DELAY = 300
/** 移出封面后给用户留出移进浮层的时间 */
const HIDE_DELAY = 160

/** 书架桌面网格可选列数，选项变化会由全局设置自动持久化。 */
const bookshelfColumnOptions = Array.from(
    { length: MAX_BOOKSHELF_COLUMNS - MIN_BOOKSHELF_COLUMNS + 1 },
    (_, index) => MIN_BOOKSHELF_COLUMNS + index,
)

/** 将列数通过 CSS 变量传给书架网格，避免生成大量重复样式类。 */
const bookshelfGridStyle = computed(() => ({
    '--fqa-bookshelf-columns': String(settings.bookshelfColumns),
}))

const { loading, detailLoading, error, counts, groups, load, ensureDetails, cellsOf, findGroup, PAGE_SIZE } =
    useBookshelf()

const activeTab = ref<BookShelfTabKey>('all')
/** 非空时展示该分组内部，返回后恢复列表 */
const openedGroupName = ref<string | null>(null)

const tabsRef = ref<HTMLElement | null>(null)
const inkStyle = ref<Record<string, string>>({ left: '0px', width: '0px' })

const hoverEntry = ref<BookShelfEntry | null>(null)
const hoverVisible = ref(false)
const hoverPos = ref({ x: 0, y: 0 })
/** 浮层采用固定目标高度，仅在浏览器视口不足时缩短。 */
const hoverHeight = ref(0)
let hoverTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
/** 当前悬停的封面元素，滚动时据此重算位置 */
let hoverAnchor: HTMLElement | null = null
/** 指针是否停在浮层内，为真时不收起 */
const pointerInPanel = ref(false)

const openedGroup = computed<BookShelfGroup | null>(() =>
    openedGroupName.value ? findGroup(openedGroupName.value) : null
)

const allCells = computed(() => {
    const group = openedGroup.value
    if (group) {
        return group.books.map(entry => ({
            kind: 'book' as const,
            key: `book:${entry.item.book_id}`,
            entry
        }))
    }
    return cellsOf(activeTab.value)
})

/* 只渲染前 visibleCount 个，滚到底部再追加，避免一次性挂载上千张卡片 */
const visibleCount = ref(PAGE_SIZE)
const cells = computed(() => allCells.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < allCells.value.length)

const sentinel = ref<HTMLElement | null>(null)
let pageObserver: IntersectionObserver | null = null

function resetPaging() {
    visibleCount.value = PAGE_SIZE
}

/** 手动刷新：清空详情缓存重新拉，区别于挂载时的增量加载 */
async function refresh() {
    resetPaging()
    await load(true)
}

watch([activeTab, openedGroupName], resetPaging)

const isEmpty = computed(() => !loading.value && !error.value && allCells.value.length === 0)

const emptyText = computed(() => {
    if (openedGroup.value) return '这个分组还没有书'
    if (activeTab.value === 'group') return '还没有创建任何分组'
    if (activeTab.value === 'publish') return '书架里还没有出版物'
    return '书架空空如也，去首页找几本书看看吧'
})

/* ------------------------------ tab 指示条 ------------------------------ */

function updateInk() {
    const wrap = tabsRef.value
    if (!wrap) return
    const index = TABS.findIndex(tab => tab.key === activeTab.value)
    // 按 DOM 顺序取：v-for 的 ref 数组不保证与源数组同序
    const el = wrap.querySelectorAll<HTMLElement>('.fqa-tab')[index]
    if (!el) return
    inkStyle.value = {
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`
    }
}

function selectTab(key: BookShelfTabKey) {
    openedGroupName.value = null
    activeTab.value = key
    hideHover(true)
}

watch(activeTab, () => nextTick(updateInk))
watch(counts, () => nextTick(updateInk), { deep: true })

/* -------------------------------- hover -------------------------------- */

function computePosition(el: HTMLElement) {
    // 以封面而非整张卡片为基准：卡片还含标题/进度两行文字
    const cover = el.querySelector<HTMLElement>('.fqa-cover') ?? el
    const rect = cover.getBoundingClientRect()

    const layout = computeBookshelfHoverLayout(rect, {
        width: window.innerWidth,
        height: window.innerHeight,
    })
    hoverHeight.value = layout.height
    hoverPos.value = { x: layout.x, y: layout.y }
}

function onCardHover({ entry, el }: { entry: BookShelfEntry; el: HTMLElement }) {
    if (hoverTimer) clearTimeout(hoverTimer)
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = undefined
    }
    // 详情尚未加载时不弹空浮层
    if (!entry.detail) return

    hoverAnchor = el
    // 已经显示时直接换书，不必再等 300ms
    if (hoverVisible.value && hoverEntry.value !== entry) {
        computePosition(el)
        hoverEntry.value = entry
        return
    }
    hoverTimer = setTimeout(() => {
        hoverTimer = undefined
        computePosition(el)
        hoverEntry.value = entry
        hoverVisible.value = true
    }, HOVER_DELAY)
}

/** 移出封面：延迟收起，留出时间让指针移进浮层 */
function scheduleHide() {
    if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = undefined
    }
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
        hideTimer = undefined
        if (!pointerInPanel.value) hideHover(true)
    }, HIDE_DELAY)
}

function hideHover(immediate = false) {
    if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = undefined
    }
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = undefined
    }
    pointerInPanel.value = false
    hoverAnchor = null
    hoverVisible.value = false
    if (immediate) hoverEntry.value = null
}

function onPanelEnter() {
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = undefined
    }
    pointerInPanel.value = true
}

function onPanelLeave() {
    pointerInPanel.value = false
    scheduleHide()
}

/* ------------------------------ 详情按需加载 ------------------------------ */

/*
 * 卡片进入视口时并不立刻发请求，先攒进队列，
 * 下一帧统一提交，把一屏内的十几张卡片合并成一次 multidetail。
 */
let pendingItems: BookShelfEntry['item'][] = []
let flushTimer: ReturnType<typeof setTimeout> | undefined

function queueDetails(entries: BookShelfEntry[]) {
    const pending = entries.filter(entry => !entry.detail)
    if (!pending.length) return
    pendingItems.push(...pending.map(entry => entry.item))
    if (flushTimer) return
    flushTimer = setTimeout(() => {
        flushTimer = undefined
        const batch = pendingItems
        pendingItems = []
        void ensureDetails(batch)
    }, 50)
}

function onCardVisible(entry: BookShelfEntry) {
    queueDetails([entry])
}

/** 分组卡片一次性提交它要展示的四本封面书 */
function onGroupVisible(entries: BookShelfEntry[]) {
    queueDetails(entries)
}

/* -------------------------------- 交互 -------------------------------- */

function openBook(entry: BookShelfEntry) {
    hideHover(true)
    const chapterId = entry.detail?.current_chapter_id || entry.item.last_read_chapter_id
    // 没有阅读记录时退回书籍详情页
    const url =
        chapterId && chapterId !== '0'
            ? `https://fanqienovel.com/reader/${chapterId}`
            : `https://fanqienovel.com/page/${entry.item.book_id}`
    unsafeWindow.location.href = url
}

function openGroup(group: BookShelfGroup) {
    hideHover(true)
    openedGroupName.value = group.name
}

/* ------------------------------ 右键菜单 ------------------------------ */

const menuVisible = ref(false)
const menuPos = ref({ x: 0, y: 0 })
const menuEntry = ref<BookShelfEntry | null>(null)
/** 操作结果提示，几秒后自动消失 */
const toast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined

function showToast(msg: string) {
    toast.value = msg
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.value = null
        toastTimer = undefined
    }, 2600)
}

const MOVE_PREFIX = 'move:'
const NO_GROUP_KEY = `${MOVE_PREFIX}`

const menuItems = computed<MenuItem[]>(() => {
    const entry = menuEntry.value
    if (!entry) return []
    const current = entry.item.group_name ?? ''

    // 目标分组：所有分组去掉当前所在的那个
    const targets: MenuItem[] = groups.value
        .filter(g => g.name !== current)
        .map(g => ({ key: `${MOVE_PREFIX}${g.name}`, label: g.name }))
    // 已经在某个分组里时，额外给一个移出分组的选项
    if (current) targets.push({ key: NO_GROUP_KEY, label: '无分组' })

    return [
        { key: 'open', label: '打开' },
        { key: 'detail', label: '查看详情' },
        {
            key: 'move',
            label: '移动到分组',
            disabled: targets.length === 0,
            children: targets
        },
        { key: 'remove', label: '从书架删除', danger: true }
    ]
})

function onCardContextMenu({ entry, x, y }: { entry: BookShelfEntry; x: number; y: number }) {
    hideHover(true)
    menuEntry.value = entry
    menuPos.value = { x, y }
    menuVisible.value = true
}

async function onMenuSelect(key: string) {
    const entry = menuEntry.value
    if (!entry) return
    const bookId = entry.item.book_id

    if (key === 'open') {
        openBook(entry)
        return
    }
    if (key === 'detail') {
        unsafeWindow.location.href = `https://fanqienovel.com/page/${bookId}`
        return
    }
    if (key === 'remove') {
        if (!unsafeWindow.confirm(`确定要把《${entry.detail?.title ?? bookId}》从书架删除吗？`)) return
        try {
            await removeFromBookshelf(bookId)
            showToast('已从书架删除')
            await refresh()
        } catch (err) {
            console.error('[fqa:bookshelf] 删除失败:', err)
            showToast(err instanceof Error ? err.message : '删除失败')
        }
        return
    }
    if (key.startsWith(MOVE_PREFIX)) {
        const groupName = key.slice(MOVE_PREFIX.length)
        try {
            await moveToGroup(bookId, groupName)
            showToast(groupName ? `已移动到「${groupName}」` : '已移出分组')
            await refresh()
        } catch (err) {
            console.error('[fqa:bookshelf] 移动分组失败:', err)
            showToast(err instanceof Error ? err.message : '移动分组失败')
        }
    }
}

function backToList() {
    openedGroupName.value = null
    hideHover(true)
}

function onScrollOrResize() {
    // 浮层是 fixed 的，滚动后跟着封面重算位置，而不是收起
    if (hoverAnchor && (hoverVisible.value || hoverTimer)) {
        if (hoverAnchor.isConnected) {
            computePosition(hoverAnchor)
        } else {
            // 卡片被分页/切 tab 移除了
            hideHover(true)
        }
    }
    updateInk()
}

onMounted(async () => {
    await load()
    await nextTick()
    updateInk()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)

    if (typeof IntersectionObserver !== 'undefined') {
        pageObserver = new IntersectionObserver(
            entries => {
                if (entries.some(e => e.isIntersecting) && hasMore.value) {
                    visibleCount.value += PAGE_SIZE
                }
            },
            { rootMargin: '400px' }
        )
        watch(
            sentinel,
            el => {
                pageObserver?.disconnect()
                if (el) pageObserver?.observe(el)
            },
            { immediate: true }
        )
    }
})

onBeforeUnmount(() => {
    if (hoverTimer) clearTimeout(hoverTimer)
    if (hideTimer) clearTimeout(hideTimer)
    if (flushTimer) clearTimeout(flushTimer)
    pageObserver?.disconnect()
    pageObserver = null
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
})
</script>

<template>
    <div id="fqa-bookshelf">
        <div class="fqa-bs-header">
            <div class="fqa-bs-title">我的书架</div>
            <div class="fqa-bs-actions">
                <span v-if="detailLoading">正在补全详情…</span>
                <label class="fqa-bs-columns">
                    <span>每行</span>
                    <select
                        v-model.number="settings.bookshelfColumns"
                        aria-label="书架每行显示数量"
                        @change="flushSettings"
                    >
                        <option v-for="count in bookshelfColumnOptions" :key="count" :value="count">
                            {{ count }} 本
                        </option>
                    </select>
                </label>
                <button class="fqa-btn" :disabled="loading" @click="refresh">
                    {{ loading ? '刷新中…' : '刷新' }}
                </button>
            </div>
        </div>

        <div ref="tabsRef" class="fqa-tabs" role="tablist">
            <div
                v-for="tab in TABS"
                :key="tab.key"
                class="fqa-tab"
                :class="{ 'fqa-tab-active': activeTab === tab.key }"
                role="tab"
                tabindex="0"
                :aria-selected="activeTab === tab.key"
                @click="selectTab(tab.key)"
                @keydown.enter.prevent="selectTab(tab.key)"
            >
                {{ tab.label }}<span class="fqa-tab-count">{{ counts[tab.key] }}</span>
            </div>
            <span class="fqa-tab-ink" :style="inkStyle"></span>
        </div>

        <div v-if="openedGroup" class="fqa-groupbar">
            <button class="fqa-btn" @click="backToList">← 返回</button>
            <span class="fqa-groupbar-name">{{ openedGroup.name }}</span>
            <span class="fqa-groupbar-count">共{{ openedGroup.books.length }}本书</span>
        </div>

        <div v-if="error" class="fqa-status">
            <div class="fqa-status-title">书架加载失败</div>
            <div>{{ error }}</div>
            <button class="fqa-btn" @click="refresh">重试</button>
        </div>

        <div v-else-if="isEmpty" class="fqa-status">
            <div class="fqa-status-title">{{ emptyText }}</div>
        </div>

        <template v-else>
            <div class="fqa-grid" :style="bookshelfGridStyle">
                <template v-if="loading">
                    <div v-for="n in 8" :key="`sk-${n}`" class="fqa-card">
                        <div class="fqa-sk-cover fqa-sk-anim"></div>
                        <div class="fqa-sk-line fqa-sk-anim" style="width: 90%"></div>
                        <div class="fqa-sk-line fqa-sk-anim" style="width: 55%"></div>
                    </div>
                </template>

                <template v-else v-for="cell in cells" :key="cell.key">
                    <BookCard
                        v-if="cell.kind === 'book'"
                        :entry="cell.entry"
                        @hover="onCardHover"
                        @leave="scheduleHide"
                        @open="openBook"
                        @visible="onCardVisible"
                        @contextmenu="onCardContextMenu"
                    />
                    <BookGroupCard v-else :group="cell.group" @open="openGroup" @visible="onGroupVisible" />
                </template>
            </div>

            <!-- 滚动哨兵：进入视口即追加下一页 -->
            <div v-if="!loading && hasMore" ref="sentinel" class="fqa-loadmore">加载中…</div>
        </template>

        <Teleport to="body">
            <BookHoverCard
                :entry="hoverEntry"
                :x="hoverPos.x"
                :y="hoverPos.y"
                :height="hoverHeight"
                :visible="hoverVisible"
                @panel-enter="onPanelEnter"
                @panel-leave="onPanelLeave"
            />
            <ContextMenu
                :visible="menuVisible"
                :x="menuPos.x"
                :y="menuPos.y"
                :items="menuItems"
                @select="onMenuSelect"
                @close="menuVisible = false"
            />
            <div v-if="toast" class="fqa-toast">{{ toast }}</div>
        </Teleport>
    </div>
</template>
