export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function cloneElement<T extends Element>(element: T): T {
    return element.cloneNode(true) as T;
}