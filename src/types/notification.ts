import type { Aria2DownloadGid } from './download.ts'
import type { RpcCall } from './jsonrpc.ts'

export type Aria2ClientNotificationMethod =
  | 'aria2.onDownloadStart'
  | 'aria2.onDownloadPause'
  | 'aria2.onDownloadStop'
  | 'aria2.onDownloadComplete'
  | 'aria2.onDownloadError'
  | 'aria2.onBtDownloadComplete'

export interface Aria2ClientNotification {
  gid: Aria2DownloadGid
}

export type Aria2ClientNotificationParams = [
  notification: Aria2ClientNotification,
]

export type Aria2ClientNotificationCall = RpcCall<
  Aria2ClientNotificationMethod,
  Aria2ClientNotificationParams
>
