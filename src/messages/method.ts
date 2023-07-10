import type {
  Aria2ChangeGlobalOptionCall,
  Aria2ChangeGlobalOptionResult,
  Aria2ChangeOptionCall,
  Aria2ChangeOptionResult,
  Aria2GetGlobalOptionCall,
  Aria2GetGlobalOptionResult,
  Aria2GetOptionCall,
  Aria2GetOptionResult,
} from './option'
import type {
  Aria2SystemListMethodsCall,
  Aria2SystemListMethodsResult,
  Aria2SystemListNotificationsCall,
  Aria2SystemListNotificationsResult,
  Aria2SystemMulticallCall,
  Aria2SystemMulticallResult,
} from './system'

export interface Aria2RpcMethodCallMap {
  'aria2.changeOption': Aria2ChangeOptionCall
  'aria2.changeGlobalOption': Aria2ChangeGlobalOptionCall
  'aria2.getGlobalOption': Aria2GetGlobalOptionCall
  'aria2.getOption': Aria2GetOptionCall
  'system.multicall': Aria2SystemMulticallCall
  'system.listMethods': Aria2SystemListMethodsCall
  'system.listNotifications': Aria2SystemListNotificationsCall
}

export interface Aria2RpcMethodResultMap {
  'aria2.changeOption': Aria2ChangeOptionResult
  'aria2.changeGlobalOption': Aria2ChangeGlobalOptionResult
  'aria2.getGlobalOption': Aria2GetGlobalOptionResult
  'aria2.getOption': Aria2GetOptionResult
  'system.multicall': Aria2SystemMulticallResult
  'system.listMethods': Aria2SystemListMethodsResult
  'system.listNotifications': Aria2SystemListNotificationsResult
}
