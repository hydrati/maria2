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

export const WebSocket = (() =>
  globalThis.WebSocket ?? globalThis?.require?.('ws'))()

export const fetch = (() =>
  globalThis.fetch ?? globalThis?.require?.('cross-fetch'))()

export const randomUUID = ((): (() => string) => {
  if (globalThis.crypto.randomUUID != null) {
    return () => globalThis.crypto.randomUUID()
  } else {
    const nodeCryptoUUID =
      globalThis?.require?.('crypto')?.webcrypto?.randomUUID
    if (nodeCryptoUUID != null) {
      return () => nodeCryptoUUID()
    } else {
      const uuidV4 = globalThis?.require?.('uuid')?.v4
      if (uuidV4 != null) {
        return () => uuidV4()
      } else {
        console.warn(
          'Not Found `crypto.randomUUID()` in this enviroment, used unsafe count instead.'
        )
        let count = 0
        return () => (count += 1).toString()
      }
    }
  }
})()
