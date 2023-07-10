import type { ClientAria2, ClientSystem } from './client'
import type { Conn, Socket } from './conn'
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

export const system = Object.freeze(
  ['system.multicall', 'system.listMethods', 'system.listNotifications'].reduce(
    (o, k) => {
      o[k.slice(7)] = (conn: Conn, ...args: unknown[]) =>
        conn.sendRequest(k, ...args)
      return o
    },
    Object.create(null)
  )
) as Readonly<ClientSystem>

export const aria2 = Object.freeze(
  Object.assign(
    {
      when: (conn: Conn, t: string, h: any) => conn.onNotification(t, h),
    },
    [
      'aria2.changeOption',
      'aria2.changeGlobalOption',
      'aria2.getGlobalOption',
      'aria2.getOption',
      'aria2.getSessionInfo',
      'aria2.shutdown',
      'aria2.forceShutdown',
      'aria2.saveSession',
      'aria2.getGlobalStat',
      'aria2.getVersion',
      'aria2.purgeDownloadResult',
      'aria2.removeDownloadResult',
      'aria2.changeUri',
      'aria2.changePosition',
      'aria2.getPeers',
      'aria2.getFiles',
      'aria2.getUris',
      'aria2.getServers',
      'aria2.tellStatus',
      'aria2.tellWaiting',
      'aria2.tellStopped',
      'aria2.tellActive',
      'aria2.remove',
      'aria2.forceRemove',
      'aria2.pause',
      'aria2.forcePause',
      'aria2.unpause',
      'aria2.unpauseAll',
      'aria2.pauseAll',
      'aria2.forcePauseAll',
      'aria2.addMetalink',
      'aria2.addTorrent',
      'aria2.addUri',
    ].reduce<any>((o, k) => {
      o[k.slice(6)] = (conn: Conn, ...args: unknown[]) =>
        conn.sendRequest(k, ...args)
      return o
    }, {}),
    [
      'aria2.onDownloadStart',
      'aria2.onDownloadPause',
      'aria2.onDownloadStop',
      'aria2.onDownloadComplete',
      'aria2.onDownloadError',
      'aria2.onBtDownloadComplete',
    ].reduce<any>((o, k) => {
      o[k.slice(6)] = (conn: Conn, h: any) => conn.onNotification(k, h)
      return o
    }, {})
  )
) as Readonly<ClientAria2>
