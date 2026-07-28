import type { HookConfig, HookEvent } from "../config";
import readerHook from "./readerHook";

const hooks = [
    ...readerHook,
] as HookConfig[];

async function eventListener(event: HookEvent, previous?: string) {
    console.log(`eventListener, event: ${event}, previous: ${previous}`);
    const path = window.location.pathname;
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    for (const hook of hooks) {
        if (hook.event === event && hook.filter(path, params, hash)) {
            await hook.handler();
        }
    }
    return Promise.resolve();
}

export async function onUrlChange(previous: string) {
    return eventListener('onUrlChange', previous);
}

export async function onHashChange(previous: string) {
    return eventListener('onHashChange', previous);
}

export async function onLoad() {
    return eventListener('load');
}