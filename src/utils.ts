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

export const crypto = (() =>
  globalThis.crypto ?? globalThis?.require?.('crypto')?.webcrypto)()
