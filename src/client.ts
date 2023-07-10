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
    ...args: Aria2ClientMethodCallMap[`aria2.${P}`]['params']
  ) => Promise<NonNullable<Aria2ClientMethodResultMap[`aria2.${P}`]['result']>>
}

type ClientAria2TellStatus = {
  tellStatus: <T extends Aria2TellStatusParams>(
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusParamsToResult<T>['result']>>
}

type ClientAria2TellStatusList = {
  tellActive: <T extends Aria2TellActiveParams>(
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusListParamsToResult<T[0]>['result']>>
  tellWaiting: <T extends Aria2TellStatusListParams>(
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusListParamsToResult<T[2]>['result']>>
  tellStopped: <T extends Aria2TellStatusListParams>(
    ...args: T
  ) => Promise<NonNullable<Aria2TellStatusListParamsToResult<T[2]>['result']>>
}

type ClientSystemMulticall = {
  multicall: <T extends Aria2SystemMulticallParams>(
    ...args: T
  ) => Promise<NonNullable<Aria2SystemMulticallParamsToResult<T>['result']>>
}

type ClientSystemCommon = {
  [P in TrimStart<
    Exclude<keyof Aria2SystemMethodCallMap, 'system.multicall'>,
    'system.'
  >]: (
    ...args: Aria2SystemMethodCallMap[`system.${P}`]['params']
  ) => Promise<NonNullable<Aria2SystemMethodResultMap[`system.${P}`]['result']>>
}

export type ClientSystem = ClientSystemCommon & ClientSystemMulticall

export type ClientAria2 = ClientAria2Common &
  ClientAria2TellStatus &
  ClientAria2TellStatusList

export interface Client extends ClientAria2 {
  system: ClientSystem
}
