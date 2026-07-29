import { fetch } from '../config'
import { del, read, write } from '../localStorage'

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

export let userState: UserState = {
    isLogin: false,
    userInfo: null,
}
if (read('userState')) {
    userState = read('userState')
}

export async function getDetailedUserInfo(): Promise<UserInfo | null> {
    if (!userState?.isLogin || !userState?.userInfo) {
        return null
    }
    if (userState.userInfo.gender !== undefined &&
        userState.userInfo.recommend_gender !== undefined &&
        userState.userInfo.fans_num !== undefined &&
        userState.userInfo.following_num !== undefined &&
        userState.userInfo.is_author !== undefined &&
        userState.userInfo.author_desc !== undefined &&
        userState.userInfo.read_book_num !== undefined &&
        userState.userInfo.read_book_time !== undefined
    ) {
        return userState.userInfo
    }
    const response = await fetch('https://fanqienovel.com/reading/user/basic_info/get/v?aid=1967')
    const j = await response.json()
    if (j?.data) {
        const data = j.data
        userState.userInfo.gender = data.profile_gender
        userState.userInfo.recommend_gender = data.gender
        userState.userInfo.fans_num = data.fans_num
        userState.userInfo.following_num = data.follow_user_num
        userState.userInfo.is_author = data.is_author
        userState.userInfo.author_desc = data.author_desc
        userState.userInfo.read_book_num = data.read_book_num
        userState.userInfo.read_book_time = BigInt(data.read_book_time)
        // userState.userInfo.titles = data.titles
        return userState.userInfo
    }
    return userState.userInfo
}

export async function getUserInfo(): Promise<UserInfo | null> {
    if (userState?.isLogin && userState.userInfo) return userState.userInfo
    const response = await fetch('https://fanqienovel.com/api/user/info/v2')
    const j = await response.json()
    if (j?.data?.id > 1) {
        userState = {
            isLogin: true,
            userInfo: {
                id: j?.data?.id,
                username: j?.data?.name,
                avatar: j?.data?.avatar,
                desc: j?.data?.desc,
                age: j?.data?.age,
            },
        }
        return userState.userInfo
    } else {
        return null
    }
}

export async function checkLogin() {
    // sessionid is HttpOnly. So we use fetch directly to access user api.
    const response = await fetch('https://fanqienovel.com/api/user/info/v2')
    const j = await response.json()
    const _userInfo = {
        id: j?.data?.id,
        username: j?.data?.name,
        avatar: j?.data?.avatar,
        desc: j?.data?.desc,
        age: j?.data?.age,
    }
    if (j?.data?.id > 1) {
        userState.isLogin = true
        userState.userInfo = _userInfo
        write('userState', userState)
        return true
    } else {
        del('userState')
        return false
    }
}

export default async function init(): Promise<void> {
    await checkLogin()
    if (userState.isLogin) {
        console.log('Hello, ', userState?.userInfo?.username)
    }
}