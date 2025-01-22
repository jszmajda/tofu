import fs from 'fs'
import path from 'path'
import { app, ipcMain, nativeTheme } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { AWSCreds } from '../renderer/lib/types'
import { execSync } from 'child_process';
import glob from 'fast-glob';


/** AWS Credential Loading **/
const loadCredentials = () => {
  let credentials: AWSCreds = {
    AccessKeyId: undefined,
    SecretAccessKey: undefined
  }
  try {
    const awsCredentials = execSync('/usr/bin/env aws configure export-credentials').toString();
    credentials = JSON.parse(awsCredentials);
    console.log("creds: ", credentials);
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
    credentials['AccessKeyId'] = credentials['aws_access_key_id'];
    credentials['SecretAccessKey'] = credentials['aws_secret_access_key'];
    credentials['SessionToken'] = credentials['aws_session_token'];
  }
  return credentials;
}

// Initial load of credentials
loadCredentials();

// Handle IPC requests for credential updates
ipcMain.handle('getAwsCreds', async () => {
  return loadCredentials();
});

/** Obsidian Vault Loading **/

const findFileForTitle = async (title: string, vaultPath: string) => {
  const search = path.join(vaultPath, '**', `${title}.md`);
  try {
    const files = await glob(search);
    if (files.length > 0) {
      return files[0].replace(vaultPath, '');
    }
    return null;
  } catch (error) {
    console.error('Error finding file:', error);
    throw error;
  }
}

const loadDocument = async (pathAndFilename: string, vaultPath: string) => {
  if (!pathAndFilename.endsWith('.md')) {
    pathAndFilename += '.md';
  }
  try {
    const fileContent = fs.readFileSync(path.join(vaultPath, pathAndFilename), { encoding: 'utf8', flag: 'r' });
    const output: string[] = [];
    const lines = fileContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trimEnd();
      
      if (!/^\s*$/.test(trimmedLine)) {
        const match = /^--include: \[\[(.*)\]\]$/.exec(trimmedLine);

        if (match) {
          const matchDocument = match[1];
          const documentFile = await findFileForTitle(matchDocument, vaultPath);
          if (documentFile) {
            output.push(await loadDocument(documentFile, vaultPath));
          }
        } else {
          output.push(trimmedLine);
        }
      }
    }

    return output.join('\n');
  } catch (error) {
    console.error('Error loading document:', error);
    throw error;
  }
}

// Handle the IPC calls
ipcMain.handle('load-document', async (event, { pathAndFilename, vaultPath }) => {
  try {
    const content = await loadDocument(pathAndFilename, vaultPath);
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('find-file', async (event, { title, vaultPath }) => {
  try {
    const file = await findFileForTitle(title, vaultPath);
    return { success: true, file };
  } catch (error) {
    return { success: false, error: error.message };
  }
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
    icon: path.join(__dirname, 'resources', 'icon.icns'),
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

  //use nativeTheme to detect dark mode
  nativeTheme.on('updated', () => {
    //send message to renderer to update dark mode
    mainWindow.webContents.send('dark-mode-updated', nativeTheme.shouldUseDarkColors)
  })
  ipcMain.handle('getIsDarkMode', () => nativeTheme.shouldUseDarkColors)

})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
