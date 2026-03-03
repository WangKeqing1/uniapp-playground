import { contextBridge, ipcRenderer } from 'electron'

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('electron', {
  // 环境版本信息
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  // IPC 通信：发送消息
  ipcSend: (channel: string, ...args: unknown[]) => {
    const validChannels = ['to-main', 'open-explorer']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args)
    }
  },
  // IPC 通信：接收回复
  ipcOn: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = ['from-main']
    if (validChannels.includes(channel)) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: any[]) => callback(...args)
      ipcRenderer.on(channel, subscription)
      return () => ipcRenderer.removeListener(channel, subscription)
    }
  },
  // 获取并转换平台信息（直接返回常量）
  platform: process.platform,
})
