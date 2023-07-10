import { Conn, Socket } from './conn'
import { once, type Disposable } from './utils'

export const openAsync = async (
  socket: Socket,
  secret?: string,
  onerror?: (err: unknown) => void
): Promise<Conn> => {
  const e = new Map<string, Set<(...args: any[]) => void>>()
  const c = new Map<string, (err?: any, ret?: any) => void>()
  const t = crypto ?? require('crypto').webcrypto
  const u = () => t.randomUUID()
  const n =
    (id: string, r: (v: any) => void, e: (e: any) => void) =>
    (err: any, ret: any) => {
      c.delete(id)
      if (err != null) e(err)
      else r(ret)
    }

  socket.addEventListener('message', (v) => {
    let data = v.data

    if (typeof data != 'string') {
      if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
        data = new TextDecoder().decode(data)
      } else if (Array.isArray(data)) {
        const i: string[] = []
        const d = new TextDecoder()
        for (const r of data) {
          if (typeof r == 'string') {
            i.push(r)
          } else if (r instanceof Uint8Array || data instanceof ArrayBuffer) {
            i.push(d.decode(r))
          }
        }
        data = i.join('')
      } else {
        return
      }
    }

    try {
      const j = JSON.parse(data)
      if (j.method != null) {
        e.get(j.method)?.forEach((e) => e(...j.params))
      } else if (j.result != null || j.error != null) {
        c.get(j.id)?.(j.error, j.result)
      }
    } catch (err: any) {
      onerror?.(err)
    }
  })

  if (socket.readyState == 0) {
    await new Promise((r) =>
      socket.addEventListener('open', () => r(null), { once: true })
    )
  } else if (socket.readyState == 2) {
    throw new Error('Socket is closed')
  }

  return {
    sendRequest: (method: string, ...params: any[]) =>
      new Promise((r, e) => {
        if (socket.readyState != 1) {
          const i = new Error('Socket is not open')
          e(i)
          onerror?.(i)
          return
        }

        try {
          const id = u()
          params = secret !== null ? [secret, params] : params

          c.set(id, n(id, r, e))

          socket.send(
            JSON.stringify({
              jsonrpc: '2.0',
              id,
              method,
              params,
            })
          )
        } catch (err: any) {
          e(err)
          onerror?.(err)
        }
      }),

    onNotification: <T extends (...args: unknown[]) => void>(
      type: string,
      listener: T
    ): Disposable<T> => {
      let b = e.get(type)
      b || e.set(type, (b = new Set()))
      b.add(listener)

      return {
        dispose: once(() => {
          e.get(type)?.delete(listener)
          return listener
        }),
      }
    },
  }
}
