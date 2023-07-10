export type RpcVersion = '1.0' | '2.0'
export type RpcMessageId = string | number
export type RpcMethod = string | number

export interface RpcMessage {
  jsonrpc: RpcVersion
  id?: RpcMessageId
}

export interface RpcCall<TMethod extends RpcMethod = string, TParam = unknown>
  extends RpcMessage {
  method: TMethod
  params: TParam
}

export interface RpcResultOk<T> extends RpcMessage {
  result: T
}

export interface RpcResultErr<E> extends RpcMessage {
  error: E
}

export type RpcResult<T = unknown, E = unknown> =
  | RpcResultOk<T>
  | RpcResultErr<E>
