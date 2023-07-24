import type { Aria2DownloadGid } from './download.ts'
import type {
  Aria2ClientGidOpCall,
  Aria2ServerOpResult,
  Aria2ServerVoidCall,
} from './utils.ts'
import type { RpcCall, RpcResult } from './jsonrpc.ts'

export type Aria2ClientInputOptionKey =
  | 'all-proxy'
  | 'all-proxy-passwd'
  | 'all-proxy-user'
  | 'allow-overwrite'
  | 'allow-piece-length-change'
  | 'always-resume'
  | 'async-dns'
  | 'auto-file-renaming'
  | 'bt-enable-hook-after-hash-check'
  | 'bt-enable-lpd'
  | 'bt-exclude-tracker'
  | 'bt-external-ip'
  | 'bt-force-encryption'
  | 'bt-hash-check-seed'
  | 'bt-load-saved-metadata'
  | 'bt-max-peers'
  | 'bt-metadata-only'
  | 'bt-min-crypto-level'
  | 'bt-prioritize-piece'
  | 'bt-remove-unselected-file'
  | 'bt-request-peer-speed-limit'
  | 'bt-require-crypto'
  | 'bt-save-metadata'
  | 'bt-seed-unverified'
  | 'bt-stop-timeout'
  | 'bt-tracker'
  | 'bt-tracker-connect-timeout'
  | 'bt-tracker-interval'
  | 'bt-tracker-timeout'
  | 'check-integrity'
  | 'checksum'
  | 'conditional-get'
  | 'connect-timeout'
  | 'content-disposition-default-utf8'
  | 'continue'
  | 'dir'
  | 'dry-run'
  | 'enable-http-keep-alive'
  | 'enable-http-pipelining'
  | 'enable-mmap'
  | 'enable-peer-exchange'
  | 'file-allocation'
  | 'follow-metalink'
  | 'follow-torrent'
  | 'force-save'
  | 'ftp-passwd'
  | 'ftp-pasv'
  | 'ftp-proxy'
  | 'ftp-proxy-passwd'
  | 'ftp-proxy-user'
  | 'ftp-reuse-connection'
  | 'ftp-type'
  | 'ftp-user'
  | 'gid'
  | 'hash-check-only'
  | 'header'
  | 'http-accept-gzip'
  | 'http-auth-challenge'
  | 'http-no-cache'
  | 'http-passwd'
  | 'http-proxy'
  | 'http-proxy-passwd'
  | 'http-proxy-user'
  | 'http-user'
  | 'https-proxy'
  | 'https-proxy-passwd'
  | 'https-proxy-user'
  | 'index-out'
  | 'lowest-speed-limit'
  | 'max-connection-per-server'
  | 'max-download-limit'
  | 'max-file-not-found'
  | 'max-mmap-limit'
  | 'max-resume-failure-tries'
  | 'max-tries'
  | 'max-upload-limit'
  | 'metalink-base-uri'
  | 'metalink-enable-unique-protocol'
  | 'metalink-language'
  | 'metalink-location'
  | 'metalink-os'
  | 'metalink-preferred-protocol'
  | 'metalink-version'
  | 'min-split-size'
  | 'no-file-allocation-limit'
  | 'no-netrc'
  | 'no-proxy'
  | 'out'
  | 'parameterized-uri'
  | 'pause'
  | 'pause-metadata'
  | 'piece-length'
  | 'proxy-method'
  | 'realtime-chunk-checksum'
  | 'referer'
  | 'remote-time'
  | 'remove-control-file'
  | 'retry-wait'
  | 'reuse-uri'
  | 'rpc-save-upload-metadata'
  | 'seed-ratio'
  | 'seed-time'
  | 'select-file'
  | 'split'
  | 'ssh-host-key-md'
  | 'stream-piece-selector'
  | 'timeout'
  | 'uri-selector'
  | 'use-head'
  | 'user-agent'

export type Aria2ClientGlobalOptionKey =
  | 'bt-max-open-files'
  | 'download-result'
  | 'keep-unfinished-download-result'
  | 'log'
  | 'log-level'
  | 'max-concurrent-downloads'
  | 'max-download-result'
  | 'max-overall-download-limit'
  | 'max-overall-upload-limit'
  | 'optimize-concurrent-downloads'
  | 'save-cookies'
  | 'save-session'
  | 'server-stat-of'
  | Exclude<
      Aria2ClientInputOptionKey,
      'checksum' | 'index-out' | 'out' | 'pause' | 'select-file'
    >

export type Aria2ClientInputOptions = Partial<
  Record<Aria2ClientInputOptionKey, any>
>

export type Aria2ClientGlobalOptions = Partial<
  Record<Aria2ClientGlobalOptionKey, any>
>

export type Aria2ChangeOptionOpResult = string

export type Aria2ChangeOptionParams = [
  gid: Aria2DownloadGid,
  options: Aria2ClientInputOptions,
]

export type Aria2ChangeOptionCall = RpcCall<
  'aria2.changeOption',
  Aria2ChangeOptionParams
>

export type Aria2ChangeOptionResult = Aria2ServerOpResult

export type Aria2ChangeGlobalOptionParams = [options: Aria2ClientGlobalOptions]

export type Aria2ChangeGlobalOptionCall = RpcCall<
  'aria2.changeGlobalOption',
  Aria2ChangeGlobalOptionParams
>

export type Aria2ChangeGlobalOptionResult = Aria2ServerOpResult

export type Aria2GetOptionCall = Aria2ClientGidOpCall<'aria2.getOption'>

export type Aria2GetOptionResult = RpcResult<Aria2ClientInputOptions>

export type Aria2GetGlobalOptionCall =
  Aria2ServerVoidCall<'aria2.getGlobalOption'>

export type Aria2GetGlobalOptionResult = RpcResult<Aria2ClientGlobalOptions>
