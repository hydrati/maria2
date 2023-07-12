import type { Aria2DownloadGid } from './download.ts'
import type { RpcCall, RpcResult } from './jsonrpc.ts'
import type { Aria2RpcMethod } from './method.ts'

export interface Aria2StringUtf8 {
  'utf-8': string
}

export type Aria2ServerOpResultOk = 'OK'

export type Aria2ServerOpResult = RpcResult<Aria2ServerOpResultOk>

export type Aria2ClientGidOpParams = [gid: Aria2DownloadGid]
export type Aria2ClientGidOpCall<T extends Aria2RpcMethod> = RpcCall<
  T,
  Aria2ClientGidOpParams
>

export type Aria2ServerVoidCall<T extends Aria2RpcMethod> = RpcCall<T, []>
