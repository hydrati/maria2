export const isDev =
  process.env['NODE_ENV'] != 'production' ||
  (globalThis as any)?.Deno?.env?.get?.('NODE_ENV') != 'production'

export const isNodeEnv =
  (globalThis as any)?.global?.process?.versions?.node != null

export const once = <T extends unknown[], R>(
  fn: (...args: T) => R
): ((...args: T) => R) => {
  let ret: R
  let triggered = false

  return (...args: T) =>
    triggered ? ret : ((triggered = true), (ret = fn(...args)))
}

// @ts-ignore
export const randomUUID = await (async () => {
  if (globalThis?.crypto?.randomUUID != null) {
    return () => globalThis.crypto.randomUUID()
  } else {
    if (isNodeEnv) {
      const nodeUUID = (await import('./shims/node.ts')).randomUUID
      if (nodeUUID != null) return nodeUUID
    }

    if (typeof Math.random == 'function') {
      if (isDev) {
        console.warn(
          '[maria2 warn] Not found `crypto.randomUUID()` in this environment; ' +
            'switching to fallback (Math.random)'
        )
      }

      return () =>
        [Math.random(), Math.random(), Math.random()]
          .map((v) => v.toString(16).slice(2))
          .join('')
          .slice(0, 32)
          .padStart(32, '0')
    }

    if (isDev) {
      console.warn(
        '[maria2 warn] Not found `crypto.randomUUID()` in this environment; ' +
          'switching to fallback (unsafe counting)'
      )
    }

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
      throw new Error(`[maria2 error] Timeout of ${ms}ms exceeded`)
    }),
  ])

export { decodeMessageData } from './shims/decode.ts'
