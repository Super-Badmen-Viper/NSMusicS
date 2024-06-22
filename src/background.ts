import { app, BrowserWindow } from 'electron'
import { readFileSync } from 'fs';
import { System_Configs_Write } from '@/features/system_configs/System_Configs_Write';

async function createWindow() {
    const win = await new BrowserWindow({
        width: 1220,
        height: 765,
        minWidth: 1160,
        minHeight: 765,
        frame:false,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        },
    })
    win.setMenu(null)
    win.setMaximizable(false)
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    if (process.argv[2]) {
        win.loadURL(process.argv[2])
    } else {
        win.loadFile('index.html')
    }
    win.webContents.openDevTools({
        mode:'detach'
    });

    const electron = require('electron')
    const ipc = electron.ipcMain
    ipc.on('window-min', function () {
        win.minimize();
    })
    ipc.on('window-max', function () {
    if (win.isMaximized()) {
        win.restore();
    } else {
        win.setMaximizable(true);
        win.maximize();
        win.setMaximizable(false);
    }
    })
    ipc.on('window-close', function () {
        win.close();
    })

    ipc.on('window-gc', function () {
        win.webContents.session.flushStorageData();
    })
    
    ipc.handle('readFile', async (event, filePath) => {
        return readFileSync(filePath);
    });

    const { app } = require('electron');
    const appPath = app.getAppPath();
    ipc.handle('getAppPath', async () => {
        return appPath;
    });
}

app.whenReady().then(() => {
    createWindow(); 

    const devInnerHeight: number = 1080.0;
    const devDevicePixelRatio: number = 1.0;
    const devScaleFactor: number = 1.3;
    const scaleFactor: number = require('electron').screen.getPrimaryDisplay().scaleFactor;
    const zoomFactor: number = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor);
    require('electron').webFrame.setZoomFactor(zoomFactor);
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  