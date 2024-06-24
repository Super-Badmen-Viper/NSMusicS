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
    win.webContents.openDevTools({
        mode:'detach'
    });
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    if (process.argv[2]) {
        win.loadURL(process.argv[2])
    } else {
        win.loadFile('index.html')
    }

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
        setTimeout(clear_session_clearCache, 5000);
    })
    let lastResetTime: number | null = null;
    const RESET_DEBOUNCE_TIME = 6000;
    ipc.on('window-reset-data', function () {
        const currentTime = Date.now();
        if (!lastResetTime || currentTime - lastResetTime >= RESET_DEBOUNCE_TIME) {
            lastResetTime = currentTime;
            win.webContents.loadURL('about:blank');
            if (process.argv[2]) {
                win.loadURL(process.argv[2])
            } else {
                win.loadFile('index.html')
            }
        }
    });
    ipc.on('window-reset-all', function () {
        win.close();
        createWindow();
    })

    //////
    ipc.handle('readFile', async (event, filePath) => {
        return readFileSync(filePath);
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

const { session } = require('electron');
function clear_session_clearCache() {
    const currentSession = session.defaultSession;
    currentSession.clearCache().then(() => {
        console.log('Cache cleared');
    });
    require("v8").setFlagsFromString("--expose_gc");
    global.gc = require("vm").runInNewContext("gc");
    console.log('global.gc used');
}
app.on('ready', () => {
    setTimeout(clear_session_clearCache, 5000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  