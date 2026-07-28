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