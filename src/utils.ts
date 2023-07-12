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

const isNodeEnv = (globalThis as any)?.global?.process?.versions?.node != null
const isDenoEnv = (globalThis as any)?.Deno?.version?.deno != null

// @ts-ignore
export const WebSocket =
  (globalThis as any)?.WebSocket ??
  (isNodeEnv ? (await import('ws')).default : void 0)

// @ts-ignore
export const fetch =
  globalThis.fetch ??
  (isNodeEnv ? (await import('cross-fetch')).default : void 0)

// @ts-ignore
export const randomUUID = await (async () => {
  if (globalThis?.crypto?.randomUUID != null) {
    return () => globalThis.crypto.randomUUID()
  } else {
    if (isNodeEnv || isDenoEnv) {
      if (isNodeEnv) {
        const webCrypto = await (() => import('node:crypto'))()
        if (webCrypto?.webcrypto?.randomUUID != null) {
          return () => webCrypto.webcrypto.randomUUID()
        }
      }

      const uuidV4 = (await (() => import(isDenoEnv ? 'uuid' : 'npm:uuid'))())
        ?.v4
      if (uuidV4 != null) {
        return () => uuidV4()
      }
    }

    console.warn(
      '[warn] Not found `crypto.randomUUID()` in this environment; ' +
        'switching to fallback (unsafe).'
    )

    let count = 0
    return () => (count += 1).toString()
  }
})()
