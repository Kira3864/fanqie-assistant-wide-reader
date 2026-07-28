import { defaultConfig, shared_key, type DeviceConfig } from "../config";

// 番茄小说始终运行在安全上下文，所以 unsafeWindow 一定能兜底获取到 Crypto API 对象。
// 如果没有，更大可能是浏览器版本过低，或者被某些扩展破坏了安全上下文。
// 惰性求值：模块顶层不抛错，否则会连带炸掉 CSS 注入、字体解密等不依赖本模块的功能。
function getCrypto(): Crypto {
    const c = globalThis.crypto ?? (unsafeWindow.crypto as Crypto | undefined);
    if (!c?.subtle) {
        throw new Error("Crypto API不可用，请检查浏览器版本是否支持该API");
    }
    return c;
}

function getSubtle(): SubtleCrypto {
    return getCrypto().subtle;
}


export function b64decode(b64: string): ArrayBuffer {
    const binaryString = atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


export function b64encode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    const chunks: string[] = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
        chunks.push(
            String.fromCharCode(...bytes.subarray(i, i + chunkSize)),
        );
    }
    return btoa(chunks.join(""));
}


export function unhex(hex: string): ArrayBuffer {
    if (hex.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.slice(i, i + 2), 16);
        if (Number.isNaN(byte)) {
            throw new Error("Invalid hex string");
        }
        bytes[i / 2] = byte;
    }
    return bytes.buffer;
}


export function randomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const array = new Uint8Array(length);
    getCrypto().getRandomValues(array);
    for (let i = 0; i < length; i++) {
        result += chars.charAt(array[i]! % chars.length);
    }
    return result;
}


// 正文算法: AES/CBC/PKCS5Padding
// 返回 string(xhtml/html) | 章节 JSON 对象 | undefined(解析失败)
export async function decryptChapter(
    encrypted: string,
    config: DeviceConfig = defaultConfig,
): Promise<string | unknown> {
    if (!encrypted) {
        throw new Error("Invalid encrypted chapter");
    };
    const buf = b64decode(encrypted);
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const key = config.key_info?.key;
    if (!key) {
        throw new Error("Missing decrypt key")
    }
    const subtle = getSubtle();
    const cryptoKey = await subtle.importKey(
        "raw",
        key,
        { name: "AES-CBC" },
        false,
        ["decrypt"],
    );
    return subtle.decrypt(
        { name: "AES-CBC", iv },
        cryptoKey,
        data,
    ).then((decrypted) => {
        const decoder = new TextDecoder();
        const plain = decoder.decode(decrypted);
        if (plain.trim().startsWith("<")) { // xhtml || html
            return plain;
        }
        try {
            return JSON.parse(plain); // mostly JSONObject
        } catch (e: any) {
            console.warn('Invalid chapter content: ', plain, e);
            return undefined;
        }
    });
}


function reverseHex(value: string): string {
    const be = BigInt(value).toString(16).padStart(32, "0");
    let result = "";
    for (let i = be.length; i > 0; i -= 2) result += be.slice(i - 2, i);
    return result;
}


export async function encryptKeyinfoBody(config: DeviceConfig): Promise<string> {
    const deviceId = config.device_id;
    const iv = new TextEncoder().encode(randomString(16));
    // 如果是i32类型（返回8字节）则啥也不用管。但是如果返回16以上（i64+），则需要取前八位，后面是0，删了
    // BigInt按i64返回，所以取前八位
    const data = new Uint8Array(unhex(reverseHex(deviceId))).slice(0, 8);
    console.log(data)
    const subtle = getSubtle();
    const k = await subtle.importKey(
        "raw",
        shared_key,
        { name: "AES-CBC" },
        false,
        ["encrypt"],
    )
    const encrypted = await subtle.encrypt(
        { name: "AES-CBC", iv },
        k,
        data
    );

    const final = new Uint8Array(iv.length + encrypted.byteLength);
    console.log(final)
    final.set(iv, 0);
    final.set(new Uint8Array(encrypted), iv.length);
    return JSON.stringify({
        content: b64encode(final.buffer),
    });
}


export async function decryptKeyinfoResponse(encrypted: string): Promise<ArrayBuffer> {
    const buf = b64decode(encrypted);
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const subtle = getSubtle();
    const k = await subtle.importKey(
        "raw",
        shared_key,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );
    return subtle.decrypt(
        { name: "AES-CBC", iv },
        k,
        data
    );
}

export async function decryptMangaImage(image: ArrayBuffer, key: string /* hex */): Promise<ArrayBuffer> {
    const subtle = getSubtle();
    // AESGCM
    const cryptoKey = await subtle.importKey(
        "raw",
        unhex(key),
        { name: "AES-GCM" },
        false,
        ["decrypt"],
    );
    const iv = image.slice(0, 12);
    const data = image.slice(12);
    return await subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        data,
    );
}