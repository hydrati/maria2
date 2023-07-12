import { type Socket, type ReadyState } from '../conn.ts'
import { decodeMessageData, isNodeEnv } from '../shared.ts'

const createPost = await (async () => {
  if (fetch != null) {
    const headers = new Headers([['content-type', 'application/json']])

    return (url: string, json: string) =>
      new Promise<string>((onResolve, onReject) => {
        globalThis
          .fetch(url, {
            body: json,
            headers,
          })
          .then((r) => r.text().then(onResolve, onReject), onReject)
      })
  } else if (isNodeEnv) {
    const http = await import('node:http')

    return (url: string, json: string) =>
      new Promise<string>((onResolve, onReject) => {
        const req = http.request(
          url,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(json),
            },
          },
          (res) => {
            res.setEncoding('utf8')

            const chunks: any[] = []
            res.on('data', (chunk) => chunks.push(chunk))
            res.on('end', () => onResolve(decodeMessageData(chunks)))
          }
        )

        req.once('error', onReject)

        req.write(json)
        req.end()
      })
  } else if (globalThis.XMLHttpRequest != null) {
    return (url: string, json: string) =>
      new Promise<string>((onResolve, onReject) => {
        const xhr = new globalThis.XMLHttpRequest()
        xhr.onload = () =>
          xhr.status == 200 ? onResolve(xhr.responseText) : onReject(xhr)

        xhr.onerror = onReject
        xhr.onabort = onReject
        xhr.ontimeout = onReject

        xhr.setRequestHeader('content-type', 'application/json')
        xhr.open('POST', url, true)
        xhr.send(json)
      })
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
