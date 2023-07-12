import type { Socket } from '../conn'
import { isNodeEnv } from '../shared'

// @ts-ignore
const WebSocket =
  (globalThis as any)?.WebSocket ??
  (isNodeEnv
    ? (await import('ws')).default
    : class {
        constructor() {
          throw new Error('Not found any http client implementation.')
        }
      })

export type Aria2RpcWebSocketUrl =
  | `${'ws' | 'wss'}://${string}:${number}/jsonrpc`
  | `${'ws' | 'wss'}://${string}/jsonrpc`

export const createWebSocket = (url: Aria2RpcWebSocketUrl) => {
  if (WebSocket == null) {
    throw new Error('Not Found `WebSocket()` in globalThis or require()')
  }

  return new WebSocket(url) as Socket
}
