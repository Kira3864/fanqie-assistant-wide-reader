export interface ChapterItem {
    item_id: string;
    title: string;
    update_time: string;
    char_count: number;
    volume_title: string;
}

export interface VolumeItem {
    title: string;
    book_id: string;
    chapter_list: ChapterItem[];
}

export interface Book {
    book_id: string;
    title: string;
    author: string;
    cover_url: string;
    summary: string;
    volume_list?: VolumeItem[]; // 之后可以补，允许为空
    update_time: string;
    status: string;
    all_item_ids?: string[]; // 同理
    // chapter_count: number;
    chapter_list?: ChapterItem[]; // 同理
}

export interface CatalogResult {
    book_id: string;
    volume_list: VolumeItem[];
    chapter_list: ChapterItem[];
    all_item_ids: string[];
}

export interface UserTitle {
    title: string
    desc: string
}

export interface UserInfo {
    id: string
    username: string
    avatar: string
    desc: string
    age: number
    // detailed
    gender?: number // 0: 女 | 1: 男 | 2: 未知/没设置
    recommend_gender?: number // 0: 女频 | 1: 男频 | 2: 我都爱看
    fans_num?: number
    following_num?: number
    is_author?: boolean
    author_desc?: string
    read_book_num?: number
    read_book_time?: bigint // ms
}

export interface UserState {
    isLogin: boolean
    userInfo: UserInfo | null
}

export interface BookShelfItem {
    book_id: string
    last_operate_time: number // ms
    add_shelf_time: number // ms
    // 没有时说明没有分组
    group_name?: string
    last_read_timestamp: number // ms
    last_read_chapter_id: string
    is_publish: boolean
}

export interface BookShelfBookInfo {
    book_id: string
    title: string
    author: string
    cover_url: string
    current_chapter_title: string
    current_chapter_id: string
    current_chapter_order: number
    total_chapter_count: number
    last_chapter_update_time: number
    last_chapter_id: string
    current_chapter_summary: string
    // last_chapter_title: string
    summary: string
    status: string // 书籍总体状态。应该先看这个，再看 update_status | 需要特殊判断一下，断更通过 $.update_stop === '1' 判断。根据与详情相同的 API 约束，断更时这个值应该是 4
    update_status: string // 书籍相较于用户的状态 | 0 - 连载 | 1 - 有更新
}

/**
 * 书架条目 = 列表项（快） + 详情（慢，分批补齐）。
 * detail 为 null 时视图渲染骨架屏。
 */
export interface BookShelfEntry {
    item: BookShelfItem
    detail: BookShelfBookInfo | null
}

export interface BookShelfGroup {
    name: string
    books: BookShelfEntry[]
    /** 组内最近操作时间，用于和散书一起按时间排序 */
    last_operate_time: number
}

export type BookShelfTabKey = 'all' | 'group' | 'publish'

/** 全部 tab 里分组卡片与散书混排 */
export type BookShelfCell =
    | { kind: 'book'; key: string; entry: BookShelfEntry }
    | { kind: 'group'; key: string; group: BookShelfGroup }
/** 右键菜单项。有 children 时展开二级面板 */
export interface MenuItem {
    key: string
    label: string
    /** 危险操作，标红 */
    danger?: boolean
    disabled?: boolean
    children?: MenuItem[]
}

/* --------------------------------- 搜索 --------------------------------- */

/** 搜索 tab。tab_type=1 是综合，只有它支持筛选 */
export interface SearchTab {
    tab_type: number
    tab_name: string
    /** 该 tab 是否有筛选器 */
    has_selector: boolean
}

/** 筛选器里的一个可选项 */
export interface SelectorItem {
    id: string
    name: string
    /** 接口标记的默认项 */
    default?: boolean
}

/** 筛选器的一行，例如「类型」「状态」 */
export interface SelectorRow {
    name: string
    items: SelectorItem[]
}

/** 搜索结果里的一本书 */
export interface SearchBook {
    book_id: string
    title: string
    author: string
    cover_url: string
    summary: string
    /** 原始 creation_status，映射用 mappingCreationStatus */
    status: string
    /** 总字数，有声书等可能为 0 */
    word_count: number
    /** 接口下发的展示文案，如「404章」「10.5万人在读」 */
    sub_info: string
    /** 在读人数 */
    read_count: number
    score: string
    category: string
    /** 章节数 */
    chapter_count: number
    last_chapter_title: string
    /** 最近更新时间，ms */
    last_publish_time: number
    /** 命中关键词的标题，只含 <em> */
    highlight_title?: string
    genre?: string
    /** 接口标记该书已在书架 */
    in_bookshelf: boolean
}

/** 一次搜索请求的结果 */
export interface SearchResult {
    books: SearchBook[]
    /** 下一页要回填的 passback，由服务端给出 */
    next_passback: number
    has_more: boolean
    /** 接口返回的全部可用 tab */
    tabs: SearchTab[]
    /** 筛选器定义，只有综合 tab 有 */
    selector_rows: SelectorRow[]
}

/** 搜索中间页（推荐词 / 热搜）*/
export interface SearchSuggestBook {
    book_id: string
    title: string
    cover_url: string
    author?: string
    /** 榜单里的描述，如分类名 */
    desc?: string
}

export interface SearchHotWord {
    word: string
    /** 附加说明，如「877405热搜值」 */
    tag?: string
    /** 角标，如「荐」 */
    label?: string
}

export interface SearchLandingSection {
    title: string
    kind: 'hotword' | 'book'
    words: SearchHotWord[]
    books: SearchSuggestBook[]
}
