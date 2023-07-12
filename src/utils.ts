export interface Disposable<T = void> {
  dispose(): T
}

export type TrimStart<T, U extends string> = T extends `${U}${infer P}` ? P : T

export const once = <T extends unknown[], R>(
  fn: (...args: T) => R
): ((...args: T) => R) => {
  let ret: R
  let triggered = false

  return (...args: T) =>
    triggered ? ret : ((triggered = true), (ret = fn(...args)))
}

export const decodeMessageData = (data: any) => {
  if (typeof data == 'string') {
    return data
  } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data)
  } else if (data.buffer instanceof ArrayBuffer) {
    return new TextDecoder().decode(data.buffer)
  } else if (Array.isArray(data)) {
    const out: string[] = []
    const decoder = new TextDecoder()
    for (const chunk of data) {
      if (typeof chunk == 'string') {
        out.push(chunk)
      } else if (chunk instanceof Uint8Array || chunk instanceof ArrayBuffer) {
        out.push(decoder.decode(chunk))
      } else if (chunk.buffer instanceof ArrayBuffer) {
        out.push(decoder.decode(chunk.buffer))
      }
    }
    return out.join('')
  } else {
    throw new Error('Data cannot be decoded')
  }
}

export const isNodeEnv = global?.process?.versions?.node != null
export const isDenoEnv = (globalThis as any)?.Deno?.version?.deno != null

export const createPost = await (async () => {
  if (fetch != null) {
    return (url: string, json: string) =>
      new Promise<string>((onResolve, onReject) => {
        globalThis
          .fetch(url, {
            body: json,
            headers: new Headers([['content-type', 'application/json']]),
          })
          .then((r) => r.text().then(onResolve, onReject), onReject)
      })
  } else if (isNodeEnv) {
    const http = await import('node:http')

    return (url: string, json: string) =>
      new Promise<string>((onResolve, onReject) => {
        const req = http.request(
          url,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(json),
            },
          },
          (res) => {
            res.setEncoding('utf8')

            const chunks: any[] = []
            res.on('data', (chunk) => chunks.push(chunk))
            res.on('end', () => onResolve(decodeMessageData(chunks)))
          }
        )

        req.once('error', onReject)

        req.write(json)
        req.end()
      })
  } else if (globalThis.XMLHttpRequest != null) {
    return (url: string, json: string) =>
      new Promise<string>((onResolve, onReject) => {
        const xhr = new globalThis.XMLHttpRequest()
        xhr.onload = () =>
          xhr.status == 200 ? onResolve(xhr.responseText) : onReject(xhr)

        xhr.onerror = onReject
        xhr.onabort = onReject
        xhr.ontimeout = onReject

        xhr.setRequestHeader('content-type', 'application/json')
        xhr.open('POST', url, true)
        xhr.send(json)
      })
  } else {
    return () => {
      throw new Error('Not found any http client implementation.')
    }
  }
})()

// @ts-ignore
export const WebSocket =
  (globalThis as any)?.WebSocket ??
  (isNodeEnv
    ? (await import('ws')).default
    : class {
        constructor() {
          throw new Error('Not found any http client implementation.')
        }
      })

// @ts-ignore
export const randomUUID = await (async () => {
  if (globalThis?.crypto?.randomUUID != null) {
    return () => globalThis.crypto.randomUUID()
  } else {
    if (isNodeEnv || isDenoEnv) {
      if (isNodeEnv) {
        const nodeCrypto = await import('node:crypto')
        if (nodeCrypto?.randomUUID != null) {
          return () => nodeCrypto.randomUUID()
        }
      }

      const uuidV4 = (await import('uuid'))?.v4
      if (uuidV4 != null) {
        return () => uuidV4()
      }
    }

    console.warn(
      '[warn] Not found `crypto.randomUUID()` in this environment; ' +
        'switching to fallback (unsafe)'
    )

    let count = 0
    return () => (count += 1).toString()
  }
})()

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const useTimeout = <T>(
  p: PromiseLike<T>,
  ms: number,
  onTimeout?: () => void
): Promise<T> =>
  Promise.race([
    p,
    sleep(ms).then(() => {
      onTimeout?.()
      throw new Error(`Timeout of ${ms}ms exceeded`)
    }),
  ])
