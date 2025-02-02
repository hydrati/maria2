import type {
  OpenOptions,
  PreconfiguredSocket,
  ReadyState,
  Socket,
} from '../conn.ts'

class PseudoSocketImpl extends EventTarget implements PreconfiguredSocket {
  readyState: ReadyState = 1

  constructor(
    private readonly url: string,
    private readonly __options?: Partial<OpenOptions>,
    private readonly __headers: Record<string, string> = {},
  ) {
    super()
  }

  close(): void {
    this.readyState = 3
  }

  getOptions() {
    return this.__options
  }

  addEventListener(...args: any[]): void {
    // @ts-expect-error To impl PreconfiguredSocket type.
    super.addEventListener(...args)
  }

  send(data: string): void {
    fetch(this.url, {
      method: 'POST',
      headers: {
        ...this.__headers,
        'content-type': 'application/json',
      },
      body: data,
    })
      .then(r => r.text())
      .then(data => this.dispatchEvent(new MessageEvent('message', { data })))
  }
}

export type Aria2RpcHTTPUrl =
  | `${'http' | 'https'}://${string}:${number}/jsonrpc`
  | `${'http' | 'https'}://${string}/jsonrpc`

export function createHTTP(url: Aria2RpcHTTPUrl): Socket
export function createHTTP(url: Aria2RpcHTTPUrl, options: Partial<OpenOptions>): PreconfiguredSocket
export function createHTTP(
  url: Aria2RpcHTTPUrl,
  options?: Partial<OpenOptions>,
  headers?: Record<string, string>,
): Socket | PreconfiguredSocket {
  return new PseudoSocketImpl(url, options, headers)
}
