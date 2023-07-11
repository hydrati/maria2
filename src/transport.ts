import { ReadyState, type Socket } from './conn'
import { WebSocket, fetch } from './utils'

export type Aria2RpcWebSocketUrl =
  | `${'ws' | 'wss'}://${string}:${number}/jsonrpc`
  | `${'ws' | 'wss'}://${string}/jsonrpc`
export type Aria2RpcHTTPUrl =
  | `${'http' | 'https'}://${string}:${number}/jsonrpc`
  | `${'http' | 'https'}://${string}/jsonrpc`

export const createWebSocket = (url: Aria2RpcWebSocketUrl) => {
  if (WebSocket == null) {
    throw new Error('Not Found `WebSocket()` in globalThis or require()')
  }

  return new WebSocket(url) as Socket
}

export const createHTTP = (url: Aria2RpcHTTPUrl) => {
  if (fetch == null) {
    throw new Error('Not Found `fetch()` in globalThis or require()')
  }

  return new (class extends EventTarget {
    readyState: ReadyState = ReadyState.Open

    close(): void {
      this.readyState = ReadyState.Closed
    }

    send(data: string): void {
      fetch(url, {
        method: 'POST',
        body: data,
        headers: new Headers(),
      }).then((v) => {
        if (v.ok) {
          v.text().then((v) =>
            this.dispatchEvent(new MessageEvent('message', { data: v }))
          )
        }
      })
    }
  })() as unknown as Socket
}
