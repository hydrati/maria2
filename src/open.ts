import type { ClientAria2, ClientSystem } from './client'
import type { Conn, Socket } from './conn'
import { RpcCall } from './types'
import { once, type Disposable } from './utils'

const webCrypto = crypto ?? require('crypto').webcrypto
const _queueMicrotask =
  queueMicrotask ??
  ((f) => {
    new Promise(() => f())
  })

const decodeMessageData = (data: unknown) => {
  if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data)
  } else if (Array.isArray(data)) {
    const i: string[] = []
    const d = new TextDecoder()
    for (const r of data) {
      if (typeof r == 'string') {
        i.push(r)
      } else if (r instanceof Uint8Array || data instanceof ArrayBuffer) {
        i.push(d.decode(r))
      } else if (r.buffer instanceof ArrayBuffer) {
        i.push(d.decode(r.buffer))
      }
    }
    return i.join('')
  } else {
    throw new Error('Data cannot be decoded')
  }
}

const createCallback = <T>(
  id: string,
  onResolve: (v: T) => void,
  onReject: (e: any) => void
) => {
  return (err: any, ret: unknown) =>
    err != null ? onReject(err) : onResolve(ret as T)
}

export const openAsync = async (
  socket: Socket,
  secret?: string,
  onMessageError?: (err: unknown) => void
): Promise<Conn> => {
  const listeners = new Map<string, Set<(...args: any[]) => void>>()
  const callbacks = new Map<string, (err?: any, ret?: any) => void>()

  const invokeCallback = (body: any) => {
    const cb = callbacks.get(body.id)
    if (cb) {
      callbacks.delete(body.id)
      _queueMicrotask(() => cb(body.error, body.result))
    }
  }

  const dispatchNotification = (body: any) =>
    listeners.get(body.method)?.forEach((fn) => fn(...body.params))

  const handleMessage = ({ data }: { data: unknown }) => {
    try {
      const body = JSON.parse(decodeMessageData(data))

      if (body.method != null) {
        dispatchNotification(body)
        return
      }

      if (body.id != null && (body.result != null || body.error != null)) {
        invokeCallback(body)
        return
      }
    } catch (err: any) {
      onMessageError?.(err)
    }
  }

  if (socket.readyState == 0) {
    await new Promise((r) =>
      socket.addEventListener('open', () => r(null), { once: true })
    )
  } else if (socket.readyState == 2) {
    throw new Error('Socket is closed')
  }

  socket.addEventListener('message', handleMessage)

  return {
    sendRequest: (method: string, ...params: any[]) =>
      new Promise((onResolve, onReject) => {
        if (socket.readyState != 1) {
          return onReject(new Error('Socket is not open'))
        }

        const id = webCrypto.randomUUID()
        callbacks.set(id, createCallback(id, onResolve, onReject))

        const body = JSON.stringify({
          jsonrpc: '2.0',
          id,
          method,
          params: secret !== null ? [secret, params] : params,
        } satisfies RpcCall)

        try {
          socket.send(body)
        } catch (err: any) {
          onReject(err)
          onMessageError?.(err)
        }
      }),

    onNotification: <T extends (...args: unknown[]) => void>(
      type: string,
      listener: T
    ): Disposable<T> => {
      let bucket = listeners.get(type)
      bucket || listeners.set(type, (bucket = new Set()))

      bucket.add(listener)

      return {
        dispose: once(() => {
          listeners.get(type)?.delete(listener)
          return listener
        }),
      }
    },
  }
}

export const system = Object.freeze(
  ['system.multicall', 'system.listMethods', 'system.listNotifications'].reduce(
    (obj, methodName) => {
      obj[methodName.slice(7)] = (conn: Conn, ...args: unknown[]) =>
        conn.sendRequest(methodName, ...args)
      return obj
    },
    {} as any
  )
) as Readonly<ClientSystem>

export const aria2 = Object.freeze(
  Object.assign(
    {
      when: (conn: Conn, type: string, listener: any) =>
        conn.onNotification(type, listener),
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
    ].reduce((obj, methodName) => {
      obj[methodName.slice(6)] = (conn: Conn, ...args: unknown[]) =>
        conn.sendRequest(methodName, ...args)
      return obj
    }, {} as any),
    [
      'aria2.onDownloadStart',
      'aria2.onDownloadPause',
      'aria2.onDownloadStop',
      'aria2.onDownloadComplete',
      'aria2.onDownloadError',
      'aria2.onBtDownloadComplete',
    ].reduce((obj, methodName) => {
      obj[methodName.slice(6)] = (conn: Conn, h: any) =>
        conn.onNotification(methodName, h)
      return obj
    }, {} as any)
  )
) as Readonly<ClientAria2>
