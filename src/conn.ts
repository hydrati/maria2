import type { Disposable, MaybePromise, TrimStart } from './utils'

export interface ConnRaw {
  send(data: string): MaybePromise<void>
  on(
    type: 'data',
    listener: (data: string) => Promise<void>
  ): MaybePromise<void>
}

export interface Conn {
  sendRequest<T>(method: string, ...args: any[]): MaybePromise<T>
  onNotification(
    type: string,
    listener: (...args: any[]) => void
  ): Disposable<void>
}
