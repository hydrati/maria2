import { Conn } from './conn'
import type {
  Aria2TellActiveParams,
  Aria2TellStatusListParams,
  Aria2TellStatusListParamsToResult,
  Aria2TellStatusParams,
  Aria2TellStatusParamsToResult,
} from './types/download'
import type {
  Aria2ClientMethodCallMap,
  Aria2ClientMethodResultMap,
  Aria2SystemMethodCallMap,
  Aria2SystemMethodResultMap,
} from './types/method'
import type {
  Aria2SystemMulticallParams,
  Aria2SystemMulticallParamsToResult,
} from './types/system'
import type { TrimStart } from './utils'

type ClientAria2Common = {
  [P in TrimStart<
    Exclude<
      keyof Aria2ClientMethodCallMap,
      | 'aria2.tellStatus'
      | 'aria2.tellWaiting'
      | 'aria2.tellStopped'
      | 'aria2.tellActive'
    >,
    'aria2.'
  >]: (
    conn: Conn,
    ...args: Aria2ClientMethodCallMap[`aria2.${P}`]['params']
  ) => Promise<NonNullable<Aria2ClientMethodResultMap[`aria2.${P}`]['result']>>
}

type ClientAria2TellStatus = {
  tellStatus: <T extends Aria2TellStatusParams>(
    conn: Conn,
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusParamsToResult<T>['result']>>
}

type ClientAria2TellStatusList = {
  tellActive: <T extends Aria2TellActiveParams>(
    conn: Conn,
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusListParamsToResult<T[0]>['result']>>
  tellWaiting: <T extends Aria2TellStatusListParams>(
    conn: Conn,
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusListParamsToResult<T[2]>['result']>>
  tellStopped: <T extends Aria2TellStatusListParams>(
    conn: Conn,
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusListParamsToResult<T[2]>['result']>>
}

type ClientSystemMulticall = {
  multicall: <T extends Aria2SystemMulticallParams>(
    conn: Conn,
    ...args: T
  ) => Promise<NonNullable<Aria2SystemMulticallParamsToResult<T>['result']>>
}

type ClientSystemCommon = {
  [P in TrimStart<
    Exclude<keyof Aria2SystemMethodCallMap, 'system.multicall'>,
    'system.'
  >]: (
    conn: Conn,
    ...args: Aria2SystemMethodCallMap[`system.${P}`]['params']
  ) => Promise<NonNullable<Aria2SystemMethodResultMap[`system.${P}`]['result']>>
}

export type ClientSystem = ClientSystemCommon & ClientSystemMulticall

export type ClientAria2 = ClientAria2Common &
  ClientAria2TellStatus &
  ClientAria2TellStatusList

export const system = Object.freeze(
  ['system.multicall', 'system.listMethods', 'system.listNotifications'].reduce(
    (o, k) => {
      o[k.slice(7)] = (conn: Conn, ...args: unknown[]) =>
        conn.sendRequest(k, ...args)
      return o
    },
    Object.create(null)
  )
) as Readonly<ClientSystem>

export const aria2 = Object.freeze(
  [
    'aria2.changeOption',
    'aria2.changeGlobalOption',
    'aria2.getGlobalOption',
    'aria2.getOption',
    'aria2.getSessionInfo',
    'aria2.shutdown',
    'aria2.forceShutdown',
    'aria2.saveSession',
    'aria2.getGlobalStat',
    'aria2.getVersion',
    'aria2.purgeDownloadResult',
    'aria2.removeDownloadResult',
    'aria2.changeUri',
    'aria2.changePosition',
    'aria2.getPeers',
    'aria2.getFiles',
    'aria2.getUris',
    'aria2.getServers',
    'aria2.tellStatus',
    'aria2.tellWaiting',
    'aria2.tellStopped',
    'aria2.tellActive',
    'aria2.remove',
    'aria2.forceRemove',
    'aria2.pause',
    'aria2.forcePause',
    'aria2.unpause',
    'aria2.unpauseAll',
    'aria2.pauseAll',
    'aria2.forcePauseAll',
    'aria2.addMetalink',
    'aria2.addTorrent',
    'aria2.addUri',
  ].reduce((o, k) => {
    o[k.slice(6)] = (conn: Conn, ...args: unknown[]) =>
      conn.sendRequest(k, ...args)
    return o
  }, Object.create(null))
) as Readonly<ClientAria2>
