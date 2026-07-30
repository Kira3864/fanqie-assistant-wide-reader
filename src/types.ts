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