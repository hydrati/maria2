import { WebSocket } from 'isomorphic-ws'
import type { Socket } from './conn'

export const createWebSocket = (url: string) => new WebSocket(url) as Socket
export const createHTTP = (url: string) =>
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
