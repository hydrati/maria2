import { ReadyState, type Socket } from './conn.ts'
import { WebSocket, createPost } from './utils.ts'

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
  return new (class extends EventTarget {
    readyState: ReadyState = ReadyState.Open

    close(): void {
      this.readyState = ReadyState.Closed
    }

    send(data: string): void {
      createPost(url, data).then((data0: string) => {
        this.dispatchEvent(new MessageEvent('message', { data: data0 }))
      })
    }
  })() as unknown as Socket
}
