import { app, BrowserWindow,dialog, Menu  } from 'electron'
import { readFileSync } from 'fs';
import path from 'path';

app.commandLine.appendSwitch('disable-http-cache');
Menu.setApplicationMenu(null)

async function createWindow() {
    const win = await new BrowserWindow({
        width: 1180,
        height: 760,
        // minWidth: 300,//移动端
        minWidth:1180,//PC端
        minHeight: 760,
        frame:false,
        resizable: true,

        // 配置窗口的WebPreferences选项，用于控制渲染进程的行为
        webPreferences: {
            nodeIntegration: true, // 启用Node.js集成
            contextIsolation: false, // 上下文隔离
            webSecurity: false, // web安全策略：开启则不能访问本机路径的文件
        },
    })
    win.setMenu(null)
    // 设置窗口是否可以由用户手动最大化。
    win.setMaximizable(false)
    // 禁用水平滚动条
    win.webContents.on('did-finish-load', () => {
        win.webContents.insertCSS(`
        ::-webkit-scrollbar {
            display: none;
        }
        `)
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
        mode:'bottom'
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
    
    ipc.on('open-music-file', (event) => {
        dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Music', extensions: ['mp3', 'flac'] }]
        }).then((res) => {
            // 拿到结果
            const { canceled, filePaths } = res
            if (!canceled && filePaths.length) {
                event.sender.send('selected-file', filePaths)
            }
        }).catch(err => {
            // 错误
        })
    }); 
    ipc.handle('readFile', async (event, filePath) => {
        return readFileSync(filePath);
    });
}

// 等待Electron应用就绪后创建BrowserWindow窗口
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

  