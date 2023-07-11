import type { RpcCall, RpcResult } from './jsonrpc'
import { Aria2ClientInputOptions } from './option'
import type {
  Aria2StringUtf8,
  Aria2ClientGidOpCall,
  Aria2ServerOpResult,
  Aria2ServerVoidCall,
} from './utils'

export type Aria2DownloadGid = string

export type Aria2PurgeDownloadResultCall =
  Aria2ServerVoidCall<'aria2.purgeDownloadResult'>

export type Aria2PurgeDownloadResultResult = Aria2ServerOpResult

export type Aria2RemoveDownloadResultCall =
  Aria2ClientGidOpCall<'aria2.removeDownloadResult'>

export type Aria2RemoveDownloadResultResult = Aria2ServerOpResult

export type Aria2ChangeUriParams = [
  gid: Aria2DownloadGid,
  fileIndex: number,
  delUris: string[],
  addUris: string[],
  position: number,
]

export type Aria2ChangeUriCall = RpcCall<
  'aria2.changeUri',
  Aria2ChangeUriParams
>

export type Aria2ChangeUriResultOk = [deleted: number, added: number]

export type Aria2ChangeUriResult = RpcResult<Aria2ChangeUriResultOk>

export type Aria2PositionHow = 'POS_CUR' | 'POS_SET' | 'POS_END'

export type Aria2ChangePositionParams = [
  gid: Aria2DownloadGid,
  pos: number,
  how: Aria2PositionHow,
]

export type Aria2ChangePositionCall = RpcCall<
  'aria2.changePosition',
  Aria2ChangePositionParams
>

export type Aria2ChangePositionResultOk = number

export type Aria2ChangePositionResult = RpcResult<Aria2ChangePositionResultOk>

export type Aria2UriStatusString = 'waiting' | 'used'

export interface Aria2UriStatus {
  /**
   * `used` if the URI is in use. `waiting` if the URI is still waiting in the queue.
   * @public
   */
  status: Aria2UriStatusString

  /**
   * URI.
   * @public
   */
  uri: string
}

export type Aria2GetUrisCall = Aria2ClientGidOpCall<'aria2.getUris'>

export type Aria2GetUrisResult = RpcResult<Aria2UriStatus[]>

export type Aria2DownloadBitTorrentMode = 'single' | 'multi'

export interface Aria2FileStatus {
  /**
   * Index of the file, starting at 1, in the same order as files appear in the multi-file torrent.
   * @public
   */
  index: number

  /**
   * File path.
   * @public
   */
  path: string

  /**
   * File size in bytes.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  length: string

  /**
   * Completed length of this file in bytes.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * Please note that it is possible that sum of `completedLength` is less than the `completedLength` returned by the `aria2.tellStatus()` method.
   *
   * This is because completedLength in `aria2.getFiles()` only includes completed pieces.
   * On the other hand, completedLength in `aria2.tellStatus()` also includes partially completed pieces.
   * @public
   */
  completedLength: string

  /**
   * `"true"` if this file is selected by `--select-file` option.
   * If `--select-file` is not specified or this is single-file torrent or not a torrent download at all, this value is always `"true"`. Otherwise `"false"`.
   * @public
   */
  selected: 'true' | 'false'

  /**
   * Returns a list of URIs for this file.
   * The element type is the same struct used in the `aria2.getUris()` method.
   * @public
   */
  uris: Aria2UriStatus[]
}

export type Aria2FilesStatus = Aria2FileStatus[]

export type Aria2GetFilesCall = Aria2ClientGidOpCall<'aria2.getFiles'>

export type Aria2GetFilesResult = RpcResult<Aria2FileStatus>

export interface Aria2DownloadBitTorrentInfo {
  /**
   * name in info dictionary. `name.utf-8` is used if available.
   * @public
   */
  name: string | Aria2StringUtf8
}

export interface Aria2DownloadBitTorrentStatus {
  /**
   * List of lists of announce URIs. If the torrent contains `announce` and no `announce-list`, `announce` is converted to the `announce-list` format.
   * @public
   */
  announceList: string[]

  /**
   * The comment of the torrent. `comment.utf-8` is used if available.
   * @public
   */
  comment: string | Aria2StringUtf8

  /**
   * The creation time of the torrent. The value is an integer since the epoch, measured in seconds.
   * @public
   */
  creationDate: number

  /**
   * File mode of the torrent. The value is either `single` or `multi`.
   * @public
   */
  mode: Aria2DownloadBitTorrentMode

  /**
   * Struct which contains data from Info dictionary.
   * @public
   */
  info: Aria2DownloadBitTorrentInfo
}

export interface Aria2PeerInfo {
  /**
   * `"true"` if aria2 is choking the peer. Otherwise `"false"`.
   * @public
   */
  amChoking: 'true' | 'false'

  /**
   * Hexadecimal representation of the download progress of the peer.
   * The highest bit corresponds to the piece at index 0.
   * Set bits indicate the piece is available and unset bits indicate the piece is missing.
   * Any spare bits at the end are set to zero.
   * @public
   */
  bitfield: string

  /**
   * Download speed (byte/sec) that this client obtains from the peer.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  downloadSpeed: string

  /**
   * IP address of the peer.
   * @public
   */
  ip: string

  /** `
   * "true"` if the peer is choking aria2. Otherwise `"false"`.
   * @public
   */
  peerChoking: 'true' | 'false'

  /**
   * Percent-encoded peer ID.
   * @public
   */
  peerId: string

  /**
   * Port number of the peer.
   * @public
   */
  port: string

  /**
   * `"true"` if this peer is a seeder. Otherwise `"false"`.
   * @public
   */
  seeder: 'true' | 'false'

  /**
   * Upload speed(byte/sec) that this client uploads to the peer.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  uploadSpeed: string
}

export type Aria2PeersInfo = Aria2PeerInfo[]

export type Aria2GetPeersCall = Aria2ClientGidOpCall<'aria2.getPeers'>

export type Aria2GetPeersResult = RpcResult<Aria2PeersInfo>

export interface Aria2ServerInfo {
  /**
   * Original URI.
   * @public
   */
  uri: string

  /**
   * This is the URI currently used for downloading.
   * If redirection is involved, currentUri and uri may differ.
   *
   * @public
   */
  currentUri: string
  /**
   * Download speed (byte/sec).
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  downloadSpeed: string
}

export interface Aria2ServersInfoItem {
  /**
   * Index of the file, starting at 1, in the same order as files appear in the multi-file metalink.
   * @public
   */
  index: string

  /**
   * A list of structs.
   * @public
   */
  servers: Aria2ServerInfo[]
}

export type Aria2ServersInfo = Aria2ServersInfoItem[]

export type Aria2GetServersCall = Aria2ClientGidOpCall<'aria2.getServers'>

export type Aria2GetServersResult = RpcResult<Aria2ServersInfo>

export type Aria2DownloadState =
  | 'active'
  | 'waiting'
  | 'paused'
  | 'error'
  | 'complete'
  | 'removed'

export interface Aria2DownloadStatus {
  /**
   * GID of the download.
   * @public
   */
  gid: Aria2DownloadGid

  /**
   * - `active` for currently downloading/seeding downloads.
   * - `waiting` for downloads in the queue; download is not started.
   * - `paused` for paused downloads.
   * - `error` for downloads that were stopped because of error.
   * - `complete` for stopped and completed downloads.
   * - `removed` for the downloads removed by user.
   * @public
   */
  status: Aria2DownloadState

  /**
   * Total length of the download in bytes.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  totalLength: string

  /**
   * Completed length of the download in bytes.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  completedLength: string

  /**
   * Uploaded length of the download in bytes.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  uploadLength: string

  /**
   * Hexadecimal representation of the download progress.
   * The highest bit corresponds to the piece at index 0.
   * Any set bits indicate loaded pieces, while unset bits indicate not yet loaded and/or missing pieces.
   * Any overflow bits at the end are set to zero.
   * When the download was not started yet, this key will not be included in the response. */
  bitfield: string

  /**
   * Download speed of this download measured in bytes/sec.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  downloadSpeed: string

  /**
   * Upload speed of this download measured in bytes/sec.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  uploadSpeed: string

  /**
   * InfoHash. BitTorrent only.
   * @public
   * */
  infoHash?: string

  /**
   * The number of seeders aria2 has connected to. BitTorrent only.
   * @public
   */
  numSeeders?: string

  /**
   * `true` if the local endpoint is a seeder. Otherwise `false`. BitTorrent only.
   * @public
   */
  seeder?: 'true' | 'false'

  /** Piece length in bytes.
   *
   * This number can be too large, you should parse with `BigInt`.
   *
   * @public
   */
  pieceLength: string

  /**
   * The number of pieces.
   * @public
   */
  numPieces: string

  /**
   * The number of peers/servers aria2 has connected to.
   * @public
   */
  connections: string

  /**
   * The code of the last error for this item, if any.
   * The value is a string.
   * The error codes are defined in the [EXIT STATUS](https://aria2.github.io/manual/en/html/aria2c.html#id1) section.
   * This value is only available for stopped/completed downloads.
   * @public
   */
  errorCode?: string

  /**
   * The (hopefully) human readable error message associated to `errorCode`.
   * @public
   */
  errorMessage?: string

  /**
   * List of GIDs which are generated as the result of this download.
   * For example, when aria2 downloads a Metalink file, it generates downloads described in the Metalink (see the `--follow-metalink` option).
   * This value is useful to track auto-generated downloads.
   * If there are no such downloads, this key will not be included in the response.
   * @public
   */
  followedBy?: Aria2DownloadGid[]
  /**
   * The reverse link for `followedBy`.
   * A download included in `followedBy` has this object's GID in its `following` value.
   * @public
   */
  following?: Aria2DownloadGid

  /**
   * GID of a parent download.
   * Some downloads are a part of another download.
   * For example, if a file in a Metalink has BitTorrent resources, the downloads of ".torrent" files are parts of that parent.
   * If this download has no parent, this key will not be included in the response.
   * @public
   */
  belongsTo?: Aria2DownloadGid

  /**
   * Directory to save files.
   * @public
   */
  dir: string

  /**
   * Returns the list of files.
   * The elements of this list are the same structs used in `aria2.getFiles()` method.
   * @public
   */
  files: Aria2FileStatus[]

  /**
   * Struct which contains information retrieved from the .torrent (file). BitTorrent only.
   * @public
   */
  bittorrent?: Aria2DownloadBitTorrentStatus
}

export type Aria2TellStatusParams = [
  gid: Aria2DownloadGid,
  keys?: [keyof Aria2DownloadStatus] | (keyof Aria2DownloadStatus)[],
]

export type Aria2TellStatusCall = RpcCall<
  'aria2.tellStatus',
  Aria2TellStatusParams
>

export type Aria2TellStatusResult = RpcResult<Partial<Aria2DownloadStatus>>

export type Aria2TellStatusParamsToResult<T extends Aria2TellStatusParams> =
  RpcResult<
    T[1] extends void
      ? Aria2DownloadStatus
      : NonNullable<T[1]> extends
          | [keyof Aria2DownloadStatus]
          | (keyof Aria2DownloadStatus)[]
      ? Pick<Aria2DownloadStatus, NonNullable<T[1]>[number]>
      : Aria2DownloadStatus
  >

export type Aria2TellStatusListParamsToResult<
  T extends
    | [keyof Aria2DownloadStatus]
    | (keyof Aria2DownloadStatus)[]
    | undefined,
> = RpcResult<
  Array<
    T extends void
      ? Aria2DownloadStatus
      : NonNullable<T> extends
          | [keyof Aria2DownloadStatus]
          | (keyof Aria2DownloadStatus)[]
      ? Pick<Aria2DownloadStatus, NonNullable<T>[number]>
      : Aria2DownloadStatus
  >
>

export type Aria2TellStatusListParams = [
  offset: number,
  num: number,
  keys?: [keyof Aria2DownloadStatus] | (keyof Aria2DownloadStatus)[],
]

export type Aria2TellWaitingCall = RpcCall<
  'aria2.tellWaiting',
  Aria2TellStatusListParams
>

export type Aria2TellWaitingResult = RpcResult<Partial<Aria2DownloadStatus>[]>

export type Aria2TellStoppedCall = RpcCall<
  'aria2.tellStopped',
  Aria2TellStatusListParams
>

export type Aria2TellStoppedResult = RpcResult<Partial<Aria2DownloadStatus>[]>

export type Aria2TellActiveParams = [
  keys?: [keyof Aria2DownloadStatus] | (keyof Aria2DownloadStatus)[],
]

export type Aria2TellActiveCall = RpcCall<
  'aria2.tellActive',
  Aria2TellStatusParams
>

export type Aria2TellActiveResult = RpcResult<Partial<Aria2DownloadStatus>[]>

export type Aria2RemoveCall = Aria2ClientGidOpCall<'aria2.remove'>

export type Aria2RemoveResult = RpcResult<Aria2DownloadGid>

export type Aria2ForceRemoveCall = Aria2ClientGidOpCall<'aria2.forceRemove'>

export type Aria2ForceRemoveResult = RpcResult<Aria2DownloadGid>

export type Aria2PauseCall = Aria2ClientGidOpCall<'aria2.pause'>

export type Aria2PauseResult = RpcResult<Aria2DownloadGid>

export type Aria2ForcePauseCall = Aria2ClientGidOpCall<'aria2.forcePause'>

export type Aria2ForcePauseResult = RpcResult<Aria2DownloadGid>

export type Aria2UnpauseCall = Aria2ClientGidOpCall<'aria2.unpause'>

export type Aria2UnpauseResult = RpcResult<Aria2DownloadGid>

export type Aria2PauseAllCall = Aria2ClientGidOpCall<'aria2.pauseAll'>

export type Aria2PauseAllResult = Aria2ServerOpResult

export type Aria2ForcePauseAllCall = Aria2ClientGidOpCall<'aria2.forcePauseAll'>

export type Aria2ForcePauseAllResult = Aria2ServerOpResult

export type Aria2UnpauseAllCall = Aria2ClientGidOpCall<'aria2.unpauseAll'>

export type Aria2UnpauseAllResult = Aria2ServerOpResult

export type Aria2AddMetalinkParams = [
  metalink: string,
  options?: Aria2ClientInputOptions,
  position?: number,
]

export type Aria2AddMetalinkCall = RpcCall<
  'aria2.addMetalink',
  Aria2AddMetalinkParams
>

export type Aria2AddMetalinkResult = RpcResult<Aria2DownloadGid>

export type Aria2AddTorrentParams = [
  torrent: string,
  uris?: string[],
  options?: Aria2ClientInputOptions,
  position?: number,
]

export type Aria2AddTorrentCall = RpcCall<
  'aria2.addTorrent',
  Aria2AddTorrentParams
>

export type Aria2AddTorrentResult = RpcResult<Aria2DownloadGid>

export type Aria2AddUriParams = [
  uris: string[],
  options?: Aria2ClientInputOptions,
  position?: number,
]

export type Aria2AddUriCall = RpcCall<'aria2.addUri', Aria2AddUriParams>

export type Aria2AddUriResult = RpcResult<Aria2DownloadGid>
