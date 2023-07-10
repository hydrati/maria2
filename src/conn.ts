import {
  once,
  type Disposable,
  type MaybePromise,
  type TrimStart,
} from './utils'
import WebSocket from 'isomorphic-ws'
export interface Socket {
  send(data: string): void
  on(type: 'message', listener: (event: { data: string }) => void): void
}

export interface Conn {
  sendRequest<T>(method: string, ...args: any[]): MaybePromise<T>
  onNotification<T extends (...args: unknown[]) => void>(
    type: string,
    listener: T
  ): Disposable<T>
}

export const useSocket = (
  socket: Socket,
  secret?: string,
  onerror?: (err: unknown) => void
) => {
  const e = new Map<string, Set<(...args: any[]) => void>>()
  const c = new Map<string, (err?: any, ret?: any) => void>()
  const u = (crypto ?? require('crypto').webcrypto).randomUUID
  const n =
    (id: string, r: (v: any) => void, e: (e: any) => void) =>
    (err: any, ret: any) => {
      c.delete(id)
      if (err !== null) r(ret)
      else e(err)
    }

  socket.on('message', ({ data }) => {
    if (typeof data != 'string') return
    try {
      const j = JSON.parse(data)
      if (j.method !== null) {
        e.get(j.method)?.forEach((e) => e(...j.params))
      } else if (j.id !== null) {
        c.get(j.id)?.(j.error, j.result)
      }
    } catch (err: any) {
      onerror?.(err)
    }
  })
  return {
    sendRequest: (method: string, ...params: any[]) =>
      new Promise((r, e) => {
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
