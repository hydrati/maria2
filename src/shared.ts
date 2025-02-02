export function once<T extends unknown[], R>(fn: (...args: T) => R): ((...args: T) => R) {
  let ret: R
  let triggered = false

  return (...args: T) =>
    triggered ? ret : ((triggered = true), (ret = fn(...args)))
}

export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export function useTimeout<T>(p: PromiseLike<T>, ms: number, onTimeout?: () => void): Promise<T> {
  return Promise.race([
    p,
    sleep(ms).then(() => {
      onTimeout?.()
      throw new Error(`[maria2 error] Timeout of ${ms}ms exceeded`)
    }),
  ])
}

const dec = new TextDecoder()

export async function decode(data: string | ArrayBuffer | Blob): Promise<string> {
  if (typeof data == 'string') {
    return data
  }
  else if (data instanceof Blob) {
    return data.text()
  }

  return dec.decode(data)
}
