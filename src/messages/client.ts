import type { RpcCall, RpcResult } from './jsonrpc'

export type Aria2RpcMethod = Aria2ServerMethod | Aria2SystemMethod

export type Aria2ServerMethod =
  | 'aria2.addUri'
  | 'aria2.addTorrent'
  | 'aria2.getPeers'
  | 'aria2.addMetalink'
  | 'aria2.remove'
  | 'aria2.pause'
  | 'aria2.forcePause'
  | 'aria2.pauseAll'
  | 'aria2.forcePauseAll'
  | 'aria2.unpause'
  | 'aria2.unpauseAll'
  | 'aria2.forceRemove'
  | 'aria2.changePosition'
  | 'aria2.tellStatus'
  | 'aria2.getUris'
  | 'aria2.getFiles'
  | 'aria2.getServers'
  | 'aria2.tellActive'
  | 'aria2.tellWaiting'
  | 'aria2.tellStopped'
  | 'aria2.getOption'
  | 'aria2.changeUri'
  | 'aria2.changeOption'
  | 'aria2.getGlobalOption'
  | 'aria2.changeGlobalOption'
  | 'aria2.purgeDownloadResult'
  | 'aria2.removeDownloadResult'
  | 'aria2.getVersion'
  | 'aria2.getSessionInfo'
  | 'aria2.shutdown'
  | 'aria2.forceShutdown'
  | 'aria2.getGlobalStat'
  | 'aria2.saveSession'

export type Aria2SystemMethod =
  | 'system.multicall'
  | 'system.listMethods'
  | 'system.listNotifications'

export type Aria2ClientGid = string

export type Aria2ServerOpResultOk = string

export type Aria2ServerOpResult<E = unknown> = RpcResult<
  Aria2ServerOpResultOk,
  E
>

export type Aria2ClientGidOpParams = [gid: Aria2ClientGid]
export type Aria2ClientGidOpCall<T extends Aria2RpcMethod> = RpcCall<
  T,
  Aria2ClientGidOpParams
>

export type Aria2ServerVoidCall<T extends Aria2RpcMethod> = RpcCall<T, []>
