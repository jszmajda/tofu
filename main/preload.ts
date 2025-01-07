import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { AWSCreds } from '../renderer/lib/types'

contextBridge.exposeInMainWorld('themeData', {
  onUpdateDarkMode: (callback) => ipcRenderer.on('dark-mode-updated', (_event, value) => callback(value)),
  // query main thread to see if nativeTheme is dark
  getIsDarkMode: () => ipcRenderer.invoke('getIsDarkMode')
});

// when ipc receives an awsCreds message, set the object received to be exposed in the main world
contextBridge.exposeInMainWorld('awsCreds', {
    getAwsCreds: async (): Promise<AWSCreds> => {
        const creds = await ipcRenderer.invoke('getAwsCreds');
        return creds;
    }
})

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
