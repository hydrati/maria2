import { type Disposable } from './utils'
export interface Socket {
  /**
   * Ready state of the socket.
   * - `0` if the socket is connecting.
   * - `1` if the socket is open.
   * - `2` if the socket is closing or closed.
   * @public
   */
  readyState: number

  send(data: string): void

  addEventListener(
    type: 'message',
    listener: (event: { data: any }) => void
  ): void
  addEventListener(
    type: 'open',
    listener: () => void,
    options?: { once: boolean }
  ): void
}

export interface Conn {
  sendRequest<T>(method: string, ...args: any[]): PromiseLike<T>
  onNotification<T extends (...args: unknown[]) => void>(
    type: string,
    listener: T
  ): Disposable<T>
}
