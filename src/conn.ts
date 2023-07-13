import { type Disposable } from './types/disposable.ts'

export interface OpenOptions {
  secret?: string
  onServerError?: (err: any) => void

  /**
   * Timeout for each request (ms).
   * @default 5000
   * @public
   */
  timeout?: number

  /**
   * Timeout for waiting socket (ms).
   * @default 5000
   * @public
   */
  openTimeout?: number
}

/**
 * Ready state of the socket.
 */
export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface PreconfiguredSocket extends Socket {
  getOptions(): Partial<OpenOptions>
}

export interface Socket {
  /**
   * Ready state of the socket.
   * - `0` if the socket is connecting.
   * - `1` if the socket is open.
   * - `2` if the socket is closing.
   * - `3` if the socket is closed.
   * @public
   */
  readyState: ReadyState

  send(data: string): void

  close(code?: number, reason?: string): void

  addEventListener(
    type: 'message',
    listener: (event: { data: any }) => void,
    options?: AddEventListenerOptions
  ): void
  addEventListener(
    type: 'open',
    listener: () => void,
    options?: AddEventListenerOptions
  ): void
  addEventListener(
    type: 'error',
    listener: (error: any) => void,
    options?: AddEventListenerOptions
  ): void
  addEventListener(
    type: 'close',
    listener: () => void,
    options?: AddEventListenerOptions
  ): void
}

export interface SendRequestOptions {
  method: string
  /**
   * Timeout of this request (ms).
   * No timeout if `false`
   * @public
   */
  timeout?: number | boolean
  /**
   * Request with secret.
   * @default true
   * @public
   */
  secret?: boolean
}

export interface Conn {
  sendRequest<T>(options: SendRequestOptions, ...args: any[]): PromiseLike<T>
  onNotification<T extends (...args: unknown[]) => void>(
    type: string,
    listener: T
  ): Disposable<T>

  getSecret(): string | undefined
  getSocket(): Socket
}

export interface Open {
  (socket: Socket | PreconfiguredSocket, options?: OpenOptions): Promise<Conn>
}
