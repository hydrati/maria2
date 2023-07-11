import type { ClientAria2, ClientSystem } from './client'
import type { Conn, Socket } from './conn'
import type { RpcCall } from './types'
import { once, type Disposable } from './utils'

const decodeMessageData = (data: any) => {
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
      queueMicrotask(() => cb(body.error, body.result))
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
    getSecret: () => secret,
    sendRequest: (useSecret: boolean, method: string, ...params: any[]) =>
      new Promise((onResolve, onReject) => {
        if (socket.readyState != 1) {
          return onReject(new Error('Socket is not open'))
        }

        const id = crypto.randomUUID()
        callbacks.set(id, createCallback(id, onResolve, onReject))

        const body = JSON.stringify({
          jsonrpc: '2.0',
          id,
          method,
          params:
            secret != null && useSecret
              ? [`token:${secret}`, ...params]
              : params,
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
  Object.assign(
    {
      multicall: (conn: Conn, ...args: any[]) => {
        const secret = conn.getSecret()

        if (secret != null) {
          return conn.sendRequest(
            false,
            'system.multicall',
            ...args.map((v) => {
              const obj = Object.assign({}, v)
              obj.params = [`token:${secret}`, ...obj.params]
              return obj
            })
          )
        }

        return conn.sendRequest(false, 'system.multicall', ...args)
      },
    },
    ['system.listMethods', 'system.listNotifications'].reduce(
      (obj, methodName) => {
        obj[methodName.slice(7)] = (conn: Conn, ...args: unknown[]) =>
          conn.sendRequest(false, methodName, ...args)
        return obj
      },
      {} as any
    )
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
        conn.sendRequest(true, methodName, ...args)
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
