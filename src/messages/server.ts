import type { Aria2ServerOpResult, Aria2ServerVoidCall } from './utils'
import type { RpcResult } from './jsonrpc'

export interface Aria2ServerVersion {
  /**
   * List of enabled features. Each feature is given as a string.
   * @public
   */
  enabledFeatures: string[]

  /**
   * Version number of aria2 as a string.
   * @public
   */
  version: string
}

export type Aria2GetVersionCall = Aria2ServerVoidCall<'aria2.getVersion'>

export type Aria2GetVersionResult = RpcResult<Aria2ServerVersion>

export interface Aria2ServerGlobalStat {
  /**
   * Overall download speed (byte/sec).
   *
   * This number can be too large, you should parse with `BigInt`.
   * @public
   */
  downloadSpeed: string

  /**
   * Overall upload speed (byte/sec).
   *
   * This number can be too large, you should parse with `BigInt`.
   * @public
   */
  uploadSpeed: string

  /**
   * The number of active downloads.
   * @public
   */
  numActive: string
  /**
   * The number of waiting downloads.
   * @public
   */
  numWaiting: string
  /**
   * The number of stopped downloads in the current session.
   * This value is capped by the `--max-download-result` option.
   * @public
   */
  numStopped: string

  /**
   * The number of stopped downloads in the current session and not capped by the `--max-download-result` option.
   * @public
   */
  numStoppedTotal: string
}

export type Aria2GetGlobalStatCall = Aria2ServerVoidCall<'aria2.getGlobalStat'>

export type Aria2GetGlobalStatResult = RpcResult<Aria2ServerGlobalStat>

export interface Aria2ServerSessionInfo {
  /**
   * Session ID, which is generated each time when aria2 is invoked.
   * @public
   */
  sessionId: string
}

export type Aria2GetSessionInfoCall =
  Aria2ServerVoidCall<'aria2.getSessionInfo'>

export type Aria2GetSessionInfoResult = RpcResult<Aria2ServerSessionInfo>

export type Aria2ShutdownCall = Aria2ServerVoidCall<'aria2.shutdown'>

export type Aria2ShutdownResult = Aria2ServerOpResult

export type Aria2ForceShutdownCall = Aria2ServerVoidCall<'aria2.forceShutdown'>

export type Aria2ForceShutdownResult = Aria2ServerOpResult

export type Aria2SaveSessionCall = Aria2ServerVoidCall<'aria2.saveSession'>

export type Aria2SaveSessionResult = Aria2ServerOpResult
