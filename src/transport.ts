import type { Socket } from './conn'

export type Aria2RpcWebSocketUrl =
  | `${'ws' | 'wss'}://${string}:${number}/jsonrpc`
  | `${'ws' | 'wss'}://${string}/jsonrpc`
export type Aria2RpcHTTPUrl =
  | `${'http' | 'https'}://${string}:${number}/jsonrpc`
  | `${'http' | 'https'}://${string}/jsonrpc`

const _WebSocket = globalThis.WebSocket ?? globalThis?.require?.('ws')
const _fetch = globalThis.fetch ?? globalThis?.require?.('cross-fetch')

export const createWebSocket = (url: Aria2RpcWebSocketUrl) => {
  if (_WebSocket == null) {
    throw new Error('Not Found WebSocket() in globalThis or require()')
  }

  return new _WebSocket(url) as Socket
}

export const createHTTP = (url: Aria2RpcHTTPUrl) => {
  if (_fetch == null) {
    throw new Error('Not Found fetch() in globalThis or require()')
  }

  return new (class extends EventTarget {
    readyState: number = 1
    send(data: string): void {
      _fetch(url, {
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
