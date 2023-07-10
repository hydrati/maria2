import type { Aria2DownloadGid } from './download'
import type { RpcCall, RpcResult } from './jsonrpc'
import type { Aria2RpcMethod } from './method'

export interface Aria2StringUtf8 {
  'utf-8': string
}

export type Aria2ServerOpResultOk = 'OK'

export type Aria2ServerOpResult<E = unknown> = RpcResult<
  Aria2ServerOpResultOk,
  E
>

export type Aria2ClientGidOpParams = [gid: Aria2DownloadGid]
export type Aria2ClientGidOpCall<T extends Aria2RpcMethod> = RpcCall<
  T,
  Aria2ClientGidOpParams
>

export type Aria2ServerVoidCall<T extends Aria2RpcMethod> = RpcCall<T, []>
