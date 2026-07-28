type GMRequestMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE";

export type ApiResponse = Tampermonkey.Response<unknown> & {
    json<T = unknown>(): T;
};

const supportedMethods = new Set<GMRequestMethod>([
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
]);
export default function apiFetch(
    url: string,
    options: RequestInit = {},
): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
        const { signal } = options;

        if (signal?.aborted) {
            reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
            return;
        }

        const headers = normalizeHeaders(options.headers);
        const data = normalizeBody(options.body);
        // 不改写调用方传入的 options 对象。
        const method = options.method ?? (data ? "POST" : "GET");
        if (!supportedMethods.has(method as GMRequestMethod)) {
            reject(new TypeError(`Unsupported request method: ${method}`));
            return;
        }

        // abort/cleanup 必须在 GM_xmlhttpRequest 之前声明：
        // 回调若同步触发，闭包引用尚未初始化的绑定会抛 ReferenceError(TDZ)。
        let request: Tampermonkey.AbortHandle<void> | undefined;
        const abort = () => request?.abort();

        function cleanup(): void {
            signal?.removeEventListener("abort", abort);
        }

        request = GM_xmlhttpRequest({
            url,
            method: method as GMRequestMethod,
            headers,
            data,
            anonymous: options.credentials === "omit",

            redirect:
                options.redirect === "error"
                    ? "error"
                    : "follow",

            onload(response) {
                cleanup();
                resolve(Object.assign(response, {
                    json<T = unknown>(this: Tampermonkey.Response<unknown>): T {
                        return JSON.parse(this.responseText) as T;
                    },
                }));
            },

            onerror(response) {
                cleanup();
                reject(createRequestError("Network request failed", response));
            },

            ontimeout() {
                cleanup();
                reject(createRequestError("Network request timed out", {
                    status: 0,
                    statusText: "Timeout",
                    url,
                }));
            },

            onabort() {
                cleanup();
                reject(
                    signal?.reason ??
                    new DOMException("The operation was aborted", "AbortError"),
                );
            },
        });

        signal?.addEventListener("abort", abort, { once: true });
    });
}

function normalizeHeaders(
    headers?: HeadersInit,
): Record<string, string> | undefined {
    if (!headers) {
        return undefined;
    }

    return Object.fromEntries(new Headers(headers).entries());
}

function normalizeBody(
    body?: BodyInit | null,
): string | Blob | ArrayBuffer | FormData | undefined {
    if (body == null) {
        return undefined;
    }

    if (body instanceof URLSearchParams) {
        return body.toString();
    }

    if (
        typeof body === "string" ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof FormData
    ) {
        return body;
    }

    if (ArrayBuffer.isView(body)) {
        return body.buffer.slice(
            body.byteOffset,
            body.byteOffset + body.byteLength,
        ) as ArrayBuffer;
    }

    throw new TypeError(
        "GM_xmlhttpRequest does not support ReadableStream request bodies",
    );
}

function createRequestError(
    message: string,
    response: any,
): TypeError {
    const error = new TypeError(message);

    Object.defineProperty(error, "response", {
        configurable: true,
        enumerable: false,
        value: response,
    });

    return error;
}