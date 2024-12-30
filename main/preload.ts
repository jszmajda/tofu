import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { AWSCreds } from '../renderer/lib/types'


// when ipc receives an awsCreds message, set the object received to be exposed in the main world
contextBridge.exposeInMainWorld('awsCreds', {
    getAwsCreds: async (): Promise<AWSCreds> => {
        const creds = await ipcRenderer.invoke('getAwsCreds');
        console.log("-- creds --", creds);
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
