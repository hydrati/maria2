import {
  type Socket,
  type ReadyState,
  OpenOptions,
  PreconfiguredSocket,
} from '../conn.ts'
import { isNodeEnv } from '../shared.ts'

const createPost = await (async () => {
  if (fetch != null) {
    const headers = new Headers([['content-type', 'application/json']])

    return (url: string, json: string) =>
      new Promise<string>((onResolve, onReject) => {
        globalThis
          .fetch(url, {
            method: 'POST',
            body: json,
            headers,
          })
          .then((r) => r.text().then(onResolve, onReject), onReject)
      })
  } else if (isNodeEnv) {
    return (await import('../shims/node.ts')).httpPost
  } else if ((globalThis as any).XMLHttpRequest != null) {
    return (await import('../shims/xhr.ts')).xhrPost
  } else {
    return () => {
      throw new Error('Not found any http client implementation.')
    }
  }
})()

export interface CreateHTTP {
  (url: Aria2RpcHTTPUrl): Socket
  (url: Aria2RpcHTTPUrl, options: Partial<OpenOptions>): PreconfiguredSocket
}

export type Aria2RpcHTTPUrl =
  | `${'http' | 'https'}://${string}:${number}/jsonrpc`
  | `${'http' | 'https'}://${string}/jsonrpc`

export const createHTTP: CreateHTTP = (
  url: Aria2RpcHTTPUrl,
  options?: Partial<OpenOptions>
) => {
  return new (class extends EventTarget {
    readyState: ReadyState = 1

    close(): void {
      this.readyState = 3
    }

    getOptions() {
      return options
    }

    send(data: string): void {
      createPost(url, data).then((data: string) => {
        this.dispatchEvent(new MessageEvent('message', { data }))
      })
    }
  })() as any
}

createHTTP('http://127.0.0.1:6800/jsonrpc')
