import type { Aria2ServerVoidCall } from './utils.ts'
import type { RpcCall, RpcResult } from './jsonrpc.ts'
import type {
  Aria2RpcMethod,
  Aria2RpcMethodCallMap,
  Aria2RpcMethodResultMap,
} from './method.ts'

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
  [P in Aria2RpcMethod]: Aria2SystemMulticallItem<
    P,
    Aria2RpcMethodCallMap[P]['params']
  >
}[keyof Aria2RpcMethodCallMap]

export type Aria2SystemMulticallParams =
  | [Aria2SystemMulticallParamItem]
  | Array<Aria2SystemMulticallParamItem>

export type Aria2SystemMulticallCall = RpcCall<
  'system.multicall',
  Aria2SystemMulticallParams
>

export type Aria2SystemMulticallResult = RpcResult<unknown[]>

export type Aria2SystemMulticallParamsToResult<
  T extends Aria2SystemMulticallParams,
> = RpcResult<{
  [P in keyof T]: [
    NonNullable<Aria2RpcMethodResultMap[T[P]['methodName']]['result']>,
  ]
}>
