import { WebSocket } from 'isomorphic-ws'
import type { Socket } from './conn'

export type Aria2RpcWebSocketUrl =
  | `${'ws' | 'wss'}://${string}:${number}/jsonrpc`
  | `${'ws' | 'wss'}://${string}/jsonrpc`
export type Aria2RpcHTTPUrl =
  | `${'http' | 'https'}://${string}:${number}/jsonrpc`
  | `${'http' | 'https'}://${string}/jsonrpc`

export const createWebSocket = (url: Aria2RpcWebSocketUrl) =>
  new WebSocket(url) as Socket

export const createHTTP = (url: Aria2RpcHTTPUrl) =>
  new (class extends EventTarget {
    readyState: number = 1
    send(data: string): void {
      fetch(url, {
        method: 'POST',
        body: data,
      }).then((v) => {
        if (v.ok) {
          v.text().then((v) =>
            this.dispatchEvent(new MessageEvent('message', { data: v }))
          )
        }
      })
    }
  })() as unknown as Socket
