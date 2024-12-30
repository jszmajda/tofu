import fs from 'fs'
import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { AWSCreds } from '../renderer/lib/types'
import { execSync } from 'child_process';


const loadCredentials = () => {
  let credentials: AWSCreds = {
    AccessKeyId: undefined,
    SecretAccessKey: undefined
  }
  try {
    const awsCredentials = execSync('aws configure export-credentials').toString();
    credentials = JSON.parse(awsCredentials);
  } catch (error) {
    console.log('Could not load AWS credentials:', error);

    // try loading it from the credentials file
    const credsData = fs.readFileSync(path.join(process.env.HOME, '.aws', 'credentials'), { encoding: 'utf8', flag: 'r' });
    // read aws credentials from file and set into an object
    credentials = credsData.split('\n').reduce((acc: any, line) => {
      const [key, value]: string[] = line.split('=')
      if (key && value) {
        acc[key.trim()] = value.trim()
      }
      return acc
    }, {});
  }
  return credentials;
}

// Initial load of credentials
loadCredentials();

// Handle IPC requests for credential updates
ipcMain.handle('getAwsCreds', async () => {
  return loadCredentials();
});

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
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    // mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
