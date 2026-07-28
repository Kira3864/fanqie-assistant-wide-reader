import { fetch } from '../config'

export interface UserInfo {
    id: string
    username: string
    avatar: string
    desc: string
    age: number
}

export let userInfo: UserInfo | null = null

export async function getUserInfo() {
    if (userInfo) return userInfo
    const response = await fetch('https://fanqienovel.com/api/user/info/v2')
    const j = await response.json()
    userInfo = j?.data
    return userInfo
}

export async function checkLogin() {
    // sessionid is HttpOnly. So we use fetch directly to access user api.
    const response = await fetch('https://fanqienovel.com/api/user/info/v2')
    const j = await response.json()
    userInfo = {
        id: j?.data?.id,
        username: j?.data?.name,
        avatar: j?.data?.avatar,
        desc: j?.data?.desc,
        age: j?.data?.age,
    } as UserInfo
    return j?.data?.id > 1
}

export default async function init(): Promise<void> {
    await checkLogin()
    if (userInfo) {
        console.log('Hello, ', userInfo.username)
    }
}