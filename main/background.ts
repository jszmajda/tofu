import fs from 'fs'
import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'


const credsData = fs.readFileSync(path.join(process.env.HOME, '.aws', 'credentials'), {encoding: 'utf8', flag: 'r'});
// read aws credentials from file and set into an object
const credentials = credsData.split('\n').reduce((acc: any, line) => {
    const [key, value]: string[] = line.split('=')
    if (key && value) {
        acc[key.trim()] = value.trim()
    }
    return acc
}, {});

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      contextIsolation: true,
      sandbox: true
    },
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' data:;" +
          "connect-src 'self' https://*.amazonaws.com https://*.us-east-1.amazonaws.com https://*.us-west-1.amazonaws.com;" +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';" +
          "style-src 'self' 'unsafe-inline';"
        ]
      }
    });
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home')
      .then(() => {
        mainWindow.webContents.send('awsCreds', credentials);
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow.webContents.send('awsCreds', credentials);
        });
      })
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
      .then(() => {
        mainWindow.webContents.send('awsCreds', credentials);
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow.webContents.send('awsCreds', credentials);
        });
      })
    // mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
