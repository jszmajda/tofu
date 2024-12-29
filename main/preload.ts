import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

interface AWSCreds {
  accessKeyId: string;
  secretAccessKey: string;
}

let awsCreds: AWSCreds = null;
// when ipc receives an awsCreds message, set the object received to be exposed in the main world
ipcRenderer.on('awsCreds', (event, arg) => {
    awsCreds = arg;
});
contextBridge.exposeInMainWorld('awsCreds', {
    getAwsCreds: () => {
        return awsCreds;
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
