import { type Disposable } from './utils'

/**
 * Ready state of the socket.
 */
export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
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

export interface Conn {
  sendRequest<T>(
    useSecret: boolean,
    method: string,
    ...args: any[]
  ): PromiseLike<T>
  onNotification<T extends (...args: unknown[]) => void>(
    type: string,
    listener: T
  ): Disposable<T>

  getSecret(): string | undefined
  getSocket(): Socket
}
