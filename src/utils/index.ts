export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function cloneElement<T extends Element>(element: T): T {
    return element.cloneNode(true) as T;
}

/**
 * 等待选择器命中的元素出现。
 */
export function waitForElement<T extends Element = HTMLElement>(
    selector: string,
    timeout = 15_000
): Promise<T | null> {
    const existing = document.querySelector<T>(selector);
    if (existing) return Promise.resolve(existing);

    return new Promise<T | null>(resolve => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const observer = new MutationObserver(() => {
            const el = document.querySelector<T>(selector);
            if (el) {
                if (timer) clearTimeout(timer);
                observer.disconnect();
                resolve(el);
            }
        });
        const start = () => {
            observer.observe(document.documentElement, { childList: true, subtree: true });
            timer = setTimeout(() => {
                observer.disconnect();
                resolve(document.querySelector<T>(selector));
            }, timeout);
        };
        if (document.documentElement) {
            start();
        } else {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        }
    });
}

export function chunk<T>(list: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < list.length; i += size) {
        result.push(list.slice(i, i + size));
    }
    return result;
}