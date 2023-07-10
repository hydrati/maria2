import type {
  Aria2ClientNotificationParams,
  Aria2ClientNotificationMethod,
} from './types/notification'
import type { Conn } from './conn'
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
import type { Disposable, TrimStart } from './utils'

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

type ClientAria2Notification = {
  [P in TrimStart<Aria2ClientNotificationMethod, 'aria2.'>]: <
    T extends (...args: Aria2ClientNotificationParams) => void,
  >(
    conn: Conn,
    listener: T
  ) => Disposable<T>
} & {
  when: <T extends (...args: Aria2ClientNotificationParams) => void>(
    conn: Conn,
    method: Aria2ClientNotificationMethod,
    listener: T
  ) => Disposable<T>
}

export type ClientSystem = ClientSystemCommon & ClientSystemMulticall

export type ClientAria2 = ClientAria2Common &
  ClientAria2TellStatus &
  ClientAria2TellStatusList &
  ClientAria2Notification
