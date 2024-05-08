import { app, BrowserWindow,dialog, Menu  } from 'electron'
import { readFileSync } from 'fs';
import { createReadStream } from 'fs';
import { promisify } from 'util';
const fs = require('fs');


app.commandLine.appendSwitch('disable-http-cache');
Menu.setApplicationMenu(null)

async function createWindow() {
    const win = await new BrowserWindow({
        width: 1220,
        height: 765,
        minWidth: 1160,// 1080*690
        minHeight: 765,
        frame:false,
        resizable: true,
        webPreferences: {
            nodeIntegration: true, // 启用Node.js集成
            contextIsolation: false, // 上下文隔离
            webSecurity: false, // web安全策略：开启则不能访问本机路径的文件
        },
    })
    win.setMenu(null)
    win.setMaximizable(false)
    win.webContents.on('did-finish-load', () => {
        // win.webContents.insertCSS(`
        // ::-webkit-scrollbar {
        //     display: none;
        // }
        // `)
    })
    // 去除警告：Policy set or a policy with “unsafe-eval“ enabled. 
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    // 根据命令行参数加载URL或本地文件
    if (process.argv[2]) {
        win.loadURL(process.argv[2])
    } else {
        win.loadFile('index.html')
    }
    // Open the DevTools.
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

    const devInnerHeight: number = 1080.0; // 开发时的 InnerHeight
    const devDevicePixelRatio: number = 1.0; // 开发时的 device pixel ratio
    const devScaleFactor: number = 1.3; // 开发时的 ScaleFactor
    const scaleFactor: number = require('electron').screen.getPrimaryDisplay().scaleFactor;
    const zoomFactor: number = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor);
    require('electron').webFrame.setZoomFactor(zoomFactor);
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  