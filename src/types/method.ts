import type {
  Aria2AddMetalinkCall,
  Aria2AddMetalinkResult,
  Aria2AddTorrentCall,
  Aria2AddTorrentResult,
  Aria2AddUriCall,
  Aria2AddUriResult,
  Aria2ChangePositionCall,
  Aria2ChangePositionResult,
  Aria2ChangeUriCall,
  Aria2ChangeUriResult,
  Aria2ForcePauseAllCall,
  Aria2ForcePauseAllResult,
  Aria2ForcePauseCall,
  Aria2ForcePauseResult,
  Aria2ForceRemoveCall,
  Aria2ForceRemoveResult,
  Aria2GetFilesCall,
  Aria2GetFilesResult,
  Aria2GetPeersCall,
  Aria2GetPeersResult,
  Aria2GetServersCall,
  Aria2GetServersResult,
  Aria2GetUrisCall,
  Aria2GetUrisResult,
  Aria2PauseAllCall,
  Aria2PauseAllResult,
  Aria2PauseCall,
  Aria2PauseResult,
  Aria2PurgeDownloadResultCall,
  Aria2PurgeDownloadResultResult,
  Aria2RemoveCall,
  Aria2RemoveDownloadResultCall,
  Aria2RemoveDownloadResultResult,
  Aria2RemoveResult,
  Aria2TellActiveCall,
  Aria2TellActiveResult,
  Aria2TellStatusCall,
  Aria2TellStatusResult,
  Aria2TellStoppedCall,
  Aria2TellStoppedResult,
  Aria2TellWaitingCall,
  Aria2TellWaitingResult,
  Aria2UnpauseAllCall,
  Aria2UnpauseAllResult,
  Aria2UnpauseCall,
  Aria2UnpauseResult,
} from './download.ts'

import type {
  Aria2ChangeGlobalOptionCall,
  Aria2ChangeGlobalOptionResult,
  Aria2ChangeOptionCall,
  Aria2ChangeOptionResult,
  Aria2GetGlobalOptionCall,
  Aria2GetGlobalOptionResult,
  Aria2GetOptionCall,
  Aria2GetOptionResult,
} from './option.ts'

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
} from './server.ts'

import type {
  Aria2SystemListMethodsCall,
  Aria2SystemListMethodsResult,
  Aria2SystemListNotificationsCall,
  Aria2SystemListNotificationsResult,
  Aria2SystemMulticallCall,
  Aria2SystemMulticallResult,
} from './system.ts'

export type Aria2RpcMethodCallMap = Aria2ClientMethodCallMap &
  Aria2SystemMethodCallMap

export interface Aria2ClientMethodCallMap {
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
  'aria2.purgeDownloadResult': Aria2PurgeDownloadResultCall
  'aria2.removeDownloadResult': Aria2RemoveDownloadResultCall
  'aria2.changeUri': Aria2ChangeUriCall
  'aria2.changePosition': Aria2ChangePositionCall
  'aria2.getPeers': Aria2GetPeersCall
  'aria2.getFiles': Aria2GetFilesCall
  'aria2.getUris': Aria2GetUrisCall
  'aria2.getServers': Aria2GetServersCall

  'aria2.tellStatus': Aria2TellStatusCall
  'aria2.tellWaiting': Aria2TellWaitingCall
  'aria2.tellStopped': Aria2TellStoppedCall
  'aria2.tellActive': Aria2TellActiveCall

  'aria2.remove': Aria2RemoveCall
  'aria2.forceRemove': Aria2ForceRemoveCall
  'aria2.pause': Aria2PauseCall
  'aria2.forcePause': Aria2ForcePauseCall
  'aria2.unpause': Aria2UnpauseCall
  'aria2.unpauseAll': Aria2UnpauseAllCall
  'aria2.pauseAll': Aria2PauseAllCall
  'aria2.forcePauseAll': Aria2ForcePauseAllCall
  'aria2.addMetalink': Aria2AddMetalinkCall
  'aria2.addTorrent': Aria2AddTorrentCall
  'aria2.addUri': Aria2AddUriCall
}

export interface Aria2SystemMethodCallMap {
  'system.multicall': Aria2SystemMulticallCall
  'system.listMethods': Aria2SystemListMethodsCall
  'system.listNotifications': Aria2SystemListNotificationsCall
}

export type Aria2RpcMethodResultMap = Aria2SystemMethodResultMap &
  Aria2ClientMethodResultMap

export interface Aria2SystemMethodResultMap {
  'system.multicall': Aria2SystemMulticallResult
  'system.listMethods': Aria2SystemListMethodsResult
  'system.listNotifications': Aria2SystemListNotificationsResult
}

export interface Aria2ClientMethodResultMap {
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
  'aria2.purgeDownloadResult': Aria2PurgeDownloadResultResult
  'aria2.removeDownloadResult': Aria2RemoveDownloadResultResult
  'aria2.changeUri': Aria2ChangeUriResult
  'aria2.changePosition': Aria2ChangePositionResult
  'aria2.getPeers': Aria2GetPeersResult
  'aria2.getFiles': Aria2GetFilesResult
  'aria2.getUris': Aria2GetUrisResult
  'aria2.getServers': Aria2GetServersResult
  'aria2.tellStatus': Aria2TellStatusResult
  'aria2.tellWaiting': Aria2TellWaitingResult
  'aria2.tellStopped': Aria2TellStoppedResult
  'aria2.tellActive': Aria2TellActiveResult
  'aria2.remove': Aria2RemoveResult
  'aria2.forceRemove': Aria2ForceRemoveResult
  'aria2.pause': Aria2PauseResult
  'aria2.forcePause': Aria2ForcePauseResult
  'aria2.unpause': Aria2UnpauseResult
  'aria2.unpauseAll': Aria2UnpauseAllResult
  'aria2.pauseAll': Aria2PauseAllResult
  'aria2.forcePauseAll': Aria2ForcePauseAllResult
  'aria2.addMetalink': Aria2AddMetalinkResult
  'aria2.addTorrent': Aria2AddTorrentResult
  'aria2.addUri': Aria2AddUriResult
}

export type Aria2RpcMethod = keyof Aria2RpcMethodCallMap
