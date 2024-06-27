import { app, BrowserWindow } from 'electron'
import fs, { readFileSync } from 'fs';
import path from "path";
import { contextBridge, ipcRenderer } from 'electron'

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
            webSecurity: false
        },
    })
    win.setMenu(null)
    win.setMaximizable(false)
    // win.webContents.openDevTools({
    //     mode:'detach'
    // });
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

    ////// mpv service for win
    const mpvAPI = require('node-mpv');
    let mpv = new mpvAPI({
        audio_only: true,
        auto_restart: true,
        binary: path.resolve("resources/mpv-x86_64-20240623/mpv.exe"),
        debug: true,
        verbose: true
    });
    await mpv.start();
    await mpv.pause();
    let isPlaying = false;
    let isResumeing = false;
    ipc.handle('mpv-load', async (event,filePath) => {
        try {
            await mpv.load(filePath);
            await mpv.play();
            isPlaying = true;
            isResumeing = false;
            return true;
        } catch (error) {
            console.error('Error loading file in mpv:', error);
            return false;
        }
    });
    ipc.handle('mpv-isRunning',  async (event) => {
        return mpv.isRunning();
    });
    ipc.handle('mpv-isPlaying',  async (event) => {
        return isPlaying;
    });
    ipc.handle('mpv-isResumeing',  async (event) => {
        return isResumeing;
    });
    ipc.handle('mpv-play',  async (event) => {
        await mpv.resume();
        isPlaying = true;
        isResumeing = false;
    });
    ipc.handle('mpv-pause',  async (event) => {
        await mpv.pause();
        isPlaying = false;
        isResumeing = true;
    });
    ipc.handle('mpv-get-duration', async (event) => {
        try { return await mpv.getDuration() }catch{ return 0 }
    });
    ipc.handle('mpv-get-time-pos', async (event) => {
        try { return await mpv.getTimePosition() }catch{ return 0 }
    });
    ipc.handle('mpv-set-time-pos', async (event,timePos) => {
        await mpv.seek(timePos,"absolute")
    });
    ipc.handle('mpv-set-volume', async (event,volume) => {
        await mpv.volume(volume)
    });
    mpv.on('stopped', () => {
        win.webContents.send("mpv-stopped", true);
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
    session.defaultSession.clearCache();
    require("v8").setFlagsFromString("--expose_gc");
    global.gc = require("vm").runInNewContext("gc");
}
app.on('ready', () => {
    setTimeout(clear_session_clearCache, 5000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

  