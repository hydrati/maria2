import type { Aria2ClientGid } from './client'
import type { RpcCall } from './jsonrpc'

export type Aria2ClientNotificationMethod =
  | 'aria2.onDownloadStart'
  | 'aria2.onDownloadPause'
  | 'aria2.onDownloadStop'
  | 'aria2.onDownloadComplete'
  | 'aria2.onDownloadError'
  | 'aria2.onBtDownloadComplete'

export interface Aria2ClientNotificationParams {
  gid: Aria2ClientGid
}

export type Aria2ClientNotificationCall = RpcCall<
  Aria2ClientNotificationMethod,
  Aria2ClientNotificationParams
>
