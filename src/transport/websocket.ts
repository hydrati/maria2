import type { OpenOptions, PreconfiguredSocket, Socket } from '../conn.ts'
import { isNodeEnv } from '../shared.ts'

// @ts-ignore
const WebSocket =
  (globalThis as any)?.WebSocket ??
  (isNodeEnv
    ? (await import('ws')).default
    : class {
        constructor() {
          throw new Error(
            '[maria2 error] WebSocket client implementation is missing'
          )
        }
      })

export type Aria2RpcWebSocketUrl =
  | `${'ws' | 'wss'}://${string}:${number}/jsonrpc`
  | `${'ws' | 'wss'}://${string}/jsonrpc`

export interface CreateWebSocket {
  (url: Aria2RpcWebSocketUrl): Socket
  (
    url: Aria2RpcWebSocketUrl,
    options: Partial<OpenOptions>
  ): PreconfiguredSocket
}

export const createWebSocket: CreateWebSocket = (
  url: Aria2RpcWebSocketUrl,
  options?: Partial<OpenOptions>
) => {
  if (WebSocket == null) {
    throw new Error('[maria2 error] WebSocket client implementation is missing')
  }

  return new (class extends WebSocket {
    constructor(url: string) {
      super(url)
    }

    getOptions() {
      return options
    }
  })(url) as any
}
