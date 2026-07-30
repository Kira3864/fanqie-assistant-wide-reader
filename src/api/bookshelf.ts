import { fetch } from '../config'
import type { BookShelfBookInfo, BookShelfItem } from '../types'

export async function getBookshelf(): Promise<BookShelfItem[]> {
    const responses = await Promise.all([
        fetch('https://fanqienovel.com/reading/bookapi/bookshelf/info/v:version/?aid=1967&iid=0&version_code=57700&update_version_code=57700'),
        fetch('https://fanqienovel.com/api/reader/book/progress')
    ])
    const response = responses[0]
    const response2 = responses[1]
    const data = await response.json()
    const info: Array<any> = data.data.book_shelf_info
    const data_ = await response2.json()
    const data2: Array<any> = data_.data
    const all_items = info.map(item => item.book_id)
    const response3 = await fetch('https://fanqienovel.com/api/book/simple/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            book_ids: all_items
        })
    })
    const data__ = await response3.json()
    const data3: Array<any> = data__.data.bookList
    const results = []
    for (let i of data.data.book_shelf_info) {
        const progress = data2.find(it => it.book_id === i.book_id)
        const simple = data3.find(it => it.book_id === i.book_id)
        const item: BookShelfItem = {
            book_id: i.book_id,
            last_operate_time: progress ? progress.read_timestamp : i.last_operate_time,
            add_shelf_time: i.add_shelf_time,
            group_name: i.group_name,
            last_read_timestamp: progress ? progress.read_timestamp : 0,
            last_read_chapter_id: progress ? progress.item_id : '0',
            is_publish: simple?.genre === '6'
        }
        results.push(item)
    }
    return results
}

export async function multidetail(books: BookShelfItem[]): Promise<BookShelfBookInfo[]> {
    const response = await fetch('https://fanqienovel.com/api/bookshelf/multidetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            books: books.map(book => {
                return {
                    book_id: book.book_id,
                    item_id: book.last_read_chapter_id,
                }
            })
        })
    })
    const data = await response.json()
    
    const list = data.data.detail_list
    const results = []
    for (let i of list) {
        const item: BookShelfBookInfo = {
            book_id: i.book_id,
            summary: i.abstract,
            title: i.book_name,
            author: i.author_name,
            cover_url: i.thumb_url,
            current_chapter_title: i.item_show_title,
            current_chapter_id: i.item_id,
            current_chapter_order: i.real_chapter_order,
            total_chapter_count: i.serial_count,
            last_chapter_update_time: i.last_chapter_update_time * 1000,
            last_chapter_id: i.last_chapter_item_id,
            current_chapter_summary: i.item_abstract,
            // last_chapter_title: i.last_chapter_show_title,
            status: i.update_stop === '1' ? 4 : i.creation_status,
            update_status: i.update_status
        }
        results.push(item)
    }
    return results
}