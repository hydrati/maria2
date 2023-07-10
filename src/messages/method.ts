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
  Aria2ForceShutdownCall,
  Aria2ForceShutdownResult,
  Aria2GetGlobalStatCall,
  Aria2GetGlobalStatResult,
  Aria2GetSessionInfoCall,
  Aria2GetSessionInfoResult,
  Aria2GetVersionCall,
  Aria2GetVersionResult,
  Aria2SaveSessionCall,
  Aria2SaveSessionResult,
  Aria2ShutdownCall,
  Aria2ShutdownResult,
} from './server'

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
  'aria2.getSessionInfo': Aria2GetSessionInfoCall
  'aria2.shutdown': Aria2ShutdownCall
  'aria2.forceShutdown': Aria2ForceShutdownCall
  'aria2.saveSession': Aria2SaveSessionCall
  'aria2.getGlobalStat': Aria2GetGlobalStatCall
  'aria2.getVersion': Aria2GetVersionCall

  'system.multicall': Aria2SystemMulticallCall
  'system.listMethods': Aria2SystemListMethodsCall
  'system.listNotifications': Aria2SystemListNotificationsCall
}

export interface Aria2RpcMethodResultMap {
  'aria2.changeOption': Aria2ChangeOptionResult
  'aria2.changeGlobalOption': Aria2ChangeGlobalOptionResult
  'aria2.getGlobalOption': Aria2GetGlobalOptionResult
  'aria2.getOption': Aria2GetOptionResult
  'aria2.getSessionInfo': Aria2GetSessionInfoResult
  'aria2.shutdown': Aria2ShutdownResult
  'aria2.forceShutdown': Aria2ForceShutdownResult
  'aria2.saveSession': Aria2SaveSessionResult
  'aria2.getGlobalStat': Aria2GetGlobalStatResult
  'aria2.getVersion': Aria2GetVersionResult

  'system.multicall': Aria2SystemMulticallResult
  'system.listMethods': Aria2SystemListMethodsResult
  'system.listNotifications': Aria2SystemListNotificationsResult
}
