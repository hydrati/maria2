import type { OpenOptions, PreconfiguredSocket, Socket } from '../conn.ts'

class PreconfiguredWebSocket
  extends WebSocket
  implements PreconfiguredSocket {
  constructor(
    url: string,
    private readonly __options: Partial<OpenOptions>,
    protocols?: string[] | string,
  ) {
    super(url, protocols)
  }

  getOptions(): Partial<OpenOptions> {
    return this.__options
  }
}

export type Aria2RpcWebSocketUrl =
  | `${'ws' | 'wss'}://${string}:${number}/jsonrpc`
  | `${'ws' | 'wss'}://${string}/jsonrpc`

export function createWebSocket(url: Aria2RpcWebSocketUrl): Socket
export function createWebSocket(
  url: Aria2RpcWebSocketUrl,
  options: Partial<OpenOptions>
): PreconfiguredSocket
export function createWebSocket(
  url: Aria2RpcWebSocketUrl,
  options?: Partial<OpenOptions>,
  protocols?: string[] | string,
): PreconfiguredSocket | Socket {
  return options != null
    ? new PreconfiguredWebSocket(url, options, protocols)
    : new WebSocket(url, protocols)
}
