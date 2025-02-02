import type { ClientAria2, ClientSystem } from './client.ts'
import type {
  Conn,
  Open,
  OpenOptions,
  PreconfiguredSocket,
  SendRequestOptions,
  Socket,
} from './conn.ts'
import type { Disposable } from './types/disposable.ts'
import { ReadyState } from './conn.ts'
import { decode, once, useTimeout } from './shared.ts'

function createCallback<T>(onResolve: (v: T) => void, onReject: (e: any) => void) {
  return (err: any, ret: unknown) =>
    err != null ? onReject(err) : onResolve(ret as T)
}

export function close(conn: Conn, code?: number, reason?: string) {
  return conn.socket.close(code, reason)
}

export const open: Open = async (
  socket: Socket | PreconfiguredSocket,
  options: OpenOptions = {},
): Promise<Conn> => {
  const { onServerError, secret, timeout, openTimeout } = Object.assign(
    { timeout: 5000, openTimeout: 5000 },
    (socket as PreconfiguredSocket)?.getOptions() ?? {},
    options,
  )

  const listeners = new Map<string, Set<(...args: any[]) => void>>()
  const callbacks = new Map<string, (err?: any, ret?: any) => void>()

  const invokeCallback = (body: any) => {
    const cb = callbacks.get(body.id)
    if (cb) {
      callbacks.delete(body.id)
      cb(body.error, body.result)
    }
  }

  const dispatchNotification = (body: any) =>
    listeners.get(body.method)?.forEach(fn => fn(...body.params))

  const handleMessage = async ({ data }: { data: ArrayBuffer | Blob | string }) => {
    const body = JSON.parse(await decode(data))

    if (body.method != null) {
      dispatchNotification(body)
      return
    }

    if (body.result != null || body.error != null) {
      if (body.id != null)
        invokeCallback(body)
      else if (body.error != null)
        onServerError?.(body.error)
    }
  }

  if (socket.readyState == ReadyState.Connecting) {
    await useTimeout(
      new Promise(r =>
        socket.addEventListener('open', () => r(null), { once: true }),
      ),
      openTimeout,
    )
  }
  else if (socket.readyState == ReadyState.Closing) {
    throw new Error('[maria2 error] Socket is closing')
  }
  else if (socket.readyState == ReadyState.Closed) {
    throw new Error('[maria2 error] Socket is closed')
  }

  socket.addEventListener('message', handleMessage)

  return Object.freeze({
    get socket() { return socket },
    get secret() { return secret },

    sendRequest: <T>(
      {
        method,
        secret: useSecret = true,
        timeout: timeout_,
      }: SendRequestOptions,
      ...params: any[]
    ) => {
      const id = crypto.randomUUID()
      const p = new Promise<T>((onResolve, onReject) => {
        if (socket.readyState != ReadyState.Open) {
          return onReject(new Error('[maria2 error] Socket is not open'))
        }

        callbacks.set(id, createCallback(onResolve, onReject))

        const body = JSON.stringify({
          jsonrpc: '2.0',
          id,
          method,
          params:
            secret != null && useSecret
              ? [`token:${secret}`, ...params]
              : [...params],
        })

        try {
          socket.send(body)
        }
        catch (err: any) {
          onReject(err)
        }
      })

      return timeout_ === false
        ? p
        : typeof timeout_ == 'number'
          ? useTimeout(p, timeout_, () => callbacks.delete(id))
          : useTimeout(p, timeout, () => callbacks.delete(id))
    },

    onNotification: <T extends (...args: unknown[]) => void>(
      type: string,
      listener: T,
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
  })
}

export const system = Object.freeze(
  Object.assign(
    {
      multicall: (conn: Conn, ...args: any[]) => {
        const secret = conn.secret

        if (secret != null) {
          return conn.sendRequest(
            { method: 'system.multicall', secret: false },
            args.map((v) => {
              const obj = Object.assign({}, v)
              obj.params = [`token:${secret}`, ...obj.params]
              return obj
            }),
          )
        }

        return conn.sendRequest(
          { method: 'system.multicall', secret: false },
          args,
        )
      },
    },
    ['system.listMethods', 'system.listNotifications'].reduce((obj, method) => {
      obj[method.slice(7)] = (conn: Conn, ...args: unknown[]) =>
        conn.sendRequest({ method, secret: false }, ...args)
      return obj
    }, {} as any),
  ),
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
    ].reduce((obj, method) => {
      obj[method.slice(6)] = (conn: Conn, ...args: unknown[]) =>
        conn.sendRequest({ method, secret: true }, ...args)
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
    }, {} as any),
  ),
) as Readonly<ClientAria2>
