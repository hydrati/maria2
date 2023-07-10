import type { Aria2ServerVoidCall } from './client'
import type { RpcCall, RpcResult } from './jsonrpc'
import type { Aria2RpcMethodCallMap } from './method'

export type Aria2SystemListNotificationsCall =
  Aria2ServerVoidCall<'system.listNotifications'>

export type Aria2SystemListNotificationsResult = RpcResult<string[]>

export type Aria2SystemListMethodsCall =
  Aria2ServerVoidCall<'system.listMethods'>

export type Aria2SystemListMethodsResult = RpcResult<string[]>

export type Aria2SystemMulticallItem<T extends string, TParams> = {
  methodName: T
  params: TParams
}

export type Aria2SystemMulticallParamItem = {
  [P in keyof Aria2RpcMethodCallMap]: Aria2SystemMulticallItem<
    P,
    Aria2RpcMethodCallMap[P]['params']
  >
}[keyof Aria2RpcMethodCallMap]

export type Aria2SystemMulticallParams = Array<Aria2SystemMulticallParamItem>

export type Aria2SystemMulticallCall = RpcCall<
  'system.multicall',
  Aria2SystemMulticallParams
>

export type Aria2SystemMulticallResult = RpcResult<unknown[]>
