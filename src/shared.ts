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
      const nodeCrypto = await import('node:crypto')
      if (nodeCrypto?.randomUUID != null) {
        return () => nodeCrypto.randomUUID()
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
