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

export interface RpcResult<T = unknown, E = unknown> extends RpcMessage {
  result?: T
  error?: E
}
