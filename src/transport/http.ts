import { type Socket, type ReadyState } from '../conn.ts'
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

export type Aria2RpcHTTPUrl =
  | `${'http' | 'https'}://${string}:${number}/jsonrpc`
  | `${'http' | 'https'}://${string}/jsonrpc`

export const createHTTP = (url: Aria2RpcHTTPUrl) => {
  return new (class extends EventTarget {
    readyState: ReadyState = 1

    close(): void {
      this.readyState = 3
    }

    send(data: string): void {
      createPost(url, data).then((data: string) => {
        this.dispatchEvent(new MessageEvent('message', { data }))
      })
    }
  })() as unknown as Socket
}
